class Event {
	constructor({id, title, describe, creator_id, game, start_at, max_participants, create_at}) {
		this.id = id;
		this.title = title;
		this.describe= describe;
		this.creator_id = creator_id;
		this.game = game;
		this.start_at = start_at;
		this.max_participants = max_participants;
		this.create_at= create_at;

		this.games = [];
		this.participants = [];
		this.chats = [];
	}
	isFull() {
		return this.participants.length >= this.max_participants;
	}
	isCreator(userId) {
		return this.creator_id === userId;
	}
	addParticipant(user) {
		if (this.isFull()) {
			throw new Error("L'événement est complet");
		}
		if (this.creator_id === user.id) return false;
		if (this.participants.some(participant => participant.id === this.id)) {
			throw new Error("L'utilisateur participe déjà à cet événement");
		}
	}
	removeParticipant(triggerUserId, participantId) {
		if (!this.isCreator(triggerUserId)) {
			throw new Error("Seul le créateur peut retirer un participant");
		}
		if (participantId === this.creator_id) {
			throw new Error("Le créateur ne peut pas se retirer lui-même");
		}
		this.participants = this.participants.filter(p => p.id !== participantId);
	}
	hasStarted() {
		return new Date() >= this.start_at;
	}
	changeStartDate(newDate) {
		if (this.hasStarted()) {
			throw new Error("Impossible de modifier la date d'un événement déjà commencé");
		}
		this.start_at = new Date(newDate)
	}
}
