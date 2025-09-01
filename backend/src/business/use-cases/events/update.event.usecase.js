import { Event } from "../../../business/domain/entities/Event.js";

export class UpdateEvent {
	constructor(userRepository, eventRepository) {
		this.userRepository = userRepository;
		this.eventRepository = eventRepository;
	}

	async execute(userId, eventId, data) {
		const dbUser = await this.userRepository.getUserById(userId);
		const dbEvent = await this.eventRepository.getEventById(eventId);

		if (!dbEvent) throw new Error("Événement non trouvé");
		if (!dbUser) throw new Error("Utilisateur non trouvé");

		const event = new Event(dbEvent);

		event.updateEvent(userId, data);

		const updateData = this.extractUpdatedFields(event, data);

		return this.eventRepository.updateEvent(eventId, updateData);
	}

	extractUpdatedFields(event, originalData) {
		const persistableFields = {
			title: event.title,
			description: event.description,
			start_at: event.start_at,
			max_participants: event.max_participants
		};

		return Object.fromEntries(
			Object.entries(persistableFields).filter(([key]) =>
				Object.hasOwn(originalData, key)
			)
		);
	}
}
