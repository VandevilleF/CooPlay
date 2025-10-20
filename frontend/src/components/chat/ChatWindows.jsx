import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { ProfileAvatar } from '../avatar/ProfilAvatar';
import { useChat } from '../../hooks/useChat';
import { useEvent } from '../../hooks/useEvent';


export const ChatWindow = () => {
	const { eventId } = useEvent();
	const { messages, loading, error } = useChat(eventId);


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
			{messages.length === 0 ? (
				<Box sx={{ textAlign: 'center', color: '#9ca3af', mt: 4 }}>
					<Typography>Aucun message pour le moment</Typography>
				</Box>
			) : (
				messages.map((chat, index) => {
					return (
						<Box key={chat.id || index} sx={{display: 'flex', paddingBottom: '1rem'}}>
							<Box sx={{display: 'flex'}}>
								<ProfileAvatar user={{ id: chat.userId, username: chat.username }} />
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
