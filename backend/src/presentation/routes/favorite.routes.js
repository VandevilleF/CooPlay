import express from "express";
import { firebaseAuthMiddleware } from '../../presentation/middlewares/firebaseauth.middleware.js';
import { FavoriteGameService } from "../../business/services/favorite.service.js";
import { UserRepository } from "../../persistence/repositories/user.repository.js";
import { UserService } from "../../business/services/user.service.js";
import { AuthService } from '../../business/services/auth.service.js';
import { FavoriteGameRepository } from "../../persistence/repositories/favorite.repository.js";

const router = express.Router();

const userRepository = new UserRepository();
const favoriteGameRepository = new FavoriteGameRepository();
const authService = new AuthService();
const favoriteGameService = new FavoriteGameService(userRepository, favoriteGameRepository);
const userService = new UserService(userRepository, authService);

/**
 * @openapi
 * /favorites:
 *   get:
 *     summary: Récupère la liste des jeux favoris de l’utilisateur
 *     tags:
 *       - FavoritesGames
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des jeux favoris
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FavoriteGame'
 *       401:
 *         description: Non authentifié
 */
router.get('/', firebaseAuthMiddleware, async (req, res) => {
	try {
		const user = await userService.getUserByFirebaseUid(req.user.uid);
		const favoritesGames = await favoriteGameService.listFavoritesGames(user.id);
		res.status(200).json(favoritesGames);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

/**
 * @openapi
 * /favorites/{gameId}:
 *   post:
 *     summary: Ajoute un jeu aux favoris
 *     tags:
 *       - FavoritesGames
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12345
 *         description: ID du jeu à ajouter aux favoris
 *     responses:
 *       201:
 *         description: Jeu ajouté en favori
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteGame'
 *       401:
 *         description: Non authentifié
 */
router.post('/:gameId', firebaseAuthMiddleware, async (req, res) => {
	try {
		const user = await userService.getUserByFirebaseUid(req.user.uid);
		const gameId = parseInt(req.params.gameId, 10);
		
		const favorite = await favoriteGameService.addFavoriteGame(user.id, gameId);
		res.status(201).json(favorite);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

/**
 * @openapi
 * /favorites/{gameId}:
 *   delete:
 *     summary: Supprime un jeu des favoris
 *     tags:
 *       - FavoritesGames
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du jeu à retirer des favoris
 *     responses:
 *       204:
 *         description: Jeu supprimé des favoris
 *       401:
 *         description: Non authentifié
 */
router.delete('/:gameId', firebaseAuthMiddleware, async (req, res) => {
	try {
		const user = await userService.getUserByFirebaseUid(req.user.uid);
		const gameId = parseInt(req.params.gameId, 10);
		console.log(typeof gameId);
		await favoriteGameService.removeFavoriteGame(user.id, gameId);
		res.status(204).send();
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
