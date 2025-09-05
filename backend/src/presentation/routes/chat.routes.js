import express from "express";
import { firebaseAuthMiddleware } from '../../presentation/middlewares/firebaseauth.middleware.js';
import { getMessages } from '../../presentation/controllers/chat.controller.js';
import { sendMessage } from '../../presentation/controllers/send.message.js';

const router = express.Router();

/**
 * @openapi
 * /chat/events/{eventId}/messages:
 *   get:
 *     summary: Récupérer l'historique des messages d'un événement
 *     description: |
 *       Récupère les messages du chat d'un événement spécifique.
 *       L'utilisateur doit être participant à l'événement pour accéder au chat.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de l'événement
 *         example: 123
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Nombre maximum de messages à retourner
 *         example: 20
 *     responses:
 *       200:
 *         description: Messages récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatResponse'
 *             examples:
 *               success:
 *                 summary: Chat avec messages
 *                 value:
 *                   success: true
 *                   data: [
 *                     {
 *                       "id": 1,
 *                       "eventId": 123,
 *                       "userId": 456,
 *                       "username": "GamerPro123",
 *                       "message": "Salut tout le monde !",
 *                       "timestamp": "2025-09-04T14:30:00.000Z",
 *                       "avatar": "https://example.com/avatars/user456.jpg"
 *                     },
 *                     {
 *                       "id": 2,
 *                       "eventId": 123,
 *                       "userId": 789,
 *                       "username": "PlayerTwo",
 *                       "message": "Prêt pour le match !",
 *                       "timestamp": "2025-09-04T14:35:00.000Z",
 *                       "avatar": null
 *                     }
 *                   ]
 *               empty:
 *                 summary: Chat vide
 *                 value:
 *                   success: true
 *                   data: []
 *       400:
 *         description: Erreur de requête
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatErrorResponse'
 *             examples:
 *               invalid_id:
 *                 summary: ID d'événement invalide
 *                 value:
 *                   success: false
 *                   message: "ID d'événement invalide"
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatErrorResponse'
 *             example:
 *               success: false
 *               message: "Token d'authentification requis"
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatErrorResponse'
 *             examples:
 *               not_participant:
 *                 summary: Utilisateur non participant
 *                 value:
 *                   success: false
 *                   message: "Vous ne participez pas à cet événement"
 *               event_not_started:
 *                 summary: Événement pas encore commencé
 *                 value:
 *                   success: false
 *                   message: "Le chat sera disponible au début de l'événement"
 *       404:
 *         description: Événement non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatErrorResponse'
 *             example:
 *               success: false
 *               message: "Événement introuvable"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatErrorResponse'
 *             example:
 *               success: false
 *               message: "Erreur interne du serveur"
 */
router.get('/events/:eventId/messages', firebaseAuthMiddleware, getMessages);
/**
 * @openapi
 * /chat/events/{eventId}/messages:
 *   post:
 *     summary: Envoyer un nouveau message dans le chat d'un événement
 *     description: |
 *       Permet d'envoyer un message dans le chat d'un événement spécifique.
 *       L'utilisateur doit être participant à l'événement ou en être le créateur pour pouvoir envoyer des messages.
 *       Le message sera automatiquement diffusé aux autres participants connectés via WebSocket.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID de l'événement
 *         example: 123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 500
 *                 description: Contenu du message à envoyer
 *                 example: "Salut tout le monde ! Prêt pour le match ?"
 *           examples:
 *             simple_message:
 *               summary: Message simple
 *               value:
 *                 message: "Salut tout le monde !"
 *             game_message:
 *               summary: Message de jeu
 *               value:
 *                 message: "On commence dans 10 minutes, tout le monde est prêt ?"
 *             emoji_message:
 *               summary: Message avec emoji
 *               value:
 *                 message: "GG les gars ! 🎮"
 *     responses:
 *       201:
 *         description: Message envoyé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID unique du message créé
 *                       example: 42
 *                     eventId:
 *                       type: integer
 *                       description: ID de l'événement
 *                       example: 123
 *                     userId:
 *                       type: integer
 *                       description: ID de l'utilisateur qui a envoyé le message
 *                       example: 456
 *                     username:
 *                       type: string
 *                       description: Nom d'utilisateur de l'expéditeur
 *                       example: "GamerPro123"
 *                     message:
 *                       type: string
 *                       description: Contenu du message
 *                       example: "Salut tout le monde !"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       description: Date et heure d'envoi du message
 *                       example: "2025-09-05T16:45:00.000Z"
 *                     avatar:
 *                       type: string
 *                       nullable: true
 *                       description: URL de l'avatar de l'utilisateur
 *                       example: "https://example.com/avatars/user456.jpg"
 *             examples:
 *               success:
 *                 summary: Message créé avec succès
 *                 value:
 *                   success: true
 *                   data:
 *                     id: 42
 *                     eventId: 123
 *                     userId: 456
 *                     username: "GamerPro123"
 *                     message: "Salut tout le monde !"
 *                     timestamp: "2025-09-05T16:45:00.000Z"
 *                     avatar: "https://example.com/avatars/user456.jpg"
 *       400:
 *         description: Erreur de requête
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatErrorResponse'
 *             examples:
 *               empty_message:
 *                 summary: Message vide
 *                 value:
 *                   success: false
 *                   message: "Le message ne peut pas être vide"
 *               message_too_long:
 *                 summary: Message trop long
 *                 value:
 *                   success: false
 *                   message: "Le message ne peut pas dépasser 500 caractères"
 *               invalid_event_id:
 *                 summary: ID d'événement invalide
 *                 value:
 *                   success: false
 *                   message: "ID d'événement invalide"
 *               missing_message:
 *                 summary: Champ message manquant
 *                 value:
 *                   success: false
 *                   message: "Le champ 'message' est requis"
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatErrorResponse'
 *             example:
 *               success: false
 *               message: "Token d'authentification requis"
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatErrorResponse'
 *             examples:
 *               not_participant:
 *                 summary: Utilisateur non participant
 *                 value:
 *                   success: false
 *                   message: "Vous ne participez pas à cet événement"
 *               chat_disabled:
 *                 summary: Chat désactivé
 *                 value:
 *                   success: false
 *                   message: "Le chat n'est pas encore ouvert pour cet événement"
 *       404:
 *         description: Événement non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatErrorResponse'
 *             example:
 *               success: false
 *               message: "Événement introuvable"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatErrorResponse'
 *             examples:
 *               server_error:
 *                 summary: Erreur serveur
 *                 value:
 *                   success: false
 *                   message: "Erreur lors de l'envoi du message"
 *               database_error:
 *                 summary: Erreur base de données
 *                 value:
 *                   success: false
 *                   message: "Erreur de connexion à la base de données"
 */
router.post('/events/:eventId/messages', firebaseAuthMiddleware, sendMessage);

export default router;
