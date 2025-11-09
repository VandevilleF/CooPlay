import { describe, it, expect, beforeEach } from '@jest/globals';
import { Event } from '../../src/business/domain/entities/Event.js';

describe('Event Entity', () => {
  let eventData;

  beforeEach(() => {
    eventData = {
      id: 1,
      title: 'Test Event',
      description: 'Test Description',
      creator_id: 1,
      game_id: 1,
      start_at: new Date('2025-12-01'),
      max_participants: 5,
      create_at: new Date(),
      participants: []
    };
  });

  describe('Constructor', () => {
    it('should create event with all properties', () => {
      const event = new Event(eventData);

      expect(event.id).toBe(1);
      expect(event.title).toBe('Test Event');
      expect(event.description).toBe('Test Description');
      expect(event.creator_id).toBe(1);
      expect(event.max_participants).toBe(5);
      expect(event.participants).toEqual([]);
    });

    it('should initialize empty participants if not provided', () => {
      const data = { ...eventData };
      delete data.participants;
      const event = new Event(data);

      expect(event.participants).toEqual([]);
    });
  });

  describe('isFull', () => {
    it('should return false when event has space', () => {
      const event = new Event(eventData);

      expect(event.isFull()).toBe(false);
    });

    it('should return true when event is at capacity', () => {
      const event = new Event({
        ...eventData,
        max_participants: 2,
        participants: [{ user_id: 2 }, { user_id: 3 }]
      });

      expect(event.isFull()).toBe(true);
    });

    it('should return false when one spot available', () => {
      const event = new Event({
        ...eventData,
        max_participants: 3,
        participants: [{ user_id: 2 }, { user_id: 3 }]
      });

      expect(event.isFull()).toBe(false);
    });
  });

  describe('isCreator', () => {
    it('should return true for creator', () => {
      const event = new Event(eventData);

      expect(event.isCreator(1)).toBe(true);
    });

    it('should return false for non-creator', () => {
      const event = new Event(eventData);

      expect(event.isCreator(2)).toBe(false);
    });
  });

  describe('addParticipant', () => {
    it('should add participant to event', () => {
      const event = new Event(eventData);

      event.addParticipant(2);

      expect(event.participants).toHaveLength(1);
      expect(event.participants[0].user_id).toBe(2);
    });

    it('should throw error if event is full', () => {
      const event = new Event({
        ...eventData,
        max_participants: 1,
        participants: [{ user_id: 2 }]
      });

      expect(() => event.addParticipant(3)).toThrow("L'événement est complet");
    });

    it('should throw error if creator tries to join', () => {
      const event = new Event(eventData);

      expect(() => event.addParticipant(1)).toThrow(
        "Le créateur ne peut pas rejoindre son propre événement"
      );
    });

    it('should throw error if user already participant', () => {
      const event = new Event({
        ...eventData,
        participants: [{ user_id: 2 }]
      });

      expect(() => event.addParticipant(2)).toThrow(
        "L'utilisateur participe déjà à cet événement"
      );
    });

    it('should allow multiple participants until full', () => {
      const event = new Event({ ...eventData, max_participants: 3 });

      event.addParticipant(2);
      event.addParticipant(3);
      event.addParticipant(4);

      expect(event.participants).toHaveLength(3);
      expect(() => event.addParticipant(5)).toThrow("L'événement est complet");
    });
  });

  describe('removeParticipant', () => {
    it('should remove participant from event', () => {
      const event = new Event({
        ...eventData,
        participants: [{ user_id: 2 }, { user_id: 3 }]
      });

      event.removeParticipant(2);

      expect(event.participants).toHaveLength(1);
      expect(event.participants[0].user_id).toBe(3);
    });

    it('should throw error if creator tries to leave', () => {
      const event = new Event(eventData);

      expect(() => event.removeParticipant(1)).toThrow(
        "Le créateur ne peut pas se retirer lui-même"
      );
    });

    it('should throw error if user not participant', () => {
      const event = new Event({
        ...eventData,
        participants: [{ user_id: 2 }]
      });

      expect(() => event.removeParticipant(3)).toThrow(
        "L'utilisateur ne participe pas à cet événement"
      );
    });

    it('should throw error if removing from empty participants', () => {
      const event = new Event(eventData);

      expect(() => event.removeParticipant(2)).toThrow(
        "L'utilisateur ne participe pas à cet événement"
      );
    });
  });

  describe('listParticipants', () => {
    it('should return empty array for no participants', () => {
      const event = new Event(eventData);

      expect(event.listParticipants()).toEqual([]);
    });

    it('should return all participants', () => {
      const participants = [{ user_id: 2 }, { user_id: 3 }];
      const event = new Event({ ...eventData, participants });

      expect(event.listParticipants()).toEqual(participants);
    });
  });

  describe('hasStarted', () => {
    it('should return false for future event', () => {
      const event = new Event({
        ...eventData,
        start_at: new Date(Date.now() + 86400000) // Tomorrow
      });

      expect(event.hasStarted()).toBe(false);
    });

    it('should return true for past event', () => {
      const event = new Event({
        ...eventData,
        start_at: new Date('2020-01-01')
      });

      expect(event.hasStarted()).toBe(true);
    });

    it('should return true for event starting now', () => {
      const event = new Event({
        ...eventData,
        start_at: new Date()
      });

      expect(event.hasStarted()).toBe(true);
    });
  });

  describe('updateEvent', () => {
    it('should allow creator to update title', () => {
      const event = new Event(eventData);

      event.updateEvent(1, { title: 'New Title' });

      expect(event.title).toBe('New Title');
    });

    it('should throw error if non-creator tries to update', () => {
      const event = new Event(eventData);

      expect(() => event.updateEvent(2, { title: 'New Title' })).toThrow(
        "Seul le créateur peut modifier l'événement"
      );
    });

    it('should throw error if event already started', () => {
      const event = new Event({
        ...eventData,
        start_at: new Date('2020-01-01')
      });

      expect(() => event.updateEvent(1, { title: 'New Title' })).toThrow(
        "Impossible de modifier un événement déjà commencé"
      );
    });

    it('should update multiple fields', () => {
      const event = new Event(eventData);

      event.updateEvent(1, {
        title: 'New Title',
        description: 'New Description',
        max_participants: 10
      });

      expect(event.title).toBe('New Title');
      expect(event.description).toBe('New Description');
      expect(event.max_participants).toBe(10);
    });

    it('should throw error if max_participants less than current participants', () => {
      const event = new Event({
        ...eventData,
        participants: [{ user_id: 2 }, { user_id: 3 }, { user_id: 4 }]
      });

      expect(() => event.updateEvent(1, { max_participants: 2 })).toThrow(
        "Le nombre maximum de participants ne peut pas être inférieur au nombre actuel de participants"
      );
    });

    it('should not update non-updatable fields', () => {
      const event = new Event(eventData);

      event.updateEvent(1, { creator_id: 999 });

      expect(event.creator_id).toBe(1); // Should remain unchanged
    });

    it('should skip undefined values', () => {
      const event = new Event(eventData);
      const originalTitle = event.title;

      event.updateEvent(1, { title: undefined });

      expect(event.title).toBe(originalTitle);
    });
  });

  describe('changeStartDate', () => {
    it('should change start date for future event', () => {
      const event = new Event(eventData);
      const newDate = new Date('2026-01-01');

      event.changeStartDate(newDate);

      expect(event.start_at).toEqual(newDate);
    });

    it('should throw error if event already started', () => {
      const event = new Event({
        ...eventData,
        start_at: new Date('2020-01-01')
      });

      expect(() => event.changeStartDate(new Date('2026-01-01'))).toThrow(
        "Impossible de modifier la date d'un événement déjà commencé"
      );
    });

    it('should parse date string', () => {
      const event = new Event(eventData);

      event.changeStartDate('2026-06-15');

      expect(event.start_at).toEqual(new Date('2026-06-15'));
    });
  });
});
