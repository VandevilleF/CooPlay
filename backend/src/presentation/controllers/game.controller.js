import { GameService } from "../../business/services/game.service.js";

export class GameController {
	constructor(gameService = new GameService()) {
		this.gameService = gameService;
	}

	async searchGames(req, res) {
		try {
			const { q: query, limit = 10 } = req.query;

			const result = await this.gameService.searchGame(query, {
				limit: parseInt(limit)
			});

			res.status(200).json({
				success: true,
				data: result
			});
		} catch (error) {
			console.error(error);
		}
	}
}
