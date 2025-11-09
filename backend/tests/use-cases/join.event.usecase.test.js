import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { JoinEventUsesCase } from '../../src/business/use-cases/events/join.event.usecase.js';
import { mockUser, mockEvent } from '../mocks/prisma.mock.js';

describe('JoinEventUseCase', () => {
  let joinEventUseCase;
  let mockUserRepository;
  let mockEventRepository;

  beforeEach(() => {
    mockUserRepository = {
      getUserById: jest.fn(),
    };

    mockEventRepository = {
      getEventById: jest.fn(),
      addParticipant: jest.fn(),
    };

    joinEventUseCase = new JoinEventUsesCase(mockUserRepository, mockEventRepository);
  });

  describe('execute', () => {
    it('should allow user to join event', async () => {
      const event = { ...mockEvent, participants: [] };
      const user = { ...mockUser, id: 2 };

      mockUserRepository.getUserById.mockResolvedValue(user);
      mockEventRepository.getEventById.mockResolvedValue(event);
      mockEventRepository.addParticipant.mockResolvedValue({ user_id: 2, event_id: 1 });

      const result = await joinEventUseCase.execute(2, 1);

      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(2);
      expect(mockEventRepository.getEventById).toHaveBeenCalledWith(1);
      expect(mockEventRepository.addParticipant).toHaveBeenCalledWith(1, 2);
      expect(result).toEqual({ user_id: 2, event_id: 1 });
    });

    it('should throw error if event not found', async () => {
      mockUserRepository.getUserById.mockResolvedValue(mockUser);
      mockEventRepository.getEventById.mockResolvedValue(null);

      await expect(joinEventUseCase.execute(1, 999)).rejects.toThrow(
        'Événement non trouvé'
      );

      expect(mockEventRepository.addParticipant).not.toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      mockUserRepository.getUserById.mockResolvedValue(null);
      mockEventRepository.getEventById.mockResolvedValue(mockEvent);

      await expect(joinEventUseCase.execute(999, 1)).rejects.toThrow(
        'Utilisateur non trouvé'
      );

      expect(mockEventRepository.addParticipant).not.toHaveBeenCalled();
    });

    it('should throw error if event is full', async () => {
      const fullEvent = {
        ...mockEvent,
        max_participants: 2,
        participants: [{ user_id: 2 }, { user_id: 3 }]
      };
      const user = { ...mockUser, id: 4 };

      mockUserRepository.getUserById.mockResolvedValue(user);
      mockEventRepository.getEventById.mockResolvedValue(fullEvent);

      await expect(joinEventUseCase.execute(4, 1)).rejects.toThrow(
        "L'utilisateur ne peut pas rejoindre cet événement"
      );

      expect(mockEventRepository.addParticipant).not.toHaveBeenCalled();
    });

    it('should throw error if user is creator', async () => {
      const event = { ...mockEvent, creator_id: 1 };
      const user = { ...mockUser, id: 1 };

      mockUserRepository.getUserById.mockResolvedValue(user);
      mockEventRepository.getEventById.mockResolvedValue(event);

      await expect(joinEventUseCase.execute(1, 1)).rejects.toThrow(
        "L'utilisateur ne peut pas rejoindre cet événement"
      );

      expect(mockEventRepository.addParticipant).not.toHaveBeenCalled();
    });

    it('should throw error if user already participant', async () => {
      const event = {
        ...mockEvent,
        participants: [{ id: 2, user_id: 2 }]
      };
      const user = { ...mockUser, id: 2 };

      mockUserRepository.getUserById.mockResolvedValue(user);
      mockEventRepository.getEventById.mockResolvedValue(event);

      await expect(joinEventUseCase.execute(2, 1)).rejects.toThrow(
        "L'utilisateur ne peut pas rejoindre cet événement"
      );
    });

    it('should check both user and event before attempting to join', async () => {
      const event = { ...mockEvent, participants: [] };
      const user = { ...mockUser, id: 2 };

      mockUserRepository.getUserById.mockResolvedValue(user);
      mockEventRepository.getEventById.mockResolvedValue(event);
      mockEventRepository.addParticipant.mockResolvedValue({ user_id: 2, event_id: 1 });

      await joinEventUseCase.execute(2, 1);

      // Vérifier que les méthodes ont été appelées
      expect(mockUserRepository.getUserById).toHaveBeenCalledWith(2);
      expect(mockEventRepository.getEventById).toHaveBeenCalledWith(1);
      expect(mockEventRepository.addParticipant).toHaveBeenCalledWith(1, 2);

      // Vérifier l'ordre d'appel avec mock.invocationCallOrder
      const userCallOrder = mockUserRepository.getUserById.mock.invocationCallOrder[0];
      const eventCallOrder = mockEventRepository.getEventById.mock.invocationCallOrder[0];
      const addParticipantCallOrder = mockEventRepository.addParticipant.mock.invocationCallOrder[0];

      expect(userCallOrder).toBeLessThan(addParticipantCallOrder);
      expect(eventCallOrder).toBeLessThan(addParticipantCallOrder);
    });
  });
});
