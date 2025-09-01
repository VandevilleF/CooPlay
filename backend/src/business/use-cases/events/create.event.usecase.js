import { User } from "../../../business/domain/entities/User.js";

export class CreateEventUseCase {
	constructor(userRepository, eventRepository) {
		this.userRepository = userRepository;
		this.eventRepository = eventRepository;
	}

	async execute(userId, { title, description, start_at, max_participants, gameId }) {
		const dbUser = await this.userRepository.getUserById(userId);
		if (!dbUser) throw new Error("Utilisateur non trouvé");

		const user = new User(dbUser);

		// L'entité User est responsable de la création d’un event
		const event = user.createEvent({
			title,
			description,
			start_at,
			max_participants,
			gameId
		});
		console.log("Event créé côté entité:", event);

		return this.eventRepository.createEvent(
			event.title,
			event.description,
			user.id,
			event.start_at,
			event.max_participants,
			event.gameId
		);
	}
}
