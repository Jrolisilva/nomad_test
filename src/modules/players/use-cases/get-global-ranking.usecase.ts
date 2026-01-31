import { Injectable } from '@nestjs/common';
import { StatsRepository } from '../../persistence/repositories/stats.repository';
import type {
  GlobalRankingEntryDto,
  GlobalRankingResponseDto,
} from '../dto/global-ranking.dto';

@Injectable()
export class GetGlobalRankingUseCase {
  constructor(private readonly statsRepository: StatsRepository) {}

  async execute(): Promise<GlobalRankingResponseDto> {
    const ranking = await this.statsRepository.findGlobalRanking();
    const responseRanking: GlobalRankingEntryDto[] = ranking.map((entry) => ({
      player: entry.playerName,
      frags: entry.frags,
      deaths: entry.deaths,
    }));

    return { ranking: responseRanking };
  }
}
