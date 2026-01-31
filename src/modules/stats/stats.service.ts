import { Injectable } from '@nestjs/common';
import type { MatchStatsResponseDto } from './dto/match-stats.dto';
import { CalculateStreaksUseCase } from './use-cases/calculate-streaks.usecase';
import { CalculateAwardsUseCase } from './use-cases/calculate-awards.usecase';
import { CalculateFavoriteWeaponUseCase } from './use-cases/calculate-favorite-weapon.usecase';

@Injectable()
export class StatsService {
  constructor(
    private readonly calculateStreaks: CalculateStreaksUseCase,
    private readonly calculateAwards: CalculateAwardsUseCase,
    private readonly calculateFavoriteWeapon: CalculateFavoriteWeaponUseCase,
  ) {}

  getMatchStats(externalId: string): Promise<MatchStatsResponseDto> {
    return this.calculateFavoriteWeapon.execute(externalId);
  }
}
