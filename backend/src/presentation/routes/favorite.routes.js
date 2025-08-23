import express from "express";
import { firebaseAuthMiddleware } from '../../presentation/middlewares/firebaseauth.middleware.js';
import { FavoriteGameService } from "../../business/services/favorite.service.js";
import { UserRepository } from "../../persistence/repositories/user.repository.js";
import { FavoriteGameRepository } from "../../persistence/repositories/favorite.repository.js";

const router = express.Router();

const userRepository = new UserRepository();
const favoriteGameRepository = new FavoriteGameRepository();
const favoriteGameService = new FavoriteGameService(userRepository, favoriteGameRepository);

/**
 * @openapi
 * /profil/favorites:
 *   get:
 *     summary: Récupère la liste des jeux favoris de l’utilisateur
 *     tags:
 *       - User
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
router.get('/profil/favorites', firebaseAuthMiddleware, async (req, res) => {
	try {
		const favoritesGames = await favoriteGameService.listFavoritesGames(req.user.uid);
		res.status(200).json(favoritesGames);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

/**
 * @openapi
 * /profil/favorites:
 *   post:
 *     summary: Ajoute un jeu aux favoris
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gameId:
 *                 type: string
 *                 example: "12345"
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
router.post('/profil/favorites', firebaseAuthMiddleware, async (req, res) => {
	try {
		const { gameId } = req.body;
		const favorite = await favoriteGameService.addFavoriteGame(req.user.uid, gameId);
		res.status(201).json(favorite);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

/**
 * @openapi
 * /profil/favorites/{gameId}:
 *   delete:
 *     summary: Supprime un jeu des favoris
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du jeu à retirer des favoris
 *     responses:
 *       204:
 *         description: Jeu supprimé des favoris
 *       401:
 *         description: Non authentifié
 */
router.delete('/profil/favorites/:gameId', firebaseAuthMiddleware, async (req, res) => {
	try {
		const { gameId } = req.params;
		await  favoriteGameService.removeFavoriteGame(req.user.uid, gameId);
		res.status(204).send();
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
