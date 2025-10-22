import express from "express";
import { firebaseAuthMiddleware } from '../../presentation/middlewares/firebaseauth.middleware.js';
import { GameController } from '../controllers/game.controller.js';


const router = express.Router();
const gameController = new GameController();

/**
 * @openapi
 * /games/search:
 *   get:
 *     summary: Rechercher des jeux par nom
 *     description: |
 *       Recherche des jeux dans la base de données en fonction du nom.
 *       La recherche nécessite au moins 3 caractères et est insensible à la casse.
 *       Les résultats sont triés par ordre alphabétique.
 *     tags:
 *       - Games
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *         description: Terme de recherche (minimum 3 caractères)
 *         example: "Counter-Strike"
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Nombre maximum de résultats à retourner
 *         example: 10
 *     responses:
 *       200:
 *         description: Recherche effectuée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameSearchResponse'
 *             examples:
 *               success:
 *                 summary: Recherche avec résultats
 *                 value:
 *                   success: true
 *                   data:
 *                     games: [
 *                       {
 *                         "id": 1,
 *                         "name": "Counter-Strike 2",
 *                         "cover_url": "https://example.com/covers/cs2.jpg"
 *                       },
 *                       {
 *                         "id": 2,
 *                         "name": "Counter-Strike: Global Offensive",
 *                         "cover_url": "https://example.com/covers/csgo.jpg"
 *                       }
 *                     ]
 *               empty:
 *                 summary: Aucun résultat trouvé
 *                 value:
 *                   success: true
 *                   data:
 *                     games: []
 *       400:
 *         description: Erreur de requête
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameSearchErrorResponse'
 *             examples:
 *               missing_query:
 *                 summary: Terme de recherche manquant
 *                 value:
 *                   success: false
 *                   error: "Le terme de recherche est requis"
 *               too_short:
 *                 summary: Terme de recherche trop court
 *                 value:
 *                   success: false
 *                   error: "La recherche doit contenir au moins 3 caractères"
 *               limit_exceeded:
 *                 summary: Limite dépassée
 *                 value:
 *                   success: false
 *                   error: "La limite ne peut pas dépasser 50 résultats"
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameSearchErrorResponse'
 *             example:
 *               success: false
 *               error: "Token d'authentification requis"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameSearchErrorResponse'
 *             example:
 *               success: false
 *               error: "Erreur interne du serveur"
 *
 * components:
 *   schemas:
 *     GameSearchResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             games:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GameSearchItem'
 *
 *     GameSearchItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique du jeu
 *           example: 1
 *         name:
 *           type: string
 *           description: Nom du jeu
 *           example: "Counter-Strike 2"
 *         cover_url:
 *           type: string
 *           nullable: true
 *           description: URL de l'image de couverture du jeu
 *           example: "https://example.com/covers/cs2.jpg"
 *       required:
 *         - id
 *         - name
 *
 *     GameSearchErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           description: Message d'erreur descriptif
 *           example: "Le terme de recherche est requis"
 *       required:
 *         - success
 *         - error
 *
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/search', (req, res) => gameController.searchGames(req, res));

export default router;
