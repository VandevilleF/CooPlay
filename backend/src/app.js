import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './presentation/routes/auth.routes.js';
import { config } from './config/environment.js';
import { AuthService } from './business/services/auth.service.js';
import { UserService } from './business/services/user.service.js';
import { swaggerDocs } from './docs/swagger.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/', authRoutes);

const authService = new AuthService();
const userService = new UserService();

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', environment: config.env });
});

swaggerDocs(app);

export default app;
