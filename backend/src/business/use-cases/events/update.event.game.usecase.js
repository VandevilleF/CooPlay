export class UpdateEventGame {
	constructor(eventRepository) {
		this.eventRepository = eventRepository;
	}

	async execute(userId, eventId, newGameId) {
		const event = await this.eventRepository.getEventById(eventId);
		if (!event) throw new Error("Événement non trouvé");

		if (event.creator_id !== userId) {
			throw new Error("Seul le créateur peut modifier le jeu de l'événement");
		}
		if (event.hasStarted()) {
			throw new Error("Impossible de modifier un événement déjà commencé");
		}

		return this.eventRepository.updateEventGame(eventId, newGameId);
	}
}
