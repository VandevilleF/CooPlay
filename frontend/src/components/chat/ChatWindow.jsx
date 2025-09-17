import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const ChatWindow = () => {
	const mockChat = [
		{user: 'Gneu', message: 'Gneugneu Salut'},
		{user: 'toto', message: 'toto Salut'},
		{user: 'titi', message: 'titi Salut'},
	]
	return (
		<Box>
			{mockChat.map(chat => (
				<Box>
					<Typography>{chat.user}</Typography>
					<Typography sx={{ fontSize: '10px'}}>{chat.message}</Typography>
				</Box>
			))}
		</Box>
	)
}
