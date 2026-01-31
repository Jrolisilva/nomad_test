import { NotFoundException } from '@nestjs/common';
import { CalculateAwardsUseCase } from './calculate-awards.usecase';

describe('CalculateAwardsUseCase', () => {
  const matchRepository = {
    findByExternalId: jest.fn(),
  };
  const statsRepository = {
    findWinnerByMatchId: jest.fn(),
  };
  const killEventRepository = {
    findByMatchIdOrderedWithTime: jest.fn(),
  };

  const useCase = new CalculateAwardsUseCase(
    matchRepository as any,
    statsRepository as any,
    killEventRepository as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws when match is not found', async () => {
    matchRepository.findByExternalId.mockResolvedValue(null);

    await expect(useCase.execute('404')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns no awards when no winner and no events', async () => {
    matchRepository.findByExternalId.mockResolvedValue({ id: 1, externalId: '1' });
    statsRepository.findWinnerByMatchId.mockResolvedValue(null);
    killEventRepository.findByMatchIdOrderedWithTime.mockResolvedValue([]);

    const result = await useCase.execute('1');

    expect(result).toEqual({ noDeathAward: [], speedKillerAward: [] });
  });

  it('awards NoDeathAward to winner with zero deaths', async () => {
    matchRepository.findByExternalId.mockResolvedValue({ id: 1, externalId: '1' });
    statsRepository.findWinnerByMatchId.mockResolvedValue({
      playerName: 'Roman',
      deaths: 0,
    });
    killEventRepository.findByMatchIdOrderedWithTime.mockResolvedValue([]);

    const result = await useCase.execute('1');

    expect(result.noDeathAward).toEqual(['Roman']);
  });

  it('awards SpeedKillerAward when 5 kills in 1 minute', async () => {
    const base = new Date('2026-01-01T10:00:00Z');
    matchRepository.findByExternalId.mockResolvedValue({ id: 1, externalId: '1' });
    statsRepository.findWinnerByMatchId.mockResolvedValue({
      playerName: 'Roman',
      deaths: 1,
    });
    killEventRepository.findByMatchIdOrderedWithTime.mockResolvedValue([
      { occurredAt: new Date(base.getTime() + 1_000), killer: { id: 1, name: 'Roman' }, isWorld: false },
      { occurredAt: new Date(base.getTime() + 10_000), killer: { id: 1, name: 'Roman' }, isWorld: false },
      { occurredAt: new Date(base.getTime() + 20_000), killer: { id: 1, name: 'Roman' }, isWorld: false },
      { occurredAt: new Date(base.getTime() + 30_000), killer: { id: 1, name: 'Roman' }, isWorld: false },
      { occurredAt: new Date(base.getTime() + 50_000), killer: { id: 1, name: 'Roman' }, isWorld: false },
    ]);

    const result = await useCase.execute('1');

    expect(result.speedKillerAward).toEqual(['Roman']);
  });
});
