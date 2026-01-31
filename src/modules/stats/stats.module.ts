import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { CalculateStreaksUseCase } from './use-cases/calculate-streaks.usecase';
import { CalculateAwardsUseCase } from './use-cases/calculate-awards.usecase';
import { CalculateFavoriteWeaponUseCase } from './use-cases/calculate-favorite-weapon.usecase';

@Module({
  imports: [PersistenceModule],
  controllers: [StatsController],
  providers: [
    StatsService,
    CalculateStreaksUseCase,
    CalculateAwardsUseCase,
    CalculateFavoriteWeaponUseCase,
  ],
  exports: [StatsService],
})
export class StatsModule {}
