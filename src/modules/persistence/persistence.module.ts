import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MatchRepository } from './repositories/match.repository';
import { PlayerRepository } from './repositories/player.repository';
import { StatsRepository } from './repositories/stats.repository';
import { KillEventRepository } from './repositories/kill-event.repository';

@Module({
  providers: [
    PrismaService,
    MatchRepository,
    PlayerRepository,
    StatsRepository,
    KillEventRepository,
  ],
  exports: [
    PrismaService,
    MatchRepository,
    PlayerRepository,
    StatsRepository,
    KillEventRepository,
  ],
})
export class PersistenceModule {}
