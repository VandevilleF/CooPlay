import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { UserAvatar } from '../avatar/Avatar';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebase/config';
import { signOut } from 'firebase/auth';
import { getTimeDifference } from '../../utils/getTimeDifference';

export const ProfileHeader = ({ user }) => {
	const navigate = useNavigate();

	const handleSignOut = async () => {
		try {
			signOut(auth);
			navigate('/');
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Box sx={{ display: 'flex', borderRadius: 1, p: 2, m: 2, backgroundColor: '#1a1a1a', border: 'solid 1px rgba(255, 255, 255, 0.12)' }}>
			<Box sx={{p: 2}}>
				{user ? (
					// Ne s'affiche QUE quand user est chargé
					user.avatar ? (
						<Avatar
						src={user.avatar}
						alt={user.name}
						sx={{ width: 100, height: 100 }}
						/>
					) : (
						<UserAvatar
						username={user.username}
						sx={{ width: 100, height: 100, fontSize: 30 }}
						/>
					)
				) : (
				// Pendant le chargement : rien, ou un skeleton
				<Box sx={{ width: 100, height: 100 }} />
				)}
			</Box>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1}}>
				<Box sx={{ display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center'}}>
					<Typography sx={{ fontSize: 30, fontWeight: 700 }}>{user.username}</Typography>
					<Typography sx={{ fontSize: 15, color: '#9ca3af' }}>
						Membre depuis {getTimeDifference(new Date(user.created_at))}
					</Typography>
					<Typography sx={{ fontSize: 15, color: '#9ca3af' }}>{user.describe}</Typography>
				</Box>
				<Box>
					<Button
					onClick={handleSignOut}
					sx={{border: '1px solid #6366f1'}}
					>
						Déconnexion
					</Button>
				</Box>
			</Box>
		</Box>
	);
}
