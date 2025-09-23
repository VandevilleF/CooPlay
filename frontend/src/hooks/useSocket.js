import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';
import { auth } from '../services/firebase/config';

export const useSocket = () => {
	const [socket, setSocket] = useState(null);
	const { user, isAuthenticated } = useAuth();

	useEffect(() => {
		if (!isAuthenticated || !user) return;

		const connectSocket = async () => {
			try {
				const token = await auth.currentUser?.getIdToken();

				// Créer une nouvelle connexion socket vers le backend
				const newSocket = io('http://localhost:5000', {
					auth: {
						token,					 // Token firebase pour authentification
						userId: user.id,		 // Id Utilisateur pour identification
						username: user.username  // Nom d'utilisateur pour affichage
					}
				});

				// Si connexion réussi
				newSocket.on('connect', () => {
					console.log('Socket connecté', newSocket.id);
				});

				// Si connexion fermée
				newSocket.on('disconnect', () => {
					console.log('Socket déconnecté');
				});

				// Cas d'erreur
				newSocket.on('connect_error', (error) => {
					console.error('Erreur de connexion socket:', error);
				});

				// Stock la connexion socket
				setSocket(newSocket);
			} catch (error) {
				console.error('Erreur lors de la connexion socket:', error);
			}
		};
		// Lance la connexion
		connectSocket();

		// Nettoyage si composant démonté ou dépendances user changent
		return () => {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [isAuthenticated, user]);

	// Retourne l'instance du socket pour utilisation dans les composants
	return socket;
}
