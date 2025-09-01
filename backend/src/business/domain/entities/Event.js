class Event {
	constructor({id, title, description, creator_id, game_id, start_at, max_participants, create_at, participants}) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.creator_id = creator_id;
		this.game_id = game_id;
		this.start_at = start_at;
		this.max_participants = max_participants;
		this.create_at= create_at;

		this.participants = participants || [];
		this.chats = [];
	}
	isFull() {
		return this.participants.length >= this.max_participants;
	}
	isCreator(userId) {
		return this.creator_id === userId;
	}
	addParticipant(userId) {
		if (this.isFull()) {
			throw new Error("L'événement est complet");
		}
		if (this.creator_id === userId) {
			throw new Error("Le créateur ne peut pas rejoindre son propre événement");
		}
		if (this.participants.some(participant => participant.user_id === userId)) {
			throw new Error("L'utilisateur participe déjà à cet événement");
		}
		this.participants.push({ user_id: userId });
	}
	removeParticipant(userId) {
		if (userId === this.creator_id) {
			throw new Error("Le créateur ne peut pas se retirer lui-même");
		}
		// On garde le nombre de participants avant suppression
		const beforeCount = this.participants.length;
		this.participants = this.participants.filter(p => p.user_id !== userId);

		// Si la taille du tableau n'a pas changé → l'utilisateur n'était pas dans la liste
		if (this.participants.length === beforeCount) {
			throw new Error("L'utilisateur ne participe pas à cet événement");
		}
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

export { Event };
