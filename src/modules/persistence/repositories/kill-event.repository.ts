import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class KillEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  createMany(
    data: {
      matchId: number;
      killerId?: number | null;
      victimId: number;
      weapon: string;
      isWorld: boolean;
      occurredAt: Date;
    }[],
  ): Promise<{ count: number }> {
    if (data.length === 0) {
      return Promise.resolve({ count: 0 });
    }

    return this.prisma.killEvent.createMany({ data });
  }

  async findFavoriteWeapon(
    matchId: number,
    killerId: number,
  ): Promise<string | null> {
    const grouped = await this.prisma.killEvent.groupBy({
      by: ['weapon'],
      where: {
        matchId,
        killerId,
        isWorld: false,
      },
      _count: { weapon: true },
      orderBy: { _count: { weapon: 'desc' } },
    });

    if (grouped.length === 0) {
      return null;
    }

    return grouped[0].weapon;
  }
}
