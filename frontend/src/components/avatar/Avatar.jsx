import Avatar from '@mui/material/Avatar';
import { stringAvatar } from '../../utils/stringAvatar';

export const UserAvatar = ({ username, sx, ...otherProps }) => {
	// Génère les props de base : couleur de fond + initiales
	const avatarProps = stringAvatar(username);

	return (
		<Avatar
			{...avatarProps}  // Applique couleur + initiales
			{...otherProps}   // Applique les autres props (alt, onClick, etc.)
			sx={{
				// FUSION INTELLIGENTE DES STYLES :
				...avatarProps.sx, // 1. Styles de base (couleur de fond)
				...sx             // 2. Styles du parent (taille, etc.) - PRIORITÉ
			}}
		/>
	);
}
