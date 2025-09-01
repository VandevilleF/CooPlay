import express from "express";
import { firebaseAuthMiddleware } from '../../presentation/middlewares/firebaseauth.middleware.js';
import { EventService } from "../../business/services/event.service.js";
import { UserService } from "../../business/services/user.service.js";
import { AuthService } from '../../business/services/auth.service.js';
import { UserRepository } from "../../persistence/repositories/user.repository.js";
import { EventRepository } from "../../persistence/repositories/event.repository.js";

const router = express.Router();
const userRepository = new UserRepository();
const eventRepository = new EventRepository();
const authService = new AuthService();
const userService = new UserService(userRepository, authService);
const eventService = new EventService(userRepository, eventRepository);

// -- GET ALL EVENTS --
/**
 * @openapi
 * /events:
 *   get:
 *     summary: Récupérer la liste des événements
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: Liste des événements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get("/", async (req, res) => {
	try {
		const events = await eventService.getAllEvents();
		res.status(200).json(events);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// ---- CREATE EVENT ----
/**
 * @openapi
 * /events:
 *   post:
 *     summary: Créer un nouvel événement
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               start_at:
 *                 type: string
 *                 format: date-time
 *               max_participants:
 *                 type: integer
 *               gameId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Événement créé avec succès
 *       400:
 *         description: Erreur de validation
 */
router.post("/", firebaseAuthMiddleware, async (req, res) => {
	try {
		const user = await userService.getUserByFirebaseUid(req.user.uid);
		const { title, description, start_at, max_participants, gameId } = req.body;

		const event = await eventService.createEvent(user.id, {
		title,
		description,
		start_at,
		max_participants,
		gameId,
		});

		res.status(201).json(event);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// ---- UPDATE EVENT ----
/**
 * @openapi
 * /events/{eventId}:
 *   put:
 *     summary: Modifier un événement
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'événement à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Nouveau titre"
 *               description:
 *                 type: string
 *                 example: "Nouvelle description"
 *               start_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-09-01T14:07:47.592Z"
 *               max_participants:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Modification réussie
 *       400:
 *         description: Erreur lors de la modification
 *       404:
 *         description: Événement non trouvé
 */
router.put("/:eventId", firebaseAuthMiddleware, async (req, res) => {
	try {
		const user = await userService.getUserByFirebaseUid(req.user.uid);
		const { eventId } = req.params;
		const { title, description, start_at, max_participants } = req.body;

		await eventService.updateEvent(user.id, parseInt(eventId, 10), {
			title,
			description,
			start_at,
			max_participants,
		});

		res.status(201).json({ message: "Modification réussie" });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// ---- JOIN EVENT ----
/**
 * @openapi
 * /events/{eventId}/join:
 *   post:
 *     summary: Rejoindre un événement
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inscription réussie
 *       400:
 *         description: Erreur lors de l’inscription
 */
router.post("/:eventId/join", firebaseAuthMiddleware, async (req, res) => {
	try {
		const user = await userService.getUserByFirebaseUid(req.user.uid);
		const { eventId } = req.params;

		await eventService.joinEvent(user.id, parseInt(eventId, 10));
		res.status(200).json({ message: "Inscription réussie" });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// ---- LEAVE EVENT ----
/**
 * @openapi
 * /events/{eventId}/leave:
 *   post:
 *     summary: Quitter un événement
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Désinscription réussie
 *       400:
 *         description: Erreur lors de la désinscription
 */
router.post("/:eventId/leave", firebaseAuthMiddleware, async (req, res) => {
	try {
		const user = await userService.getUserByFirebaseUid(req.user.uid);
		const { eventId } = req.params;

		await eventService.leaveEvent(user.id, parseInt(eventId, 10));
		res.status(200).json({ message: "Désinscription réussie" });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// ---- DELETE EVENT ----
/**
 * @openapi
 * /events/{eventId}:
 *   delete:
 *     summary: Supprimer un événement
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Événement supprimé
 *       400:
 *         description: Erreur lors de la suppression
 */
router.delete("/:eventId", firebaseAuthMiddleware, async (req, res) => {
	try {
		const user = await userService.getUserByFirebaseUid(req.user.uid);
		const { eventId } = req.params;

		await eventService.deleteEvent(user.id, parseInt(eventId, 10));
		res.status(204).send();
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// ---- UPDATE EVENT GAME ----
/**
 * @openapi
 * /events/{eventId}/game:
 *   put:
 *     summary: Modifier le jeu associé à un événement
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newGameId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Jeu mis à jour avec succès
 *       400:
 *         description: Erreur lors de la mise à jour
 */
router.put("/:eventId/game", firebaseAuthMiddleware, async (req, res) => {
	try {
		const user = await userService.getUserByFirebaseUid(req.user.uid);
		const { eventId } = req.params;
		const { newGameId } = req.body;

		const event = await eventService.updateEventGame(user.id, parseInt(eventId, 10), newGameId);
		res.status(200).json(event);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// -- GET EVENT --
/**
 * @openapi
 * /events/{eventId}:
 *   get:
 *     summary: Récupérer un événement par ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Événement trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Événement non trouvé
 */
router.get("/:eventId", async (req, res) => {
	try {
		const { eventId } = req.params;
		const event = await eventService.getEventById(parseInt(eventId, 10));

		if (!event) {
		return res.status(404).json({ error: "Événement non trouvé" });
		}

		res.status(200).json(event);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

export default router;
