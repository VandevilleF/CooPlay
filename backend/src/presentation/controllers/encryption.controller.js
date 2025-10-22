import { ChatRepository } from '../../persistence/repositories/chat.repository.js';
import { EventRepository } from '../../persistence/repositories/event.repository.js';
import { UserRepository } from '../../persistence/repositories/user.repository.js';
import { ChatService } from '../../business/services/chat.service.js';

const chatRepository = new ChatRepository();
const eventRepository = new EventRepository();
const userRepository = new UserRepository();
const chatService = new ChatService(chatRepository, eventRepository);

export const getEncryptionKey = async (req, res) => {
  try {
    const { eventId } = req.params;
    const uid = req.user.uid;
    const user = await userRepository.findByFirebaseUid(uid);

    // Vérifie que l'utilisateur a accès au chat
    await chatService.canJoinChat(user.id, parseInt(eventId));

    // Récupère la clé
    const key = await chatService.getEncryptionKey(parseInt(eventId));

    res.status(200).json({
      success: true,
      data: { key }
    });
  } catch (error) {
    console.error('❌ Erreur getEncryptionKey:', error.message);
    console.error('Stack:', error.stack);
    res.status(403).json({
      success: false,
      message: error.message
    });
  }
};
