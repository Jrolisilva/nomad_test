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

  async findRankingByMatchId(
    matchId: number,
  ): Promise<
    {
      playerName: string;
      frags: number;
      deaths: number;
    }[]
  > {
    const stats = await this.prisma.matchPlayerStats.findMany({
      where: { matchId },
      include: { player: true },
      orderBy: [
        { frags: 'desc' },
        { deaths: 'asc' },
        { player: { name: 'asc' } },
      ],
    });

    return stats.map((entry) => ({
      playerName: entry.player.name,
      frags: entry.frags,
      deaths: entry.deaths,
    }));
  }

  async findGlobalRanking(): Promise<
    {
      playerName: string;
      frags: number;
      deaths: number;
    }[]
  > {
    const aggregated = await this.prisma.matchPlayerStats.groupBy({
      by: ['playerId'],
      _sum: { frags: true, deaths: true },
      orderBy: [
        { _sum: { frags: 'desc' } },
        { _sum: { deaths: 'asc' } },
      ],
    });

    if (aggregated.length === 0) {
      return [];
    }

    const playerIds = aggregated.map((entry) => entry.playerId);
    const players = await this.prisma.player.findMany({
      where: { id: { in: playerIds } },
      select: { id: true, name: true },
    });

    const playerNameById = new Map(players.map((player) => [player.id, player.name]));

    return aggregated
      .map((entry) => ({
        playerName: playerNameById.get(entry.playerId) ?? 'Unknown',
        frags: entry._sum.frags ?? 0,
        deaths: entry._sum.deaths ?? 0,
      }))
      .sort(
        (a, b) =>
          b.frags - a.frags || a.deaths - b.deaths || a.playerName.localeCompare(b.playerName),
      );
  }
  async findWinnerByMatchId(
    matchId: number,
  ): Promise<
    {
      playerId: number;
      playerName: string;
      frags: number;
      deaths: number;
    } | null
  > {
    const stats = await this.prisma.matchPlayerStats.findMany({
      where: { matchId },
      include: { player: true },
      orderBy: [
        { frags: 'desc' },
        { deaths: 'asc' },
        { player: { name: 'asc' } },
      ],
      take: 1,
    });

    if (stats.length === 0) {
      return null;
    }

    return {
      playerId: stats[0].playerId,
      playerName: stats[0].player.name,
      frags: stats[0].frags,
      deaths: stats[0].deaths,
    };
  }
}
