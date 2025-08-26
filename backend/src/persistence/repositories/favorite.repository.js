import { prisma } from '../../shared/prismaClient.js'

export class FavoriteGameRepository {
	constructor(prismaClient = prisma) {
		this.prisma = prismaClient;
	}

	async getUserFavoritesGames(userId) {
		return this.prisma.userFavoriteGame.findMany({
			where: { user_id: userId },
			include: { game: true }
		});
	}

	async addFavoriteGame(userId, gameId) {
		return this.prisma.userFavoriteGame.create({
			data: { user_id: userId, game_id: gameId }
		});
	}

	async removeFavoriteGame(userId, gameId) {
		return this.prisma.userFavoriteGame.delete({
			where: { user_id_game_id: { user_id: userId, game_id: gameId }}
		});
	}
}
