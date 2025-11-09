import { describe, it, expect } from '@jest/globals';
import { Event } from '../../src/business/domain/entities/Event.js';

describe('Event Entity - Validation', () => {
	const validEventData = {
		title: 'Test Event',
		description: 'Test Description',
		creator_id: 1,
		game_id: 1,
		start_at: new Date(Date.now() + 86400000), // Tomorrow
		max_participants: 5
	};

	describe('Title Validation', () => {
		it('should throw error if title is missing', () => {
			const data = { ...validEventData, title: undefined };
			expect(() => new Event(data)).toThrow('Le titre est requis et doit être une chaîne de caractères');
		});

		it('should throw error if title is empty string', () => {
			const data = { ...validEventData, title: '' };
			expect(() => new Event(data)).toThrow('Le titre ne peut pas être vide');
		});

		it('should throw error if title is only whitespace', () => {
			const data = { ...validEventData, title: '   ' };
			expect(() => new Event(data)).toThrow('Le titre ne peut pas être vide');
		});

		it('should throw error if title is too short', () => {
			const data = { ...validEventData, title: 'ab' };
			expect(() => new Event(data)).toThrow('Le titre doit contenir au moins 3 caractères');
		});

		it('should throw error if title is too long', () => {
			const data = { ...validEventData, title: 'a'.repeat(51) };
			expect(() => new Event(data)).toThrow('Le titre ne peut pas dépasser 50 caractères');
		});

		it('should throw error if title is not a string', () => {
			const data = { ...validEventData, title: 123 };
			expect(() => new Event(data)).toThrow('Le titre est requis et doit être une chaîne de caractères');
		});

		it('should accept valid title with minimum length', () => {
			const data = { ...validEventData, title: 'abc' };
			const event = new Event(data);
			expect(event.title).toBe('abc');
		});

		it('should accept valid title with maximum length', () => {
			const data = { ...validEventData, title: 'a'.repeat(50) };
			const event = new Event(data);
			expect(event.title).toBe('a'.repeat(50));
		});
	});

	describe('Description Validation', () => {
		it('should accept undefined description', () => {
			const data = { ...validEventData, description: undefined };
			const event = new Event(data);
			expect(event.description).toBeUndefined();
		});

		it('should accept null description', () => {
			const data = { ...validEventData, description: null };
			const event = new Event(data);
			expect(event.description).toBeNull();
		});

		it('should throw error if description is too long', () => {
			const data = { ...validEventData, description: 'a'.repeat(501) };
			expect(() => new Event(data)).toThrow('La description ne peut pas dépasser 500 caractères');
		});

		it('should throw error if description is not a string', () => {
			const data = { ...validEventData, description: 123 };
			expect(() => new Event(data)).toThrow('La description doit être une chaîne de caractères');
		});

		it('should accept valid description', () => {
			const data = { ...validEventData, description: 'Valid description' };
			const event = new Event(data);
			expect(event.description).toBe('Valid description');
		});
	});

	describe('Max Participants Validation', () => {
		it('should throw error if max_participants is missing', () => {
			const data = { ...validEventData, max_participants: undefined };
			expect(() => new Event(data)).toThrow('Le nombre maximum de participants est requis');
		});

		it('should throw error if max_participants is null', () => {
			const data = { ...validEventData, max_participants: null };
			expect(() => new Event(data)).toThrow('Le nombre maximum de participants est requis');
		});

		it('should throw error if max_participants is not an integer', () => {
			const data = { ...validEventData, max_participants: 3.5 };
			expect(() => new Event(data)).toThrow('Le nombre maximum de participants doit être un nombre entier');
		});

		it('should throw error if max_participants is 0', () => {
			const data = { ...validEventData, max_participants: 0 };
			expect(() => new Event(data)).toThrow('Le nombre maximum de participants doit être au moins 1');
		});

		it('should throw error if max_participants is negative', () => {
			const data = { ...validEventData, max_participants: -5 };
			expect(() => new Event(data)).toThrow('Le nombre maximum de participants doit être au moins 1');
		});

		it('should throw error if max_participants exceeds 20', () => {
			const data = { ...validEventData, max_participants: 21 };
			expect(() => new Event(data)).toThrow('Le nombre maximum de participants ne peut pas dépasser 20');
		});

		it('should accept minimum valid max_participants', () => {
			const data = { ...validEventData, max_participants: 1 };
			const event = new Event(data);
			expect(event.max_participants).toBe(1);
		});

		it('should accept maximum valid max_participants', () => {
			const data = { ...validEventData, max_participants: 20 };
			const event = new Event(data);
			expect(event.max_participants).toBe(20);
		});
	});

	describe('Game ID Validation', () => {
		it('should throw error if game_id is missing', () => {
			const data = { ...validEventData, game_id: undefined };
			expect(() => new Event(data)).toThrow('L\'ID du jeu est requis');
		});

		it('should throw error if game_id is null', () => {
			const data = { ...validEventData, game_id: null };
			expect(() => new Event(data)).toThrow('L\'ID du jeu est requis');
		});

		it('should throw error if game_id is not an integer', () => {
			const data = { ...validEventData, game_id: 1.5 };
			expect(() => new Event(data)).toThrow('L\'ID du jeu doit être un nombre entier positif');
		});

		it('should throw error if game_id is zero', () => {
			const data = { ...validEventData, game_id: 0 };
			expect(() => new Event(data)).toThrow('L\'ID du jeu doit être un nombre entier positif');
		});

		it('should throw error if game_id is negative', () => {
			const data = { ...validEventData, game_id: -1 };
			expect(() => new Event(data)).toThrow('L\'ID du jeu doit être un nombre entier positif');
		});

		it('should accept valid game_id', () => {
			const data = { ...validEventData, game_id: 42 };
			const event = new Event(data);
			expect(event.game_id).toBe(42);
		});
	});

	describe('Start Date Validation', () => {
		it('should throw error if start_at is missing', () => {
			const data = { ...validEventData, start_at: undefined };
			expect(() => new Event(data)).toThrow('La date de début est requise');
		});

		it('should throw error if start_at is null', () => {
			const data = { ...validEventData, start_at: null };
			expect(() => new Event(data)).toThrow('La date de début est requise');
		});

		it('should throw error if start_at is invalid date', () => {
			const data = { ...validEventData, start_at: 'invalid-date' };
			expect(() => new Event(data)).toThrow('La date de début doit être une date valide');
		});

		it('should throw error if start_at is in the past', () => {
			const data = { ...validEventData, start_at: new Date('2020-01-01') };
			expect(() => new Event(data)).toThrow('La date de début doit être dans le futur');
		});

		it('should throw error if start_at is now', () => {
			const data = { ...validEventData, start_at: new Date() };
			expect(() => new Event(data)).toThrow('La date de début doit être dans le futur');
		});

		it('should accept future date', () => {
			const futureDate = new Date(Date.now() + 86400000);
			const data = { ...validEventData, start_at: futureDate };
			const event = new Event(data);
			expect(event.start_at).toEqual(futureDate);
		});
	});

	describe('Update Event Validation', () => {
		const createValidEvent = () => new Event({
			id: 1, // Existing event
			...validEventData
		});

		it('should validate title on update', () => {
			const event = createValidEvent();
			expect(() => event.updateEvent(1, { title: 'ab' })).toThrow(
				'Le titre doit contenir au moins 3 caractères'
			);
		});

		it('should validate description on update', () => {
			const event = createValidEvent();
			expect(() => event.updateEvent(1, { description: 'a'.repeat(501) })).toThrow(
				'La description ne peut pas dépasser 500 caractères'
			);
		});

		it('should validate max_participants on update', () => {
			const event = createValidEvent();
			expect(() => event.updateEvent(1, { max_participants: 0 })).toThrow(
				'Le nombre maximum de participants doit être au moins 1'
			);
		});

		it('should validate start_at on update', () => {
			const event = createValidEvent();
			expect(() => event.updateEvent(1, { start_at: new Date('2020-01-01') })).toThrow(
				'La date de début doit être dans le futur'
			);
		});

		it('should accept valid updates', () => {
			const event = createValidEvent();
			const futureDate = new Date(Date.now() + 172800000); // 2 days from now

			event.updateEvent(1, {
				title: 'Updated Title',
				description: 'Updated Description',
				max_participants: 10,
				start_at: futureDate
			});

			expect(event.title).toBe('Updated Title');
			expect(event.description).toBe('Updated Description');
			expect(event.max_participants).toBe(10);
			expect(event.start_at).toEqual(futureDate);
		});
	});

	describe('Loading Existing Event (with ID)', () => {
		it('should not validate future date when loading existing event', () => {
			const pastDate = new Date('2020-01-01');
			const data = {
				id: 1, // Has ID = existing event
				title: 'Past Event',
				creator_id: 1,
				game_id: 1,
				start_at: pastDate,
				max_participants: 5
			};

			const event = new Event(data);
			expect(event.start_at).toEqual(pastDate);
			expect(event.title).toBe('Past Event');
		});
	});
});
