import { prisma } from '../../shared/prismaClient.js'

export class ChatRepository {
	constructor(prismaClient = prisma) {
		this.prisma = prismaClient;
	}

	async saveMessage(userId, eventId, message) {
		const messageToSave = typeof message === 'object' ? JSON.stringify(message) : message;
		return await this.prisma.chat.create({
			data: {
				user_id: userId,
				event_id: eventId,
				message: messageToSave
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
	}

	async getMessages(eventId, limit = 50) {
		return await this.prisma.chat.findMany({
			where: { event_id: eventId },
			include: {
				user: {
					select: {
						id: true,
						username: true
					}
				}
			},
			orderBy: { created_at: 'asc' },
			take: limit
		});
	}

	async getMessageCount(eventId) {
		return await this.prisma.chat.count({
			where: { event_id: eventId }
		});
	}

	async deleteEventMessages(eventId) {
		return await this.prisma.chat.deleteMany({
			where: { event_id: eventId }
		});
	}
}
