import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';

import { useEvent } from '../../hooks/useEvent';
import { useChat } from '../../hooks/useChat';

import { useState } from 'react';

export const InputMessage = () => {
	const { eventId } = useEvent();
	const { sendMessage } = useChat(eventId);
	const [message, setMessage] = useState('');

	const handleMessage = (value) => {
		setMessage(value);
	}

	const handleSendMessage = () => {
		if (!message.trim()) return;
		sendMessage(message);
		setMessage('');
	};

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
		<Box sx={{ display: 'flex',
		backgroundColor: '#1a1a1a',
		p: 1, alignItems: 'center',
		gap: 1, position: 'fixed',
		bottom: 0, right: 0,
		left: { xs: 0, sm: 250 } }}
		>
			<TextField
			fullWidth
			value={message}
			onChange={(e) => handleMessage(e.target.value)}
			placeholder='Écrivez votre message...'
			size='small'
			sx={inputMessage}
			></TextField>
			<Button
			onClick={handleSendMessage}
			disabled={!message.trim()}
			>
				<SendIcon sx={{color: '#4f46e5'}} />
			</Button>
		</Box>
	);
}
