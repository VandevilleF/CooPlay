import { ChatRepository } from '../../persistence/repositories/chat.repository.js';
import { EventRepository } from '../../persistence/repositories/event.repository.js';
import { UserRepository } from '../../persistence/repositories/user.repository.js';

const chatRepository = new ChatRepository();
const eventRepository = new EventRepository();
const userRepository = new UserRepository();

export const getMessages = async (req, res) => {
    try {
        const { eventId } = req.params;
        const uid = req.user.uid;
        const user = await userRepository.findByFirebaseUid(uid);

        const event = await eventRepository.getEventById(parseInt(eventId));

        // Vérifier si l'utilisateur est le créateur
        const isCreator = event && event.creator_id === user.id;

        // Vérifier participation directement
        const isParticipant = await eventRepository.isUserParticipant(user.id, parseInt(eventId));
        if (!isCreator && !isParticipant) {
            return res.status(403).json({
                success: false,
                message: 'Vous ne participez pas à cet événement'
            });
        }

        // Récupérer messages directement
        const messages = await chatRepository.getMessages(parseInt(eventId));

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
