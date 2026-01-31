import { Injectable } from '@nestjs/common';
import { KillEventRepository } from '../persistence/repositories/kill-event.repository';
import { MatchRepository } from '../persistence/repositories/match.repository';
import { PlayerRepository } from '../persistence/repositories/player.repository';
import { StatsRepository } from '../persistence/repositories/stats.repository';
import { KillParser, KillParseResult } from './parsers/kill.parser';
import { MatchEndParser } from './parsers/match-end.parser';
import { MatchStartParser, MatchStartParseResult } from './parsers/match-start.parser';

interface ParsedMatch {
  externalId: string;
  startedAt: Date;
  endedAt: Date | null;
  stats: Map<string, { frags: number; deaths: number }>;
  killEvents: ParsedKillEvent[];
}

interface ParsedKillEvent {
  occurredAt: Date;
  killer: string | null;
  victim: string;
  weapon: string;
  isWorld: boolean;
}

interface ParseSummary {
  totalLines: number;
  matchesProcessed: number;
}

@Injectable()
export class ParserService {
  constructor(
    private readonly matchStartParser: MatchStartParser,
    private readonly killParser: KillParser,
    private readonly matchEndParser: MatchEndParser,
    private readonly matchRepository: MatchRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly statsRepository: StatsRepository,
    private readonly killEventRepository: KillEventRepository,
  ) {}

  async parseAndPersist(content: string): Promise<ParseSummary> {
    const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
    const matches: ParsedMatch[] = [];
    let currentMatch: ParsedMatch | null = null;

    for (const line of lines) {
      const start = this.matchStartParser.parse(line);
      if (start) {
        currentMatch = this.startMatch(start);
        continue;
      }

      const kill = this.killParser.parse(line);
      if (kill && currentMatch) {
        this.registerKill(currentMatch, kill);
        continue;
      }

      const end = this.matchEndParser.parse(line);
      if (end && currentMatch) {
        if (end.externalId === currentMatch.externalId) {
          currentMatch.endedAt = this.parseDate(end.endedAtRaw);
        }
        matches.push(currentMatch);
        currentMatch = null;
      }
    }

    if (currentMatch) {
      matches.push(currentMatch);
    }

    for (const match of matches) {
      await this.persistMatch(match);
    }

    return { totalLines: lines.length, matchesProcessed: matches.length };
  }

  private startMatch(start: MatchStartParseResult): ParsedMatch {
    return {
      externalId: start.externalId,
      startedAt: this.parseDate(start.startedAtRaw),
      endedAt: null,
      stats: new Map(),
      killEvents: [],
    };
  }

  private registerKill(match: ParsedMatch, kill: KillParseResult): void {
    if (!match.stats.has(kill.victim)) {
      match.stats.set(kill.victim, { frags: 0, deaths: 0 });
    }

    const victimStats = match.stats.get(kill.victim);
    if (victimStats) {
      victimStats.deaths += 1;
    }

    if (!kill.isWorld) {
      if (!match.stats.has(kill.killer)) {
        match.stats.set(kill.killer, { frags: 0, deaths: 0 });
      }

      const killerStats = match.stats.get(kill.killer);
      if (killerStats) {
        killerStats.frags += 1;
      }
    }

    match.killEvents.push({
      occurredAt: this.parseDate(kill.occurredAtRaw),
      killer: kill.isWorld ? null : kill.killer,
      victim: kill.victim,
      weapon: kill.weapon,
      isWorld: kill.isWorld,
    });
  }

  private async persistMatch(match: ParsedMatch): Promise<void> {
    const persistedMatch = await this.matchRepository.upsertMatch({
      externalId: match.externalId,
      startedAt: match.startedAt,
      endedAt: match.endedAt,
    });

    const playerNameSet = new Set<string>();
    for (const name of match.stats.keys()) {
      playerNameSet.add(name);
    }
    for (const event of match.killEvents) {
      playerNameSet.add(event.victim);
      if (event.killer) {
        playerNameSet.add(event.killer);
      }
    }

    const playerIdByName = new Map<string, number>();
    for (const name of playerNameSet) {
      const player = await this.playerRepository.upsertPlayer(name);
      playerIdByName.set(name, player.id);
    }

    for (const [playerName, stats] of match.stats.entries()) {
      const playerId = playerIdByName.get(playerName);
      if (!playerId) {
        continue;
      }

      await this.statsRepository.upsertStats({
        matchId: persistedMatch.id,
        playerId,
        frags: stats.frags,
        deaths: stats.deaths,
      });
    }

    const killEventsPayload = match.killEvents.map((event) => ({
      matchId: persistedMatch.id,
      killerId: event.killer ? playerIdByName.get(event.killer) ?? null : null,
      victimId: playerIdByName.get(event.victim) ?? 0,
      weapon: event.weapon,
      isWorld: event.isWorld,
      occurredAt: event.occurredAt,
    }));

    await this.killEventRepository.createMany(killEventsPayload);
  }

  private parseDate(value: string): Date {
    const [datePart, timePart] = value.split(" ");
    const [day, month, year] = datePart.split("/");
    const isoString = `${year}-${month}-${day}T${timePart}`;
    return new Date(isoString);
  }
}
