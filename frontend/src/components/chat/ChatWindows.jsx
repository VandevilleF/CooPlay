import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { ProfileAvatar } from '../avatar/ProfilAvatar';
import { useEvent } from '../../hooks/useEvent';
import { chatService } from '../../services/chatService';
import { useSocket } from '../../hooks/useSocket';
import { useAuth } from '../../hooks/useAuth';

import { useState, useEffect } from 'react';

export const ChatWindow = () => {
	const { eventId } = useEvent();
	const { user, loading: authLoading } = useAuth();
	const socket = useSocket();

	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);


	useEffect(() => {
		if (!eventId || !user || authLoading) return;

		const loadMessages = async () => {
			try {
				setLoading(true);
				setError(null);

				// Charge les messages depuis la db
				const existingMessages = await chatService.getEventMessages(eventId);

				if (Array.isArray(existingMessages)) {
					setMessages(existingMessages);
				} else {
					console.error('Les messages ne sont pas un tableau:', existingMessages);
					setMessages([]);
				}
			} catch (error) {
				console.error('Erreur lors du chargement des messages:', error);
				setError('Impossible de charger les messages');
				setMessages([]);
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
			setMessages(prev => {
				return [...prev, newMessage];
			});
		});

		// Écoute les arrivée/départ des utilisateurs
		socket.on('user-joined', (data) => {
			console.log('Utilisateur rejoint:', data.message);
		});
		socket.on('user-left', (data) => {
			console.log('Utilisateur parti:', data.message);
		});

		// Écoute les erreurs
		socket.on('join-error', (error) => {
			console.error('Erreur join:', error);
			setError(error.error);
		});
		socket.on('message-error', (error) => {
			console.error('Erreur message:', error.error);
		});

		// Supprime les listeners et quitte la room
		return () => {
			socket.off('new-message');
			socket.off('user-joined');
			socket.off('user-left');
			socket.off('join-error');
			socket.off('message-error');
			socket.emit('leave-event', String(eventId));
		};

	}, [socket, eventId]);

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ p: 2 }}>
				<Alert severity="error">{error}</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{p: 2, paddingBottom: '4rem'}}>
			{!Array.isArray(messages) || messages.length === 0 ? (
				<Box sx={{ textAlign: 'center', color: '#9ca3af', mt: 4 }}>
					<Typography>Aucun message pour le moment</Typography>
				</Box>
			) : (
				messages.map((chat, index) => {
					return (
						<Box key={chat.id || index} sx={{display: 'flex', paddingBottom: '1rem'}}>
							<Box sx={{display: 'flex'}}>
								<ProfileAvatar user={chat.user} />
								<Box sx={{display: 'flex', flexDirection: 'column', paddingLeft: '1rem'}}>
									<Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
										<Typography>{chat.username}</Typography>
										<Typography sx={{ fontSize: '10px', color: '#9ca3af'}}>
											{new Date(chat.timestamp).toLocaleTimeString('fr-FR', {
												hour: '2-digit',
												minute: '2-digit'
											})}
										</Typography>
									</Box>
									<Box sx={{display: 'flex'}}>
										<Typography sx={{ fontSize: '14px'}}>{chat.message}</Typography>
									</Box>
								</Box>
							</Box>
						</Box>
					);
				})
			)}
		</Box>
	);
}
