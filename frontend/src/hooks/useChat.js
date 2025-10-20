import { useState, useEffect } from "react";
import { chatService } from "../services/chatService";
import { useSocket } from './useSocket';
import { useAuth } from "./useAuth";

export const useChat = (eventId) => {
	const socket = useSocket();
	const { user, loading: authLoading } = useAuth();
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Charge les messages
	useEffect(() => {
		if (authLoading) return;
		if (!eventId || !user) {
			setLoading(false);
			return;
		};

		const loadMessages = async () => {
			try {
				setLoading(true);
				const msgs = await chatService.getEventMessages(eventId);
				setMessages(msgs || []);
			} catch (err) {
				console.error('Erreur chargement messages:', err);
				setError(err.messages);
			} finally {
				setLoading(false);
			}
		};

		loadMessages();
	}, [eventId, user, authLoading]);

	useEffect(() => {
		if (!eventId || !socket) return;

		// Rejoint la room de l'event
		socket.emit('join-event', String(eventId));

		// Écoute les nouveaux messages
		socket.on('new-message', (newMessage) => {
			console.log('Nouveau message reçu:', newMessage);
			setMessages(prev => {
				return [...prev, newMessage];
			});
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
	}, [socket, eventId])

	const sendMessage = (message) => {
		if (!socket || !message.trim()) return;

		socket.emit('send-message', {
			eventId: String(eventId),
			message: message.trim()
		});
	};

	return { messages, loading, error, sendMessage };
}
