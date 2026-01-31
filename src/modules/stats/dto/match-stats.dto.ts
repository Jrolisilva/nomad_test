export interface MatchStreakDto {
  player: string | null;
  streak: number;
}

export interface MatchStatsResponseDto {
  matchId: string;
  winner: string | null;
  favoriteWeapon: string | null;
  bestStreak: MatchStreakDto;
  awards: {
    noDeathAward: string[];
    speedKillerAward: string[];
  };
}
