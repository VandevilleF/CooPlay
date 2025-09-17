import express from 'express';
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

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/favorites', favoritesGamesRoutes);
app.use('/events', eventsRoutes);
app.use('/chat', chatRoutes);
app.use('/games', gameRoutes);

const authService = new AuthService();
const userService = new UserService();
const favoritesGamesService = new FavoriteGameService();

swaggerDocs(app);

export default app;
