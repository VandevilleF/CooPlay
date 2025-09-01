import { prisma } from '../../shared/prismaClient.js'

export class EventRepository {
	constructor(prismaClient = prisma) {
		this.prisma = prismaClient;
	}

	// -- Events --
	async getEventById(id) {
		return this.prisma.event.findUnique({
			where: { id },
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
	}

	async getAllEvents() {
		return this.prisma.event.findMany({
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
	}

	async createEvent(title, description = null, userId, start_at, max_participants, gameId) {
		return this.prisma.event.create({
			data: {
				title,
				description,
				creator_id: userId,
				start_at: new Date(start_at),
				max_participants,
				game_id: gameId,
			},
			include: {
				game: true
			}
		});
	}
	async updateEvent(id, data) {
		return this.prisma.event.update({
			where: { id },
			data,
		});
	}
	async deleteEvent(id) {
		return this.prisma.event.delete({
			where: { id }
		});
	}

	// -- Participants --
	async addParticipant(eventId, userId) {
		return this.prisma.eventParticipant.upsert({
			where: {
				user_id_event_id: {
					user_id: userId,
					event_id: eventId,
				},
			},
			update: {},
			create: {
				user_id: userId,
				event_id: eventId,
			}
		});
	}
	async removeParticipant(eventId, userId) {
		return this.prisma.eventParticipant.delete({
			where: { user_id_event_id: { user_id: userId, event_id: eventId }}
		});
	}

	// -- Game --
	async updateEventGame(eventId, newGameId) {
		return await this.prisma.event.update({
			where: { id: eventId },
			data: { game_id: newGameId},
			include: {
				game: true,
				participants: { include: { user: true } }
			}
		});
	}
}
