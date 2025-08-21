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
	addDescribe(describe) {
		if (describe.length > 300) {
			throw new Error("La description doit faire maximum 300 caractères");
		}
		this.describe = describe;
	}
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
	addFavoriteGame(game) {
		if (this.favorites_games.some(g => g.id !== game.id)) {
			throw new Error("Ce jeu est déjà dans les favoris");
		}
		this.favorites_games.push(game);
	}
	removeFavoriteGame(gameId) {
		if (!this.favorites_games.some(game => game.id === gameId || game.game_id === gameId)) {
			throw new Error("Ce jeu n'est pas dans les favoris");
		}
		this.favorite_games = this.favorite_games.filter(
			game => game.id !== gameId && game.game_id !== gameId
		);
	}
	canChangePassword(oldPasswordPlaintext, hashComparer) {
		// hashComparer est une fonction passée en paramètre qui retourne true si ok
		if (!hashComparer(oldPasswordPlaintext, this.password_hash)) {
			throw new Error("Ancien mot de passe incorrect");
		}
		return true;
	}

	changePassword(newPasswordHash) {
		this.password_hash = newPasswordHash;
	}
}
