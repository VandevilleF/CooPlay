import { User } from '../../../business/domain/entities/User.js'
import { Event } from '../../../business/domain/entities/Event.js'

export class JoinEventUsesCase {
	constructor(userRepository, eventRepository) {
		this.userRepository = userRepository;
		this.eventRepository = eventRepository;
	}

	async execute(userId, eventId) {
		// Charger user et event
		const dbUser = await this.userRepository.getUserById(userId);
		const dbEvent = await this.eventRepository.getEventById(eventId);

		if (!dbEvent) throw new Error("Événement non trouvé");
		if (!dbUser) throw new Error("Utilisateur non trouvé");

		// Créer les entités métier
		const user = new User(dbUser);
		const event = new Event(dbEvent);

		// Utiliser les règles
		if (!user.canJoinEvent(event)) {
			throw new Error("L'utilisateur ne peut pas rejoindre cet événement");
		}
		event.addParticipant(userId);

		return this.eventRepository.addParticipant(eventId, userId)
	}
}

