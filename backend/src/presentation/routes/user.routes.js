import express from "express";
import { firebaseAuthMiddleware } from '../../presentation/middlewares/firebaseauth.middleware.js';
import { UserService } from "../../business/services/user.service.js";
import { AuthService } from '../../business/services/auth.service.js';
import { UserRepository } from "../../persistence/repositories/user.repository.js";

const router = express.Router();

const userRepository = new UserRepository();
const authService = new AuthService();

const userService = new UserService(userRepository, authService);

/**
 * @openapi
 * /profil:
 *   get:
 *     summary: Récupère les infos de l’utilisateur connecté
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l’utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 */
router.get('/profil', firebaseAuthMiddleware, async (req, res) => {
  const user = await userService.getUserByFirebaseUid(req.user.uid);
  res.status(200).json({ user });
});

/**
 * @openapi
 * /profil:
 *   put:
 *     summary: Modifie les infos de l’utilisateur connecté
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
 *               username:
 *                 type: string
 *                 example: "nouveauNom"
 *               describe:
 *                 type: string
 *                 example: "Fan de MMORPG"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 */
router.put('/profil', firebaseAuthMiddleware, async (req, res) => {
  const user = await userService.getUserByFirebaseUid(req.user.uid);
  const { username, describe } = req.body;

  const updatedUser = await userService.updateUser(user.id, { username, describe })
  res.status(200).json({ user: updatedUser });
});

/**
 * @openapi
 * /profil:
 *   delete:
 *     summary: Supprime le compte utilisateur connecté
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Compte supprimé avec succès (aucun contenu)
 *       401:
 *         description: Non authentifié (token manquant ou invalide)
 *       500:
 *         description: Erreur serveur lors de la suppression
 */
router.delete('/profil', firebaseAuthMiddleware, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Token manquant ou invalide" });

  try {
    await userService.deleteUserByFirebaseUid(req.user.uid);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la suppression"});
  }
});

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
	const user = await userRepository.getUserByFirebaseUid(req.user.uid);
	const favoritesGames = await userRepository.getUserFavoriteGame(user.id);

	res.status(200).json(favoritesGames);
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
	const user = await userRepository.getUserByFirebaseUid(req.user.uid);
  const { gameId } = req.body;

	const newFavoriteGame = await userRepository.addUserFavoriteGame(user.id, gameId);

	res.status(201).json(newFavoriteGame);
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
  const user = await userRepository.getUserByFirebaseUid(req.user.uid);
  const { gameId } = req.params;

  await userRepository.deleteUserFavoriteGame(user.id, gameId);

  res.status(204).send();
});

/**
 * @openapi
 * /profil/trophies:
 *   get:
 *     summary: Récupère les trophées de l’utilisateur
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des trophées
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trophy'
 *       401:
 *         description: Non authentifié
 */
router.get('/profil/trophies', firebaseAuthMiddleware, async (req, res) => {
  const user = await userRepository.getUserByFirebaseUid(req.user.uid);
  const userTrophies = await userRepository.getTrophies(user.id);

  res.status(200).json(userTrophies);
});

/**
 * @openapi
 * /profil/events:
 *   get:
 *     summary: Récupère les événements de l’utilisateur (créés et rejoints)
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des événements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *         description: Non authentifié
 */
router.get('/profil/events', firebaseAuthMiddleware, async (req, res) => {
  const user = await userRepository.getUserByFirebaseUid(req.user.uid);
  const events = await userRepository.getUserEvents(user.id);

  res.status(200).json(events);
});

export default router;
