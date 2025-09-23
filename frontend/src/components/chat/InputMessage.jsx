import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';

import { useSocket } from '../../hooks/useSocket';
import { useEvent } from '../../hooks/useEvent';
import { useAuth } from '../../hooks/useAuth';

import { useState } from 'react';

export const InputMessage = () => {
	const [message, setMessage] = useState('');
	const [sending, setSending] = useState(false);

	const socket = useSocket();
	const { eventId } = useEvent();
	const { user } = useAuth();

	const handleMessage = (value) => {
		setMessage(value);
	}

	const handleSendMessage = () => {
		if (!message.trim()) return;
		if(!socket) {
			console.error('Socket non connecté');
			return;
		}

		setSending(true);

		const messageData = {
			eventId: eventId,
			message: message.trim(),
			userId: user.id,
			timestamp: new Date().toISOString()
		};

		// Envoi du message via socket
		socket.emit('send-message', messageData);

		setMessage('');
		setSending(false);
	}

	const inputMessage = {
		'& .MuiOutlinedInput-root': {
			backgroundColor: '#2a2a2a',
			color: 'white',
			'& fieldset': { borderColor: '#404040' },
			'&:hover fieldset': { borderColor: '#555' },
			'&.Mui-focused fieldset': { borderColor: '#666' }
		},
		'& .MuiInputBase-input::placeholder': {
			color: '#888',
			opacity: 1
		}
	};

	return (
		<Box sx={{ display: 'flex', backgroundColor: '#1a1a1a', p: 1, alignItems: 'center', gap: 1, position: 'fixed', bottom: 0, right: 0, left: 250 }}>
			<TextField
			fullWidth
			value={message}
			onChange={(e) => handleMessage(e.target.value)}
			placeholder='Écrivez votre message...'
			size='small'
			sx={inputMessage}
			disabled={sending || !socket}
			></TextField>
			<Button
			onClick={handleSendMessage}
			disabled={!message.trim() || sending || !socket}
			>
				<SendIcon sx={{color: '#4f46e5'}} />
			</Button>
		</Box>
	);
}
