import { NotFoundException } from '@nestjs/common';
import { GetMatchRankingUseCase } from './get-match-ranking.usecase';

describe('GetMatchRankingUseCase', () => {
  const matchRepository = {
    findByExternalId: jest.fn(),
  };
  const statsRepository = {
    findRankingByMatchId: jest.fn(),
  };

  const useCase = new GetMatchRankingUseCase(
    matchRepository as any,
    statsRepository as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws when match is not found', async () => {
    matchRepository.findByExternalId.mockResolvedValue(null);

    await expect(useCase.execute('123')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns ranking for match', async () => {
    matchRepository.findByExternalId.mockResolvedValue({ id: 1, externalId: '123' });
    statsRepository.findRankingByMatchId.mockResolvedValue([
      { playerName: 'Roman', frags: 2, deaths: 0 },
      { playerName: 'Nick', frags: 0, deaths: 2 },
    ]);

    const result = await useCase.execute('123');

    expect(result).toEqual({
      matchId: '123',
      ranking: [
        { player: 'Roman', frags: 2, deaths: 0 },
        { player: 'Nick', frags: 0, deaths: 2 },
      ],
    });
  });
});
