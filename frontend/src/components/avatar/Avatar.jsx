import Avatar from '@mui/material/Avatar';
import { stringAvatar } from '../../utils/stringAvatar';


export const UserAvatar = ({ username }) => {
	return (
		<Avatar {...stringAvatar(username)} />
	);
}
