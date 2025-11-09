import { describe, it, expect, beforeEach } from '@jest/globals';
import { GameRepository } from '../../src/persistence/repositories/game.repository.js';
import { createMockPrismaClient, mockGame } from '../mocks/prisma.mock.js';

describe('GameRepository', () => {
  let gameRepository;
  let mockPrisma;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();
    gameRepository = new GameRepository(mockPrisma);
  });

  describe('searchByName', () => {
    it('should search games by name with default options', async () => {
      const games = [mockGame, { ...mockGame, id: 2, name: 'GTA IV' }];
      mockPrisma.game.findMany.mockResolvedValue(games);

      const result = await gameRepository.searchByName('GTA');

      expect(mockPrisma.game.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: 'GTA',
            mode: 'insensitive'
          }
        },
        select: {
          id: true,
          name: true,
          cover_url: true
        },
        orderBy: {
          name: 'asc'
        },
        take: 10,
        skip: 0
      });
      expect(result).toEqual(games);
    });

    it('should search with custom limit', async () => {
      mockPrisma.game.findMany.mockResolvedValue([mockGame]);

      await gameRepository.searchByName('test', { limit: 5 });

      expect(mockPrisma.game.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 5
        })
      );
    });

    it('should search with custom offset', async () => {
      mockPrisma.game.findMany.mockResolvedValue([mockGame]);

      await gameRepository.searchByName('test', { offset: 20 });

      expect(mockPrisma.game.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20
        })
      );
    });

    it('should search with both limit and offset', async () => {
      mockPrisma.game.findMany.mockResolvedValue([mockGame]);

      await gameRepository.searchByName('test', { limit: 25, offset: 50 });

      expect(mockPrisma.game.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 25,
          skip: 50
        })
      );
    });

    it('should return empty array when no games found', async () => {
      mockPrisma.game.findMany.mockResolvedValue([]);

      const result = await gameRepository.searchByName('nonexistent');

      expect(result).toEqual([]);
    });

    it('should use case-insensitive search', async () => {
      mockPrisma.game.findMany.mockResolvedValue([mockGame]);

      await gameRepository.searchByName('grand theft auto');

      expect(mockPrisma.game.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            name: {
              contains: 'grand theft auto',
              mode: 'insensitive'
            }
          }
        })
      );
    });

    it('should order results by name ascending', async () => {
      mockPrisma.game.findMany.mockResolvedValue([mockGame]);

      await gameRepository.searchByName('test');

      expect(mockPrisma.game.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            name: 'asc'
          }
        })
      );
    });

    it('should select only id, name and cover_url', async () => {
      mockPrisma.game.findMany.mockResolvedValue([mockGame]);

      const result = await gameRepository.searchByName('test');

      expect(mockPrisma.game.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: {
            id: true,
            name: true,
            cover_url: true
          }
        })
      );
    });
  });
});
