import { Server } from 'socket.io';

export class SocketManager {
	constructor(httpServer) {
		this.io = new Server(httpServer, {
			cors: {
				origin: [
					process.env.FRONTEND_URL || "http://localhost:5173",
					process.env.FRONTEND_DOCKER_URL || "http://frontend:5173"
				],
				methods: ["GET", "POST"],
				credentials: true
			}
		});
	}

	setup(authMiddleware, chatHandler) {
		// Middleware d'authentification pour tous les sockets
		this.io.use(authMiddleware);

		this.io.on('connection', (socket) => {
			console.log(`User connected: ${socket.username}`);

			// Délégue la gestion des événements au handler
			chatHandler(socket, this.io);
		});
	}
	getInstance() {
		return this.io;
	}
}
