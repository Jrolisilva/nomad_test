export interface GlobalRankingEntryDto {
  player: string;
  frags: number;
  deaths: number;
}

export interface GlobalRankingResponseDto {
  ranking: GlobalRankingEntryDto[];
}
