import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { GetGlobalRankingUseCase } from './use-cases/get-global-ranking.usecase';

@Module({
  imports: [PersistenceModule],
  controllers: [PlayersController],
  providers: [PlayersService, GetGlobalRankingUseCase],
  exports: [PlayersService],
})
export class PlayersModule {}
