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
 * /users/profil:
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
router.get('/profil', async (req, res) => {
  const user = await userService.getUserByFirebaseUid(req.user.uid);
  res.status(200).json({ user });
});

/**
 * @openapi
 * /users/profil:
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
router.put('/profil', async (req, res) => {
  const user = await userService.getUserByFirebaseUid(req.user.uid);
  const { username, describe } = req.body;

  const updatedUser = await userService.updateUser(user.id, { username, describe })
  res.status(200).json({ user: updatedUser });
});

/**
 * @openapi
 * /users/profil:
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
router.delete('/profil', async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Token manquant ou invalide" });

  try {
    await userService.deleteUserByFirebaseUid(req.user.uid);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression"});
  }
});

export default router;
