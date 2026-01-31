import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { GetMatchRankingUseCase } from './use-cases/get-match-ranking.usecase';

@Module({
  imports: [PersistenceModule],
  controllers: [MatchesController],
  providers: [MatchesService, GetMatchRankingUseCase],
  exports: [MatchesService],
})
export class MatchesModule {}
