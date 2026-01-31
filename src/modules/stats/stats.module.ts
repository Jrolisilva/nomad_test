import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { CalculateStreaksUseCase } from './use-cases/calculate-streaks.usecase';
import { CalculateAwardsUseCase } from './use-cases/calculate-awards.usecase';
import { CalculateFavoriteWeaponUseCase } from './use-cases/calculate-favorite-weapon.usecase';

@Module({
  providers: [
    StatsService,
    CalculateStreaksUseCase,
    CalculateAwardsUseCase,
    CalculateFavoriteWeaponUseCase,
  ],
  exports: [StatsService],
})
export class StatsModule {}
