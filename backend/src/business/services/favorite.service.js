export class FavoriteGameService {
	constructor(userRepository, favoriteGameRepository) {
		this.userRepository = userRepository;
		this.favoriteGameRepository = favoriteGameRepository;
	}

	async listFavoritesGames(userId) {
		return this.favoriteGameRepository.favoriteGameRepository(userId);
	}

	async addFavoriteGame(userId, game) {
		/**
		 * Adds a game to a user's favorites.
		 * - Loads current favorites from DB.
		 * - Applies entity rules (throws if already favorited).
		 * - Persists new favorite in DB.
		 * Note: Returns DB record, not full updated User object.
		 */
		const favoritesGames = await this.favoriteGameRepository.getUserFavoritesGames(userId);
		const user = new User({ id: userId });
		user.favorites_games = favoritesGames.map(f => f.game);

		user.addFavoriteGame(game);

		return this.favoriteGameRepository.addFavoriteGame(userId, game.id);
	}

	async removeFavoriteGame(userId, gameId) {
		/**
		 * Remove a game to a user's favorites.
		 * - Loads current favorites from DB.
		 * - Applies entity rules (throws if already favorited).
		 * - Remove favorite in DB.
		 * Note: Returns DB record, not full updated User object.
		 */
		const favorites = await this.favoriteGameRepository.getUserFavoritesGames(userId);
		const user = new User({ id: userId });
		user.favorites_games = favorites.map(f => f.game);

		user.removeFavoriteGame(gameId);

		return this.favoriteGameRepository.removeFavoriteGame(userId, gameId);
	}
}
