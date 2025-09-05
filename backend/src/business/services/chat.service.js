import { Chat } from '../../business/domain/entities/Chat.js';

export class ChatService {
	constructor(chatRepository, eventRepository) {
		this.chatRepository = chatRepository;
		this.eventRepository = eventRepository;
	}
	
	async canJoinChat(userId, eventId) {
		const event = await this.eventRepository.getEventById(eventId);
		if (event.creator_id === userId) {
			return true; // Le créateur a toujours accès au chat
		}
		const isParticipant = await this.eventRepository.isUserParticipant(userId, eventId);
		if (!isParticipant) throw new Error('Vous ne participer pas à cet événement');

		return true;
	}

	async createMessage(userId, eventId, content) {
		await this.canJoinChat(userId, eventId);

		const chat = new Chat({
			id: null,
			event_id: eventId,
			user_id: userId,
			message: content,
			created_at: new Date()
		});

		if (!chat.isValidMessage()) throw new Error('Message trop long ou vide');

		const saved = await this.chatRepository.saveMessage(
			chat.user_id,
			chat.event_id,
			chat.message
		);

		return saved;
	}

	async getMessages(eventId, userId) {
		await this.canJoinChat(userId, eventId);

		const messages = await this.chatRepository.getMessages(eventId);

		return messages.map(msg => ({
			id: msg.id,
			eventId: msg.event_id,
			userId: msg.user_id,
			username: msg.user.username,
			message: msg.message,
			timestamp: msg.created_at
		}));
	}
}
