export interface MatchRankingEntryDto {
  player: string;
  frags: number;
  deaths: number;
}

export interface MatchRankingResponseDto {
  matchId: string;
  ranking: MatchRankingEntryDto[];
}
