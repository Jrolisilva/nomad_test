import { Controller, Get, Param } from '@nestjs/common';
import { MatchesService } from './matches.service';
import type { MatchRankingResponseDto } from './dto/match-ranking.dto';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get(':externalId/ranking')
  getMatchRanking(
    @Param('externalId') externalId: string,
  ): Promise<MatchRankingResponseDto> {
    return this.matchesService.getMatchRanking(externalId);
  }
}
