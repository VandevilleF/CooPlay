import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './presentation/routes/auth.routes.js';
import userRoutes from './presentation/routes/user.routes.js';
import favoritesGamesRoutes from './presentation/routes/favorite.routes.js';
import eventsRoutes from './presentation/routes/event.routes.js';
import chatRoutes from './presentation/routes/chat.routes.js';
import gameRoutes from './presentation/routes/game.route.js';
import { config } from './config/environment.js';
import { AuthService } from './business/services/auth.service.js';
import { UserService } from './business/services/user.service.js';
import { FavoriteGameService } from './business/services/favorite.service.js';
import { swaggerDocs } from './config/docs/swagger.js';
import { firebaseAuthMiddleware } from './presentation/middlewares/firebaseauth.middleware.js';

import { SocketManager } from './infrastructure/websocket/socketManager.js';
import { chatHandler } from './presentation/handler/chat.handler.js';
import { socketAuthMiddleware } from './presentation/middlewares/socket-auth.middleware.js';

const app = express();

// Créer le serveur HTTP à partir de l'app Express
const httpServer = http.createServer(app);

const socketManager = new SocketManager(httpServer);
socketManager.setup(socketAuthMiddleware, chatHandler);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', firebaseAuthMiddleware, userRoutes);
app.use('/favorites', firebaseAuthMiddleware, favoritesGamesRoutes);
app.use('/events', firebaseAuthMiddleware, eventsRoutes);
app.use('/chat', firebaseAuthMiddleware, chatRoutes);
app.use('/games', firebaseAuthMiddleware, gameRoutes);

const authService = new AuthService();
const userService = new UserService();
const favoritesGamesService = new FavoriteGameService();

swaggerDocs(app);

export default httpServer;
