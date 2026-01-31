import { Injectable } from '@nestjs/common';
import { GetGlobalRankingUseCase } from './use-cases/get-global-ranking.usecase';

@Injectable()
export class PlayersService {
  constructor(private readonly getGlobalRanking: GetGlobalRankingUseCase) {}
}
