import { Injectable } from '@nestjs/common';
import { GetMatchRankingUseCase } from './use-cases/get-match-ranking.usecase';
import type { MatchRankingResponseDto } from './dto/match-ranking.dto';

@Injectable()
export class MatchesService {
  constructor(
    private readonly getMatchRankingUseCase: GetMatchRankingUseCase,
  ) {}

  getMatchRanking(externalId: string): Promise<MatchRankingResponseDto> {
    return this.getMatchRankingUseCase.execute(externalId);
  }
}
