import express from "express";
import { firebaseAuthMiddleware } from '../../presentation/middlewares/firebaseauth.middleware.js';
import { getMessages } from '../../presentation/controllers/chat.controller.js';
import { getEncryptionKey } from '../../presentation/controllers/encryption.controller.js';

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

router.get('/events/:eventId/encryption_key', firebaseAuthMiddleware, getEncryptionKey);

export default router;
