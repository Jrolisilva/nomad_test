import { Injectable } from '@nestjs/common';
import { Match } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MatchRepository {
  constructor(private readonly prisma: PrismaService) {}

  upsertMatch(data: {
    externalId: string;
    startedAt: Date;
    endedAt?: Date | null;
  }): Promise<Match> {
    return this.prisma.match.upsert({
      where: { externalId: data.externalId },
      update: {
        startedAt: data.startedAt,
        endedAt: data.endedAt ?? null,
      },
      create: {
        externalId: data.externalId,
        startedAt: data.startedAt,
        endedAt: data.endedAt ?? null,
      },
    });
  }

  findByExternalId(externalId: string): Promise<Match | null> {
    return this.prisma.match.findUnique({ where: { externalId } });
  }
}
