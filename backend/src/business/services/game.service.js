import { GameRepository } from "../../persistence/repositories/game.repository.js";

export class GameService {
	constructor(gameRepository = new GameRepository()) {
		this.gameRepository = gameRepository;
	}
	async searchGame(searchTerm, options = {}) {
		if (!searchTerm || typeof searchTerm !== 'string') {
			throw new Error('Le terme de recherche est requis');
		}
		if (searchTerm.length < 2) {
			throw new Error('La recherche doit contenir au moins 3 caractères');
		}

		const { limit = 10 } = options;

		try {
			const games = await this.gameRepository.searchByName(searchTerm, { limit });
			return { games };
		} catch (error) {
			throw new Error(`Erreur lors de la recherche: ${error.message}`);
		}
	}
}
