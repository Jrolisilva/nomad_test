import { Injectable, NotFoundException } from '@nestjs/common';
import { KillEventRepository } from '../../persistence/repositories/kill-event.repository';
import { MatchRepository } from '../../persistence/repositories/match.repository';
import type { MatchStreakDto } from '../dto/match-stats.dto';

@Injectable()
export class CalculateStreaksUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly killEventRepository: KillEventRepository,
  ) {}

  async execute(externalId: string): Promise<MatchStreakDto> {
    const match = await this.matchRepository.findByExternalId(externalId);
    if (!match) {
      throw new NotFoundException(`Match ${externalId} não encontrada.`);
    }

    const events = await this.killEventRepository.findByMatchIdOrdered(match.id);
    if (events.length === 0) {
      return { player: null, streak: 0 };
    }

    const currentStreak = new Map<number, number>();
    const maxStreak = new Map<number, number>();
    const playerNameById = new Map<number, string>();

    for (const event of events) {
      playerNameById.set(event.victim.id, event.victim.name);
      if (event.killer) {
        playerNameById.set(event.killer.id, event.killer.name);
      }

      const victimId = event.victim.id;
      currentStreak.set(victimId, 0);

      if (event.killer && !event.isWorld) {
        const killerId = event.killer.id;
        const updated = (currentStreak.get(killerId) ?? 0) + 1;
        currentStreak.set(killerId, updated);
        const best = maxStreak.get(killerId) ?? 0;
        if (updated > best) {
          maxStreak.set(killerId, updated);
        }
      }
    }

    let bestPlayerId: number | null = null;
    let bestValue = 0;
    for (const [playerId, streak] of maxStreak.entries()) {
      if (streak > bestValue) {
        bestValue = streak;
        bestPlayerId = playerId;
      }
    }

    return {
      player: bestPlayerId ? playerNameById.get(bestPlayerId) ?? null : null,
      streak: bestValue,
    };
  }
}
