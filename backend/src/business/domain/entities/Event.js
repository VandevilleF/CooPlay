class Event {
	constructor({id, title, description, creator_id, game_id, start_at, max_participants, create_at, participants}) {
		// Validation basique des données (sans vérifier date future car peut charger événements passés)
		if (id === undefined) {
			// Création d'un nouvel événement
			this.validateTitle(title);
			this.validateDescription(description);
			this.validateMaxParticipants(max_participants);
			this.validateGameId(game_id);
			this.validateStartDate(start_at, false); // Vérifier que date est dans le futur
		} else {
			// Chargement depuis BDD - validation basique uniquement
			this.validateStartDate(start_at, true); // Ne pas vérifier si dans le futur
		}

		this.id = id;
		this.title = title;
		this.description = description;
		this.creator_id = creator_id;
		this.game_id = game_id;
		this.start_at = start_at;
		this.max_participants = max_participants;
		this.create_at = create_at;

		this.participants = participants || [];
		this.chats = [];
	}

	// --- MÉTHODES DE VALIDATION --- //
	validateTitle(title) {
		if (title === undefined || title === null || typeof title !== 'string') {
			throw new Error('Le titre est requis et doit être une chaîne de caractères');
		}
		const trimmedTitle = title.trim();
		if (trimmedTitle.length === 0) {
			throw new Error('Le titre ne peut pas être vide');
		}
		if (trimmedTitle.length < 3) {
			throw new Error('Le titre doit contenir au moins 3 caractères');
		}
		if (trimmedTitle.length > 50) {
			throw new Error('Le titre ne peut pas dépasser 50 caractères');
		}
	}

	validateDescription(description) {
		if (description !== undefined && description !== null) {
			if (typeof description !== 'string') {
				throw new Error('La description doit être une chaîne de caractères');
			}
			if (description.length > 500) {
				throw new Error('La description ne peut pas dépasser 500 caractères');
			}
		}
	}

	validateMaxParticipants(maxParticipants) {
		if (maxParticipants === undefined || maxParticipants === null) {
			throw new Error('Le nombre maximum de participants est requis');
		}
		const maxPart = Number(maxParticipants);
		if (!Number.isInteger(maxPart)) {
			throw new Error('Le nombre maximum de participants doit être un nombre entier');
		}
		if (maxPart < 1) {
			throw new Error('Le nombre maximum de participants doit être au moins 1');
		}
		if (maxPart > 20) {
			throw new Error('Le nombre maximum de participants ne peut pas dépasser 20');
		}
	}

	validateGameId(gameId) {
		if (gameId === undefined || gameId === null) {
			throw new Error("L'ID du jeu est requis");
		}
		const gameIdNum = Number(gameId);
		if (!Number.isInteger(gameIdNum) || gameIdNum <= 0) {
			throw new Error("L'ID du jeu doit être un nombre entier positif");
		}
	}

	validateStartDate(startDate, skipFutureCheck = false) {
		if (!startDate) {
			throw new Error('La date de début est requise');
		}
		const date = new Date(startDate);
		if (isNaN(date.getTime())) {
			throw new Error('La date de début doit être une date valide');
		}
		// Lors de la création, vérifier que la date est dans le futur
		// Lors de la lecture depuis la BDD, ne pas vérifier (événements passés)
		if (!skipFutureCheck && date <= new Date()) {
			throw new Error('La date de début doit être dans le futur');
		}
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

	listParticipants() {
		return this.participants;
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

	updateEvent(userId, data) {
		if (userId !== this.creator_id) {
			throw new Error("Seul le créateur peut modifier l'événement");
		}
		if (this.hasStarted()) {
			throw new Error("Impossible de modifier un événement déjà commencé");
		}

		// Propriétés modifiables
		const updatableFields = {
			title: (value) => {
				this.validateTitle(value);
				this.title = value;
			},
			description: (value) => {
				this.validateDescription(value);
				this.description = value;
			},
			start_at: (value) => {
				this.validateStartDate(value, false); // Vérifier que la nouvelle date est dans le futur
				this.start_at = new Date(value);
			},
			max_participants: (value) => {
				this.validateMaxParticipants(value);
				if (value < this.participants.length) {
					throw new Error("Le nombre maximum de participants ne peut pas être inférieur au nombre actuel de participants");
				}
				this.max_participants = value;
			}
		}

		// Destructuration de l'objet en itérable par clé, valeur avec entries
		Object.entries(data).forEach(([key, value]) => {
			// Vérification que la valeur ne soit pas nulle et différente de celle existante
			if (value !== undefined && updatableFields[key]) {
				// Modifie la valeur par rapport à la clé donnée
				updatableFields[key](value);
			}
		});
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
