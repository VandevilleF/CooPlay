class User {
	constructor({id, username, email, describe = null, password_hash, avatar_id = null, is_admin = false, created_at}) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.describe = describe;
		this.password_hash = password_hash;
		this.avatar_id = avatar_id;
		this.is_admin = is_admin;
		this.created_at = created_at;

		this.favorites_games = [];
		this.events_created = [];
		this.events_joined = [];
		this.trophies = [];
		this.chat = [];
	}

	// -- EVENT -- //
	canJoinEvent(event) {
		if (event.isFull()) {
			return false;
		}
		if (event.creator_id === this.id) {
			return false;
		}
		if (event.participants.some(participant => participant.id === this.id)) {
			return false;
		}
		return true;
	}
	createEvent(eventData) {
		const event = new Event({ ...eventData, creator_id: this.id });
		this.events_created.push(event);
		return event;
	}
	canRemoveEvent(event) {
		return this.is_admin || event.creator_id === this.id;
	}
	removeEvent(event) {
		if (!this.canRemoveEvent(event)) {
			throw new Error("Seul le créateur peux supprimer l'événement");
		}
		this.events_created = this.events_created.filter(ev => ev.id !== event.id);
	}
	canModerateEvent(event) {
		return this.is_admin || event.creator_id !== this.id;
	}

	// -- FAVORITE GAME -- //
	addFavoriteGame(game) {
		if (this.favorites_games.some(g => g.id === game.id || g.game_id === game.id)) {
			throw new Error("Ce jeu est déjà dans les favoris");
		}
		this.favorites_games.push(game);
	}
	removeFavoriteGame(gameId) {
		if (!this.favorites_games.some(g => g.id === gameId || g.game_id === gameId)) {
			throw new Error("Ce jeu n'est pas dans les favoris");
		}
		this.favorites_games = this.favorites_games.filter(
			g => g.id !== gameId && g.game_id !== gameId
		);
	}
}
