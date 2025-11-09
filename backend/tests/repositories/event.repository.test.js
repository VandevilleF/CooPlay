import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { EventRepository } from '../../src/persistence/repositories/event.repository.js';
import {
  createMockPrismaClient,
  mockEvent,
  mockEventParticipant
} from '../mocks/prisma.mock.js';

// Mock du service de chiffrement
jest.unstable_mockModule('../../src/business/services/server.encryption.service.js', () => ({
  serverEncryptionService: {
    generateEventKey: jest.fn(() => 'test-event-key'),
    encryptEventKey: jest.fn((key) => `encrypted-${key}`),
    decryptEventKey: jest.fn((encrypted) => encrypted.replace('encrypted-', '')),
  },
}));

describe('EventRepository', () => {
  let eventRepository;
  let mockPrisma;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();
    eventRepository = new EventRepository(mockPrisma);
  });

  describe('getEventById', () => {
    it('should return event with all relations', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(mockEvent);

      const result = await eventRepository.getEventById(1);

      expect(mockPrisma.event.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          creator: {
            select: { id: true, username: true, avatar_id: true }
          },
          participants: {
            include: {
              user: { select: { id: true, username: true, avatar_id: true } }
            },
          },
          game: true,
        }
      });
      expect(result).toEqual(mockEvent);
    });

    it('should return null if event not found', async () => {
      mockPrisma.event.findUnique.mockResolvedValue(null);

      const result = await eventRepository.getEventById(999);

      expect(result).toBeNull();
    });
  });

  describe('getAllEvents', () => {
    it('should return all events ordered by created_at desc', async () => {
      const mockEvents = [mockEvent, { ...mockEvent, id: 2 }];
      mockPrisma.event.findMany.mockResolvedValue(mockEvents);

      const result = await eventRepository.getAllEvents();

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
        include: {
          creator: { select: { id: true, username: true } },
          participants: {
            include: {
              user: { select: { id: true, username: true } }
            }
          },
          game: {
            select: { id: true, name: true, cover_url: true }
          }
        },
        orderBy: {
          created_at: 'desc',
        }
      });
      expect(result).toEqual(mockEvents);
      expect(result).toHaveLength(2);
    });
  });

  describe('createEvent', () => {
    it('should create event with encrypted key', async () => {
      const newEvent = { ...mockEvent };
      mockPrisma.event.create.mockResolvedValue(newEvent);

      const result = await eventRepository.createEvent(
        'Test Event',
        'Test Description',
        1,
        '2025-12-01',
        10,
        1
      );

      expect(mockPrisma.event.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Event',
          description: 'Test Description',
          creator_id: 1,
          start_at: new Date('2025-12-01'),
          max_participants: 10,
          game_id: 1,
          encrypted_key: expect.any(String),
        },
        include: {
          game: true
        }
      });
      expect(result).toEqual(newEvent);
    });

    it('should handle null description', async () => {
      mockPrisma.event.create.mockResolvedValue(mockEvent);

      await eventRepository.createEvent(
        'Test Event',
        null,
        1,
        '2025-12-01',
        10,
        1
      );

      expect(mockPrisma.event.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            description: null,
          })
        })
      );
    });
  });

  describe('getUserEvents', () => {
    it('should return events created by user or where user participates', async () => {
      const mockEvents = [mockEvent];
      mockPrisma.event.findMany.mockResolvedValue(mockEvents);

      const result = await eventRepository.getUserEvents(1);

      expect(mockPrisma.event.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { creator_id: 1 },
            {
              participants: {
                some: {
                  user_id: 1
                }
              }
            }
          ]
        },
        include: {
          creator: { select: { id: true, username: true } },
          participants: {
            include: {
              user: { select: { id: true, username: true } }
            }
          },
          game: {
            select: { id: true, name: true, cover_url: true }
          }
        }
      });
      expect(result).toEqual(mockEvents);
    });
  });

  describe('updateEvent', () => {
    it('should update event with provided data', async () => {
      const updatedEvent = { ...mockEvent, title: 'Updated Title' };
      mockPrisma.event.update.mockResolvedValue(updatedEvent);

      const result = await eventRepository.updateEvent(1, { title: 'Updated Title' });

      expect(mockPrisma.event.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 'Updated Title' },
      });
      expect(result.title).toBe('Updated Title');
    });
  });

  describe('deleteEvent', () => {
    it('should delete event by id', async () => {
      mockPrisma.event.delete.mockResolvedValue(mockEvent);

      const result = await eventRepository.deleteEvent(1);

      expect(mockPrisma.event.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(result).toEqual(mockEvent);
    });
  });

  describe('addParticipant', () => {
    it('should add participant using upsert', async () => {
      mockPrisma.eventParticipant.upsert.mockResolvedValue(mockEventParticipant);

      const result = await eventRepository.addParticipant(1, 1);

      expect(mockPrisma.eventParticipant.upsert).toHaveBeenCalledWith({
        where: {
          user_id_event_id: {
            user_id: 1,
            event_id: 1,
          },
        },
        update: {},
        create: {
          user_id: 1,
          event_id: 1,
        }
      });
      expect(result).toEqual(mockEventParticipant);
    });
  });

  describe('isUserParticipant', () => {
    it('should return true if user is participant', async () => {
      mockPrisma.eventParticipant.findFirst.mockResolvedValue(mockEventParticipant);

      const result = await eventRepository.isUserParticipant(1, 1);

      expect(mockPrisma.eventParticipant.findFirst).toHaveBeenCalledWith({
        where: {
          user_id: 1,
          event_id: 1,
        }
      });
      expect(result).toBe(true);
    });

    it('should return false if user is not participant', async () => {
      mockPrisma.eventParticipant.findFirst.mockResolvedValue(null);

      const result = await eventRepository.isUserParticipant(1, 1);

      expect(result).toBe(false);
    });
  });

  describe('removeParticipant', () => {
    it('should remove participant', async () => {
      mockPrisma.eventParticipant.delete.mockResolvedValue(mockEventParticipant);

      const result = await eventRepository.removeParticipant(1, 1);

      expect(mockPrisma.eventParticipant.delete).toHaveBeenCalledWith({
        where: { user_id_event_id: { user_id: 1, event_id: 1 }}
      });
      expect(result).toEqual(mockEventParticipant);
    });
  });

  describe('getEventParticipants', () => {
    it('should return participants ordered by joined_at', async () => {
      const mockParticipants = [mockEventParticipant];
      mockPrisma.eventParticipant.findMany.mockResolvedValue(mockParticipants);

      const result = await eventRepository.getEventParticipants(1);

      expect(mockPrisma.eventParticipant.findMany).toHaveBeenCalledWith({
        where: {
          event_id: 1
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar_id: true
            }
          }
        },
        orderBy: {
          joined_at: 'asc'
        }
      });
      expect(result).toEqual(mockParticipants);
    });
  });

  describe('updateEventGame', () => {
    it('should update event game', async () => {
      const updatedEvent = { ...mockEvent, game_id: 2 };
      mockPrisma.event.update.mockResolvedValue(updatedEvent);

      const result = await eventRepository.updateEventGame(1, 2);

      expect(mockPrisma.event.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { game_id: 2 },
        include: {
          game: true,
          participants: { include: { user: true } }
        }
      });
      expect(result).toEqual(updatedEvent);
    });
  });
});
