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
}
