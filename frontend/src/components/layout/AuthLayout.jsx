import Box from '@mui/material/Box';
import { authBackgroundStyles } from '../../styles/theme';

export const AuthLayout = ({ children }) => {
	return (
		<Box sx={authBackgroundStyles}>{children}</Box>
	);
}
