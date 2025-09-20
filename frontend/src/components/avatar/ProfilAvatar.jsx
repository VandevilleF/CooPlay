import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { UserAvatar } from '../avatar/Avatar';

export const ProfileAvatar = ({ user, size = 35 }) => {
	return (
		<>
			{user ? (
				// Ne s'affiche QUE quand user est chargé
				user.avatar ? (
					<Avatar
					src={user.avatar}
					alt={user.name}
					sx={{ width: size, height: size }}
					/>
				) : (
					<UserAvatar
					username={user.username}
					sx={{ width: size, height: size }}
					/>
				)
				) : (
				// Pendant le chargement : rien, ou un skeleton
				<Box sx={{ width: size, height: size }} />
				)}
		</>
	)
};
