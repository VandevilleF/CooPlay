import { describe, it, expect, beforeEach } from '@jest/globals';
import { ChatRepository } from '../../src/persistence/repositories/chat.repository.js';
import { createMockPrismaClient, mockChat } from '../mocks/prisma.mock.js';

describe('ChatRepository', () => {
  let chatRepository;
  let mockPrisma;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();
    chatRepository = new ChatRepository(mockPrisma);
  });

  describe('saveMessage', () => {
    it('should save a message as string', async () => {
      const savedMessage = {
        ...mockChat,
        user: { id: 1, username: 'testuser' }
      };
      mockPrisma.chat.create.mockResolvedValue(savedMessage);

      const result = await chatRepository.saveMessage(1, 1, 'encrypted-message');

      expect(mockPrisma.chat.create).toHaveBeenCalledWith({
        data: {
          user_id: 1,
          event_id: 1,
          message: 'encrypted-message'
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            }
          }
        }
      });
      expect(result).toEqual(savedMessage);
    });

    it('should save message as JSON string if object provided', async () => {
      const messageObject = { content: 'test', nonce: 'abc123' };
      const savedMessage = {
        ...mockChat,
        message: JSON.stringify(messageObject),
        user: { id: 1, username: 'testuser' }
      };
      mockPrisma.chat.create.mockResolvedValue(savedMessage);

      const result = await chatRepository.saveMessage(1, 1, messageObject);

      expect(mockPrisma.chat.create).toHaveBeenCalledWith({
        data: {
          user_id: 1,
          event_id: 1,
          message: JSON.stringify(messageObject)
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            }
          }
        }
      });
      expect(result).toEqual(savedMessage);
    });

    it('should include user information in saved message', async () => {
      const savedMessage = {
        ...mockChat,
        user: { id: 1, username: 'testuser' }
      };
      mockPrisma.chat.create.mockResolvedValue(savedMessage);

      const result = await chatRepository.saveMessage(1, 1, 'test');

      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('username');
    });
  });

  describe('getMessages', () => {
    it('should get messages with default limit of 50', async () => {
      const messages = [
        { ...mockChat, user: { id: 1, username: 'user1' } },
        { ...mockChat, id: 2, user: { id: 2, username: 'user2' } }
      ];
      mockPrisma.chat.findMany.mockResolvedValue(messages);

      const result = await chatRepository.getMessages(1);

      expect(mockPrisma.chat.findMany).toHaveBeenCalledWith({
        where: { event_id: 1 },
        include: {
          user: {
            select: {
              id: true,
              username: true
            }
          }
        },
        orderBy: { created_at: 'asc' },
        take: 50
      });
      expect(result).toEqual(messages);
    });

    it('should get messages with custom limit', async () => {
      const messages = [mockChat];
      mockPrisma.chat.findMany.mockResolvedValue(messages);

      await chatRepository.getMessages(1, 100);

      expect(mockPrisma.chat.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100
        })
      );
    });

    it('should order messages by created_at ascending', async () => {
      mockPrisma.chat.findMany.mockResolvedValue([]);

      await chatRepository.getMessages(1);

      expect(mockPrisma.chat.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { created_at: 'asc' }
        })
      );
    });

    it('should include user information for each message', async () => {
      const messages = [
        { ...mockChat, user: { id: 1, username: 'testuser' } }
      ];
      mockPrisma.chat.findMany.mockResolvedValue(messages);

      const result = await chatRepository.getMessages(1);

      expect(result[0]).toHaveProperty('user');
      expect(result[0].user).toHaveProperty('username');
    });
  });

  // describe('getMessageCount', () => {
  //   it('should return message count for event', async () => {
  //     mockPrisma.chat.count.mockResolvedValue(42);

  //     const result = await chatRepository.getMessageCount(1);

  //     expect(mockPrisma.chat.count).toHaveBeenCalledWith({
  //       where: { event_id: 1 }
  //     });
  //     expect(result).toBe(42);
  //   });

  //   it('should return 0 if no messages', async () => {
  //     mockPrisma.chat.count.mockResolvedValue(0);

  //     const result = await chatRepository.getMessageCount(999);

  //     expect(result).toBe(0);
  //   });
  // });

  // describe('deleteEventMessages', () => {
  //   it('should delete all messages for an event', async () => {
  //     const deletedCount = { count: 10 };
  //     mockPrisma.chat.deleteMany.mockResolvedValue(deletedCount);

  //     const result = await chatRepository.deleteEventMessages(1);

  //     expect(mockPrisma.chat.deleteMany).toHaveBeenCalledWith({
  //       where: { event_id: 1 }
  //     });
  //     expect(result).toEqual(deletedCount);
  //   });

  //   it('should return count 0 if no messages to delete', async () => {
  //     mockPrisma.chat.deleteMany.mockResolvedValue({ count: 0 });

  //     const result = await chatRepository.deleteEventMessages(999);

  //     expect(result.count).toBe(0);
  //   });
  // });
});
