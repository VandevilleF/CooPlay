import express from "express";
import { AuthenticateUserUseCase } from "../../business/use-cases/auth.usecase.js";
import { firebaseAuthMiddleware } from '../../presentation/middlewares/firebaseauth.middleware.js';
import { AuthService } from "../../business/services/auth.service.js";
import { UserService } from "../../business/services/user.service.js";
import { UserRepository } from "../../persistence/repositories/user.repository.js";

const router = express.Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const authService = new AuthService();
const authenticateUserUseCase = new AuthenticateUserUseCase(authService, userService);

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Authentifie un utilisateur avec Firebase
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Le token Firebase ID
 *                 example: eyJhbGciOiJIUzI1NiIsInR...
 *     responses:
 *       200:
 *         description: Utilisateur authentifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token invalide ou expiré
 */
router.post("/login", async (req, res) => {
	try {
		const { idToken } = req.body;
		const user = await authenticateUserUseCase.execute(idToken);
		res.json(user);
	} catch (err) {
		res.status(401).json({ error: err.message });
	}
});

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
    const userData = await userService.getUserByFirebaseUid(req.user.uid);
  const user = {
	"username": userData.username,
	"email": userData.email,
	"describe": userData.describe,
	"avatar_id": userData.avatar_id,
	"created_at": userData.created_at,
  }
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

export default router;
