import { Controller, Get, Param } from '@nestjs/common';
import type { MatchStatsResponseDto } from './dto/match-stats.dto';
import { StatsService } from './stats.service';

@Controller('matches')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get(':externalId/stats')
  getMatchStats(
    @Param('externalId') externalId: string,
  ): Promise<MatchStatsResponseDto> {
    return this.statsService.getMatchStats(externalId);
  }
}
