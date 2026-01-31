import { Injectable, NotFoundException } from '@nestjs/common';
import { KillEventRepository } from '../../persistence/repositories/kill-event.repository';
import { MatchRepository } from '../../persistence/repositories/match.repository';
import { StatsRepository } from '../../persistence/repositories/stats.repository';
import type { MatchAwardsDto } from '../dto/match-awards.dto';

const SPEED_KILLER_THRESHOLD = 5;
const SPEED_KILLER_WINDOW_MS = 60_000;

@Injectable()
export class CalculateAwardsUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly statsRepository: StatsRepository,
    private readonly killEventRepository: KillEventRepository,
  ) {}

  async execute(externalId: string): Promise<MatchAwardsDto> {
    const match = await this.matchRepository.findByExternalId(externalId);
    if (!match) {
      throw new NotFoundException(`Match ${externalId} não encontrada.`);
    }

    const [winner, events] = await Promise.all([
      this.statsRepository.findWinnerByMatchId(match.id),
      this.killEventRepository.findByMatchIdOrderedWithTime(match.id),
    ]);

    const noDeathAward = this.getNoDeathAward(winner);
    const speedKillerAward = this.getSpeedKillerAward(events);

    return {
      noDeathAward,
      speedKillerAward,
    };
  }

  private getNoDeathAward(
    winner: { playerName: string; deaths: number } | null,
  ): string[] {
    if (!winner) {
      return [];
    }

    return winner.deaths === 0 ? [winner.playerName] : [];
  }

  private getSpeedKillerAward(
    events: {
      occurredAt: Date;
      killer: { id: number; name: string } | null;
      isWorld: boolean;
    }[],
  ): string[] {
    const awarded = new Set<string>();
    const killsByPlayer = new Map<number, Date[]>();

    for (const event of events) {
      if (!event.killer || event.isWorld) {
        continue;
      }

      const killerId = event.killer.id;
      const killerName = event.killer.name;
      const list = killsByPlayer.get(killerId) ?? [];

      list.push(event.occurredAt);
      const windowStart = event.occurredAt.getTime() - SPEED_KILLER_WINDOW_MS;
      while (list.length > 0 && list[0].getTime() < windowStart) {
        list.shift();
      }

      killsByPlayer.set(killerId, list);

      if (list.length >= SPEED_KILLER_THRESHOLD) {
        awarded.add(killerName);
      }
    }

    return Array.from(awarded.values()).sort((a, b) => a.localeCompare(b));
  }
}
