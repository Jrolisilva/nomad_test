import { Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PlayerRepository {
  constructor(private readonly prisma: PrismaService) {}

  upsertPlayer(name: string): Promise<Player> {
    return this.prisma.player.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
}
