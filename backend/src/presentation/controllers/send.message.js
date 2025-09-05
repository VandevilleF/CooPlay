import { SendMessage } from '../../business/use-cases/events/send.message.js';
import { ChatService } from '../../business/services/chat.service.js';
import { ChatRepository } from '../../persistence/repositories/chat.repository.js';
import { EventRepository } from '../../persistence/repositories/event.repository.js';
import { UserRepository } from '../../persistence/repositories/user.repository.js';

const userRepository = new UserRepository();
const chatRepository = new ChatRepository();
const eventRepository = new EventRepository();
const chatService = new ChatService(chatRepository, eventRepository);
const sendMessageUseCase = new SendMessage(chatService);

export const sendMessage = async (req, res) => {
	try {
		const { eventId } = req.params;
		const uid = req.user.uid;
		const { message } = req.body;
		const user = await userRepository.findByFirebaseUid(uid);

		const result = await sendMessageUseCase.execute(user.id, parseInt(eventId), message);

		if (result.success) {
			res.status(200).json({
				success: true,
				data: result.data
			});
		} else {
			res.status(403).json({
				success: false,
				message: result.error
			});
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
}
