import { useState, useEffect } from "react";
import { chatService } from "../services/chatService";
import { useSocket } from './useSocket';
import { useAuth } from "./useAuth";
import { encryptionService } from '../services/encryptionService';

export const useChat = (eventId) => {
	const socket = useSocket();
	const { user, loading: authLoading } = useAuth();
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [keyLoaded, setKeyLoaded] = useState(false);

	// Charge la clé de chiffrement
	useEffect(() => {
		if (!eventId || authLoading || !user) return;

		const loadEncryptionKey = async () => {
			try {
				if (!encryptionService.hasKey(eventId)) {
					const keyBase64 = await chatService.getEncryptionKey(eventId);
					encryptionService.setEventKey(eventId, keyBase64);
				}
				setKeyLoaded(true);
			} catch (error) {
				console.error('Erreur chargement clé:', error);
				setError('Impossible de charger la clé de chiffrement');
			}
		};

		loadEncryptionKey();
	}, [eventId, authLoading, user]);

	// Charge les messages
	useEffect(() => {
		if (authLoading) return;
		if (!eventId || !user || !keyLoaded) {
			if (!authLoading && eventId && user && !keyLoaded) {
				// Attendre que la clé soit chargée
				return;
			}
			setLoading(false);
			return;
		};

		const loadMessages = async () => {
			try {
				setLoading(true);
				const encryptedMsgs = await chatService.getEventMessages(eventId);

				const decryptedMsgs = encryptedMsgs.map(msg => {
					//Parse la string JSON en objet
					const messageObj = typeof msg.message === 'string' ? JSON.parse(msg.message) : msg.message;

					const decrypted = encryptionService.decryptMessage(eventId, messageObj);

					return {
						...msg,
						message: decrypted || '[Impossible de déchiffrer bah oui]'
					};
				});
				setMessages(decryptedMsgs);
			} catch (err) {
				console.error('Erreur chargement messages:', err);
				setError(err.messages);
			} finally {
				setLoading(false);
			}
		};

		loadMessages();
	}, [eventId, user, authLoading, keyLoaded]);

	useEffect(() => {
		if (!eventId || !socket || !keyLoaded) return;

		// Rejoint la room de l'event
		socket.emit('join-event', String(eventId));

		// Écoute les nouveaux messages
		socket.on('new-message', (newMessage) => {
			// Parse si c'est une string
			const messageObj = typeof newMessage.message === 'string' ? JSON.parse(newMessage.message) : newMessage.message;

			// Déchiffre le message reçu
			const decrypted = encryptionService.decryptMessage(eventId, messageObj);
			setMessages(prev => [...prev, {
					...newMessage,
					message: decrypted || '[Impossible de déchiffrer]'
				}]);
		});

		// Écoute les erreurs
		socket.on('join-error', (error) => {
			console.error('Erreur join:', error);
			setError(error.error);
		});
		socket.on('message-error', (error) => {
			console.error('Erreur message:', error.error);
		});

		return () => {
			socket.off('join-event');
			socket.off('new-message');
			socket.off('join-error');
			socket.off('message-error');
		}
	}, [socket, eventId, keyLoaded])

	const sendMessage = (message) => {
		if (!socket || !message.trim()) return;

		try {
			const encryptedData = encryptionService.encryptMessage(eventId, message.trim());
			socket.emit('send-message', {
				eventId: String(eventId),
				message: encryptedData
			});
		} catch (error) {
			console.error(error);
		}
	};

	return { messages, loading, error, sendMessage };
}
