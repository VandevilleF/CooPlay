import { describe, it, expect, beforeEach } from '@jest/globals';
import { User } from '../../src/business/domain/entities/User.js';

describe('User Entity', () => {
  let userData;

  beforeEach(() => {
    userData = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      describe: 'Test user description',
      avatar_id: 1,
      is_admin: false,
      created_at: new Date()
    };
  });

  describe('Constructor', () => {
    it('should create user with all properties', () => {
      const user = new User(userData);

      expect(user.id).toBe(1);
      expect(user.username).toBe('testuser');
      expect(user.email).toBe('test@example.com');
      expect(user.is_admin).toBe(false);
    });

    it('should initialize empty arrays', () => {
      const user = new User(userData);

      expect(user.favorites_games).toEqual([]);
      expect(user.events_created).toEqual([]);
      expect(user.events_joined).toEqual([]);
      expect(user.trophies).toEqual([]);
      expect(user.chat).toEqual([]);
    });

    it('should handle null values', () => {
      const user = new User({
        id: 1,
        created_at: new Date()
      });

      expect(user.username).toBeNull();
      expect(user.email).toBeNull();
      expect(user.describe).toBeNull();
      expect(user.avatar_id).toBeNull();
    });
  });

  describe('canJoinEvent', () => {
    let user;
    let event;

    beforeEach(() => {
      user = new User(userData);
      event = {
        id: 1,
        creator_id: 2,
        max_participants: 5,
        participants: [],
        isFull: function() {
          return this.participants.length >= this.max_participants;
        }
      };
    });

    it('should allow user to join available event', () => {
      expect(user.canJoinEvent(event)).toBe(true);
    });

    it('should not allow user to join full event', () => {
      event.participants = [
        { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }
      ];

      expect(user.canJoinEvent(event)).toBe(false);
    });

    it('should not allow creator to join own event', () => {
      event.creator_id = 1;

      expect(user.canJoinEvent(event)).toBe(false);
    });

    it('should not allow user to join event they already joined', () => {
      event.participants = [{ id: 1 }, { id: 2 }];

      expect(user.canJoinEvent(event)).toBe(false);
    });

    it('should check if event is full before allowing join', () => {
      event.max_participants = 1;
      event.participants = [{ id: 2 }];

      expect(user.canJoinEvent(event)).toBe(false);
    });
  });

  describe('createEvent', () => {
    it('should create event with user as creator', () => {
      const user = new User(userData);

      // Date dans le futur (dans 1 jour)
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const eventData = {
        title: 'Test Event',
        description: 'Test Description',
        game_id: 1,
        start_at: futureDate,
        max_participants: 5
      };

      const event = user.createEvent(eventData);

      expect(event.creator_id).toBe(user.id);
      expect(event.title).toBe('Test Event');
      expect(user.events_created).toHaveLength(1);
    });

    it('should add created event to events_created array', () => {
      const user = new User(userData);

      // Date dans le futur
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      user.createEvent({
        title: 'Event 1',
        start_at: futureDate,
        max_participants: 5,
        game_id: 1
      });

      user.createEvent({
        title: 'Event 2',
        start_at: futureDate,
        max_participants: 5,
        game_id: 1
      });

      expect(user.events_created).toHaveLength(2);
    });
  });

  describe('canRemoveEvent', () => {
    it('should allow creator to remove event', () => {
      const user = new User(userData);
      const event = { id: 1, creator_id: 1 };

      expect(user.canRemoveEvent(event)).toBe(true);
    });

    it('should allow admin to remove any event', () => {
      const user = new User({ ...userData, is_admin: true });
      const event = { id: 1, creator_id: 2 };

      expect(user.canRemoveEvent(event)).toBe(true);
    });

    it('should not allow non-admin non-creator to remove event', () => {
      const user = new User({ ...userData, id: 3, is_admin: false });
      const event = { id: 1, creator_id: 2 };

      expect(user.canRemoveEvent(event)).toBe(false);
    });
  });

  describe('removeEvent', () => {
    it('should remove event if user is creator', () => {
      const user = new User(userData);

      // Date dans le futur
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const event = user.createEvent({
        id: 1,
        title: 'Test',
        start_at: futureDate,
        max_participants: 5,
        game_id: 1
      });

      user.removeEvent(event);

      expect(user.events_created).toHaveLength(0);
    });

    it('should throw error if user cannot remove event', () => {
      const user = new User({ ...userData, id: 3, is_admin: false });
      const event = { id: 1, creator_id: 2 };

      expect(() => user.removeEvent(event)).toThrow(
        "Seul le créateur peux supprimer l'événement"
      );
    });

    it('should allow admin to remove event', () => {
      const user = new User({ ...userData, is_admin: true });

      // Date dans le futur
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const event = user.createEvent({
        id: 1,
        title: 'Test',
        start_at: futureDate,
        max_participants: 5,
        game_id: 1
      });

      user.removeEvent(event);

      expect(user.events_created).toHaveLength(0);
    });
  });

  describe('addFavoriteGame', () => {
    it('should add game to favorites', () => {
      const user = new User(userData);
      const game = { id: 1, name: 'GTA V' };

      user.addFavoriteGame(game);

      expect(user.favorites_games).toHaveLength(1);
      expect(user.favorites_games[0]).toEqual(game);
    });

    it('should throw error if game already in favorites (by id)', () => {
      const user = new User(userData);
      const game = { id: 1, name: 'GTA V' };

      user.addFavoriteGame(game);

      expect(() => user.addFavoriteGame(game)).toThrow(
        'Ce jeu est déjà dans les favoris'
      );
    });

    it('should throw error if game already in favorites (by game_id)', () => {
      const user = new User(userData);
      user.addFavoriteGame({ id: 1, name: 'GTA V' });

      expect(() => user.addFavoriteGame({ game_id: 1, name: 'GTA V' })).toThrow(
        'Ce jeu est déjà dans les favoris'
      );
    });

    it('should allow adding multiple different games', () => {
      const user = new User(userData);

      user.addFavoriteGame({ id: 1, name: 'GTA V' });
      user.addFavoriteGame({ id: 2, name: 'Witcher 3' });
      user.addFavoriteGame({ id: 3, name: 'RDR2' });

      expect(user.favorites_games).toHaveLength(3);
    });
  });

  describe('removeFavoriteGame', () => {
    it('should remove game from favorites by id', () => {
      const user = new User(userData);
      user.addFavoriteGame({ id: 1, name: 'GTA V' });
      user.addFavoriteGame({ id: 2, name: 'Witcher 3' });

      user.removeFavoriteGame(1);

      expect(user.favorites_games).toHaveLength(1);
      expect(user.favorites_games[0].id).toBe(2);
    });

    it('should remove game from favorites by game_id', () => {
      const user = new User(userData);
      user.addFavoriteGame({ game_id: 1, name: 'GTA V' });

      user.removeFavoriteGame(1);

      expect(user.favorites_games).toHaveLength(0);
    });

    it('should throw error if game not in favorites', () => {
      const user = new User(userData);

      expect(() => user.removeFavoriteGame(999)).toThrow(
        "Ce jeu n'est pas dans les favoris"
      );
    });

    it('should throw error when removing from empty favorites', () => {
      const user = new User(userData);

      expect(() => user.removeFavoriteGame(1)).toThrow(
        "Ce jeu n'est pas dans les favoris"
      );
    });
  });
});
