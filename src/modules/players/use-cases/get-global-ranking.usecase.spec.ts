import { GetGlobalRankingUseCase } from './get-global-ranking.usecase';

describe('GetGlobalRankingUseCase', () => {
  const statsRepository = {
    findGlobalRanking: jest.fn(),
  };

  const useCase = new GetGlobalRankingUseCase(statsRepository as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns global ranking', async () => {
    statsRepository.findGlobalRanking.mockResolvedValue([
      { playerName: 'Roman', frags: 3, deaths: 1 },
      { playerName: 'Nick', frags: 1, deaths: 3 },
    ]);

    const result = await useCase.execute();

    expect(result).toEqual({
      ranking: [
        { player: 'Roman', frags: 3, deaths: 1 },
        { player: 'Nick', frags: 1, deaths: 3 },
      ],
    });
  });
});
