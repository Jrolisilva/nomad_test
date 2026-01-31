import { Injectable, NotFoundException } from '@nestjs/common';
import { KillEventRepository } from '../../persistence/repositories/kill-event.repository';
import { MatchRepository } from '../../persistence/repositories/match.repository';
import { StatsRepository } from '../../persistence/repositories/stats.repository';
import type { MatchStatsResponseDto } from '../dto/match-stats.dto';

@Injectable()
export class CalculateFavoriteWeaponUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly statsRepository: StatsRepository,
    private readonly killEventRepository: KillEventRepository,
  ) {}

  async execute(externalId: string): Promise<MatchStatsResponseDto> {
    const match = await this.matchRepository.findByExternalId(externalId);
    if (!match) {
      throw new NotFoundException(`Match ${externalId} não encontrada.`);
    }

    const winner = await this.statsRepository.findWinnerByMatchId(match.id);
    if (!winner) {
      return { matchId: match.externalId, winner: null, favoriteWeapon: null };
    }

    const favoriteWeapon = await this.killEventRepository.findFavoriteWeapon(
      match.id,
      winner.playerId,
    );

    return {
      matchId: match.externalId,
      winner: winner.playerName,
      favoriteWeapon,
    };
  }
}
