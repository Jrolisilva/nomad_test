import { Injectable } from '@nestjs/common';
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
}
