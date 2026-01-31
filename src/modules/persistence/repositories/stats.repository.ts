import { Injectable } from '@nestjs/common';
import { MatchPlayerStats } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StatsRepository {
  constructor(private readonly prisma: PrismaService) {}

  upsertStats(data: {
    matchId: number;
    playerId: number;
    frags: number;
    deaths: number;
  }): Promise<MatchPlayerStats> {
    return this.prisma.matchPlayerStats.upsert({
      where: {
        matchId_playerId: {
          matchId: data.matchId,
          playerId: data.playerId,
        },
      },
      update: {
        frags: data.frags,
        deaths: data.deaths,
      },
      create: {
        matchId: data.matchId,
        playerId: data.playerId,
        frags: data.frags,
        deaths: data.deaths,
      },
    });
  }
}
