import { NotFoundException } from '@nestjs/common';
import { CalculateStreaksUseCase } from './calculate-streaks.usecase';

describe('CalculateStreaksUseCase', () => {
  const matchRepository = {
    findByExternalId: jest.fn(),
  };
  const killEventRepository = {
    findByMatchIdOrdered: jest.fn(),
  };

  const useCase = new CalculateStreaksUseCase(
    matchRepository as any,
    killEventRepository as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws when match is not found', async () => {
    matchRepository.findByExternalId.mockResolvedValue(null);

    await expect(useCase.execute('404')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns empty when no events', async () => {
    matchRepository.findByExternalId.mockResolvedValue({ id: 1, externalId: '1' });
    killEventRepository.findByMatchIdOrdered.mockResolvedValue([]);

    const result = await useCase.execute('1');

    expect(result).toEqual({ player: null, streak: 0 });
  });

  it('calculates best streak', async () => {
    matchRepository.findByExternalId.mockResolvedValue({ id: 1, externalId: '1' });
    killEventRepository.findByMatchIdOrdered.mockResolvedValue([
      {
        isWorld: false,
        killer: { id: 1, name: 'Roman' },
        victim: { id: 2, name: 'Nick' },
      },
      {
        isWorld: false,
        killer: { id: 1, name: 'Roman' },
        victim: { id: 3, name: 'Marcus' },
      },
      {
        isWorld: false,
        killer: { id: 4, name: 'Jhon' },
        victim: { id: 1, name: 'Roman' },
      },
      {
        isWorld: false,
        killer: { id: 1, name: 'Roman' },
        victim: { id: 4, name: 'Jhon' },
      },
    ]);

    const result = await useCase.execute('1');

    expect(result).toEqual({ player: 'Roman', streak: 2 });
  });
});
