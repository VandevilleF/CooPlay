import { describe, it, expect, beforeEach } from '@jest/globals';
import { UserRepository } from '../../src/persistence/repositories/user.repository.js';
import { createMockPrismaClient, mockUser } from '../mocks/prisma.mock.js';

describe('UserRepository', () => {
  let userRepository;
  let mockPrisma;

  beforeEach(() => {
    mockPrisma = createMockPrismaClient();
    userRepository = new UserRepository(mockPrisma);
  });

  describe('findByFirebaseUid', () => {
    it('should find user by firebase uid', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await userRepository.findByFirebaseUid('test-firebase-uid-123');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { firebase_uid: 'test-firebase-uid-123' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await userRepository.findByFirebaseUid('non-existent-uid');

      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should find user by id', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await userRepository.getUserById(1);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await userRepository.getUserById(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = {
        firebase_uid: 'new-firebase-uid',
        username: 'newuser',
        email: 'new@example.com',
      };
      const createdUser = { ...mockUser, ...newUser };
      mockPrisma.user.create.mockResolvedValue(createdUser);

      const result = await userRepository.create(newUser);

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          firebase_uid: 'new-firebase-uid',
          username: 'newuser',
          email: 'new@example.com',
        },
      });
      expect(result).toEqual(createdUser);
    });

    it('should create user with all required fields', async () => {
      const userData = {
        firebase_uid: 'uid-123',
        username: 'testuser',
        email: 'test@test.com',
      };
      mockPrisma.user.create.mockResolvedValue({ ...mockUser, ...userData });

      const result = await userRepository.create(userData);

      expect(result).toHaveProperty('firebase_uid', userData.firebase_uid);
      expect(result).toHaveProperty('username', userData.username);
      expect(result).toHaveProperty('email', userData.email);
    });
  });

  describe('update', () => {
    it('should update user data', async () => {
      const updatedData = { username: 'updateduser', avatar_id: 2 };
      const updatedUser = { ...mockUser, ...updatedData };
      mockPrisma.user.update.mockResolvedValue(updatedUser);

      const result = await userRepository.update(1, updatedData);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatedData,
      });
      expect(result.username).toBe('updateduser');
      expect(result.avatar_id).toBe(2);
    });

    it('should update only provided fields', async () => {
      const partialUpdate = { username: 'newname' };
      mockPrisma.user.update.mockResolvedValue({ ...mockUser, ...partialUpdate });

      await userRepository.update(1, partialUpdate);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: partialUpdate,
      });
    });
  });

  describe('delete', () => {
    it('should delete user by firebase uid', async () => {
      mockPrisma.user.delete.mockResolvedValue(mockUser);

      const result = await userRepository.delete('test-firebase-uid-123');

      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { firebase_uid: 'test-firebase-uid-123' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should handle deletion of non-existent user', async () => {
      mockPrisma.user.delete.mockRejectedValue(new Error('User not found'));

      await expect(
        userRepository.delete('non-existent-uid')
      ).rejects.toThrow('User not found');
    });
  });
});
