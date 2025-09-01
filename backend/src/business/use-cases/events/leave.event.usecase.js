import { Event } from "../../../business/domain/entities/Event.js";
import { User } from "../../../business/domain/entities/User.js";

export class LeaveEventUseCase {
	constructor(userRepository, eventRepository) {
		this.userRepository = userRepository;
		this.eventRepository = eventRepository;
	}

	async execute(userId, eventId) {
		const dbUser = await this.userRepository.getUserById(userId);
		const dbEvent = await this.eventRepository.getEventById(eventId);

		if (!dbEvent) throw new Error("Événement non trouvé");
		if (!dbUser) throw new Error("Utilisateur non trouvé");

		const user = new User(dbUser);
		const event = new Event(dbEvent);

		event.removeParticipant(user.id);

		return this.eventRepository.removeParticipant(eventId, userId);
	}
}
