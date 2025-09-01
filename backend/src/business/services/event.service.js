import { CreateEventUseCase } from "../use-cases/events/create.event.usecase.js";
import { JoinEventUsesCase } from "../use-cases/events/join.event.usecase.js";
import { LeaveEventUseCase } from "../use-cases/events/leave.event.usecase.js";
import { DeleteEventUseCase } from "../use-cases/events/delete.event.usecase.js";
import { UpdateEventGame } from "../use-cases/events/update.event.game.usecase.js";
import { UpdateEvent } from "../use-cases/events/update.event.usecase.js";

export class EventService {
	constructor(userRepository, eventRepository) {
		this.userRepository = userRepository;
		this.eventRepository = eventRepository;

		// On instancie les use cases
		this.createEventUC = new CreateEventUseCase(userRepository, eventRepository);
		this.joinEventUC = new JoinEventUsesCase(userRepository, eventRepository);
		this.leaveEventUC = new LeaveEventUseCase(userRepository, eventRepository);
		this.deleteEventUC = new DeleteEventUseCase(userRepository, eventRepository);
		this.updateEventGameUC = new UpdateEventGame(eventRepository);
		this.updateEventUC = new UpdateEvent(userRepository, eventRepository);
	}

	async getAllEvents() {
		return this.eventRepository.getAllEvents();
	}

	async getEventById(id) {
		return this.eventRepository.getEventById(id);
	}

	async createEvent(userId, { title, description, start_at, max_participants, gameId }) {
		return this.createEventUC.execute(userId, { title, description, start_at, max_participants, gameId });
	}

	async updateEvent(userId, eventId, { title, description, start_at, max_participants }) {
		return this.updateEventUC.execute(userId, eventId, { title, description, start_at, max_participants } );
	}

	async joinEvent(userId, eventId) {
		return this.joinEventUC.execute(userId, eventId);
	}

	async leaveEvent(userId, eventId) {
		return this.leaveEventUC.execute(userId, eventId);
	}

	async deleteEvent(userId, eventId) {
		return this.deleteEventUC.execute(userId, eventId);
	}

	async updateEventGame(userId, eventId, newGameId) {
		return this.updateEventGameUC.execute(userId, eventId, newGameId);
	}
}
