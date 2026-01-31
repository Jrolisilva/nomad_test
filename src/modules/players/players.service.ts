import { Injectable } from '@nestjs/common';
import { GetGlobalRankingUseCase } from './use-cases/get-global-ranking.usecase';
import type { GlobalRankingResponseDto } from './dto/global-ranking.dto';

@Injectable()
export class PlayersService {
  constructor(
    private readonly getGlobalRankingUseCase: GetGlobalRankingUseCase,
  ) {}

  getGlobalRanking(): Promise<GlobalRankingResponseDto> {
    return this.getGlobalRankingUseCase.execute();
  }
}
