import { ChatService } from '../../business/services/chat.service.js';
import { UserRepository } from '../../persistence/repositories/user.repository.js';
import { EventRepository } from '../../persistence/repositories/event.repository.js';
import { ChatRepository } from '../../persistence/repositories/chat.repository.js';

const userRepository = new UserRepository();
const eventRepository = new EventRepository();
const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository, eventRepository);

export const chatHandler = async (socket, io) => {
	const user = await userRepository.findByFirebaseUid(socket.user.uid);

	// Rejoindre une room d'événement
	socket.on('join-event', async (eventId) => {
		try {
			await chatService.canJoinChat(user.id, parseInt(eventId));
			socket.join(`event-${eventId}`);

			// Notifie l'arrivé de l'utilisateur
			io.to(`event-${eventId}`).emit('user-joined', {
				username: socket.username,
				message: `${socket.username} a rejoint le chat`
			});
		} catch (error) {
			socket.emit('join-error', {error: error.message});
		}
	});

	// Quitter une room d'événement
	socket.on('leave-event', (eventId) => {
		socket.leave(`event-${eventId}`);
		// Notifier le départ
		io.to(`event-${eventId}`).emit('user-left', {
			username: socket.username,
			message: `${socket.username} a quitté le chat`
		});
	});

	// Envoyer un message
	socket.on('send-message', async ({ eventId, message }) => {
		try {
			// Sauvegarder en base
			const savedMessage = await chatService.createMessage(user.id, parseInt(eventId), message);

			// Diffuser le message formaté à tous les participants
			io.to(`event-${eventId}`).emit('new-message', {
				id: savedMessage.id,
				eventId: savedMessage.event_id,
				userId: savedMessage.user_id,
				username: socket.username,
				message: savedMessage.message,
				timestamp: savedMessage.created_at,
			});
		} catch (error) {
			socket.emit('message-error', { error: error.message });
		}
	});

	socket.on('disconnect', () => {
		console.log(`User disconnected: ${socket.username} (${user.id})`);
	});

	// Gestion des erreurs globales du socket
	socket.on('error', (error) => {
		console.error('Socket error:', error);
	});
};
