import { auth } from '../../infrastructure/firebaseAdmin.js';

export async function socketAuthMiddleware(socket, next) {
try {
	const token = socket.handshake.auth?.token;

	if (!token) {
	return next(new Error('No token provided'));
	}

	// Vérifier le token Firebase comme dans votre middleware HTTP
	const decoded = await auth.verifyIdToken(token);

	// Attacher les infos utilisateur au socket
	socket.user = decoded;
	socket.userId = decoded.uid;
	socket.username = socket.handshake.auth?.username;

	next();
} catch (error) {
	console.error('Socket auth error:', error);
	next(new Error('Invalid token'));
}
}
