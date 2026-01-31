import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { GetMatchRankingUseCase } from './use-cases/get-match-ranking.usecase';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService, GetMatchRankingUseCase],
  exports: [MatchesService],
})
export class MatchesModule {}
