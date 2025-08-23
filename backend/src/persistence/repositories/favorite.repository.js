export class FavoriteGameRepository {
	constructor(prismaClient = prisma) {
		this.prisma = prismaClient;
	}

	async getUserFavoritesGames(userId) {
		return this.prisma.user_favorite_games.findMany({
			where: { userId },
			include: { game: true }
		});
	}

	async addFavoriteGame(userId, gameId) {
		return this.prisma.user_favorite_games.create({
			data: { userId, gameId }
		});
	}

	async removeFavoriteGame(userId, gameId) {
		return this.prisma.user_favorite_games.delete({
			where: { user_id_game_id: { userId, gameId }}
		});
	}
}
