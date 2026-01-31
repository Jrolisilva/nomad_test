import { Injectable } from '@nestjs/common';
import { GetMatchRankingUseCase } from './use-cases/get-match-ranking.usecase';

@Injectable()
export class MatchesService {
  constructor(private readonly getMatchRanking: GetMatchRankingUseCase) {}
}
