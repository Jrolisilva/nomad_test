import { Injectable, NotFoundException } from '@nestjs/common';
import { MatchRepository } from '../../persistence/repositories/match.repository';
import { StatsRepository } from '../../persistence/repositories/stats.repository';
import type {
  MatchRankingEntryDto,
  MatchRankingResponseDto,
} from '../dto/match-ranking.dto';

@Injectable()
export class GetMatchRankingUseCase {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly statsRepository: StatsRepository,
  ) {}

  async execute(externalId: string): Promise<MatchRankingResponseDto> {
    const match = await this.matchRepository.findByExternalId(externalId);
    if (!match) {
      throw new NotFoundException(`Match ${externalId} não encontrada.`);
    }

    const ranking = await this.statsRepository.findRankingByMatchId(match.id);
    const responseRanking: MatchRankingEntryDto[] = ranking.map((entry) => ({
      player: entry.playerName,
      frags: entry.frags,
      deaths: entry.deaths,
    }));

    return {
      matchId: match.externalId,
      ranking: responseRanking,
    };
  }
}
