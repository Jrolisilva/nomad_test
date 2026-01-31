import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { GetGlobalRankingUseCase } from './use-cases/get-global-ranking.usecase';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService, GetGlobalRankingUseCase],
  exports: [PlayersService],
})
export class PlayersModule {}
