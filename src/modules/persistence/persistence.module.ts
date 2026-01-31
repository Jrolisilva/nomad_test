import { Module } from '@nestjs/common';
import { MatchRepository } from './repositories/match.repository';
import { PlayerRepository } from './repositories/player.repository';
import { StatsRepository } from './repositories/stats.repository';
import { KillEventRepository } from './repositories/kill-event.repository';

@Module({
  providers: [MatchRepository, PlayerRepository, StatsRepository, KillEventRepository],
  exports: [MatchRepository, PlayerRepository, StatsRepository, KillEventRepository],
})
export class PersistenceModule {}
