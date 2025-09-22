import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { ProfileAvatar } from '../avatar/ProfilAvatar';
import { useEvent } from '../../hooks/useEvent';
import { formatEventDate } from '../../utils/dateFormatter';
import { CircularProgress } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';


export const SideBarChat = () => {
	const { event, participants, loading: eventLoading } = useEvent();
	const { user, loading: authLoading } = useAuth();

	if (eventLoading || authLoading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
				<CircularProgress />
			</Box>
		)
	}

	return (
		<Box sx={{ overflow: 'auto'}}>
			<List sx={{ paddingTop: '10px'}}>
				<ListItem sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch'}}>
					<Box sx={{marginBottom: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)', flex: 1}}>
						<Typography sx={{fontSize: '18px'}}>{event.title}</Typography>
						<Typography sx={{color: '#4f46e5'}}>{event.game.name}</Typography>
						<Typography sx={{color: '#9ca3af'}}>{formatEventDate(event.start_at)}</Typography>
					</Box>
					<Box sx={{marginBottom: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)'}}>
						<Typography sx={{marginBottom: '1rem'}}>Participants ({participants.length}/{event.max_participants})</Typography>
						{participants.map((participant, index) => (
							<Box key={index} sx={{display: 'flex', gap: '1rem', paddingBottom: '1rem', alignItems: 'center'}}>
								<ProfileAvatar user={participant.user} size={30} />
								<Typography>{participant.user.username}</Typography>
							</Box>
						))}
					</Box>
					<Box sx={{display: 'flex', position: 'fixed', bottom: 0, left: 0}}>
						<Box sx={{display: 'flex', p: 1, gap: 1, alignItems: 'center'}}>
							<ProfileAvatar user={user} />
							<Typography>{user.username}</Typography>
						</Box>
					</Box>
				</ListItem>
			</List>
		</Box>
	);
}
