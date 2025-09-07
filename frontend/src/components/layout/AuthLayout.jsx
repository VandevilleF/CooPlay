import Box from '@mui/material/Box';
import { layoutStyles } from '../../styles/theme';

export const AuthLayout = ({ children }) => {
	return (
		<Box sx={layoutStyles.authBackground}>{children}</Box>
	);
}
