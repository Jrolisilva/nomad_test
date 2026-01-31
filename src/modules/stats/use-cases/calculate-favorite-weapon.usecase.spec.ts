import { NotFoundException } from '@nestjs/common';
import { CalculateFavoriteWeaponUseCase } from './calculate-favorite-weapon.usecase';

describe('CalculateFavoriteWeaponUseCase', () => {
  const matchRepository = {
    findByExternalId: jest.fn(),
  };
  const statsRepository = {
    findWinnerByMatchId: jest.fn(),
  };
  const killEventRepository = {
    findFavoriteWeapon: jest.fn(),
  };

  const useCase = new CalculateFavoriteWeaponUseCase(
    matchRepository as any,
    statsRepository as any,
    killEventRepository as any,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws when match is not found', async () => {
    matchRepository.findByExternalId.mockResolvedValue(null);

    await expect(useCase.execute('999')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns nulls when no winner', async () => {
    matchRepository.findByExternalId.mockResolvedValue({ id: 1, externalId: '1' });
    statsRepository.findWinnerByMatchId.mockResolvedValue(null);

    const result = await useCase.execute('1');

    expect(result).toEqual({
      matchId: '1',
      winner: null,
      favoriteWeapon: null,
    });
  });

  it('returns favorite weapon for winner', async () => {
    matchRepository.findByExternalId.mockResolvedValue({ id: 1, externalId: '1' });
    statsRepository.findWinnerByMatchId.mockResolvedValue({
      playerId: 10,
      playerName: 'Roman',
      frags: 3,
      deaths: 0,
    });
    killEventRepository.findFavoriteWeapon.mockResolvedValue('M16');

    const result = await useCase.execute('1');

    expect(result).toEqual({
      matchId: '1',
      winner: 'Roman',
      favoriteWeapon: 'M16',
    });
  });
});
