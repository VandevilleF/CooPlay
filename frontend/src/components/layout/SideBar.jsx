import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

const drawerWidth = 250;

export const SideBar = ({ children }) => {
	return (
		<Drawer
		variant="permanent"
		sx={{
				width: drawerWidth,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: {
					width: drawerWidth,
					boxSizing: 'border-box',
					backgroundColor: '#1a1a1a'
				},
			}}
		>
			<Toolbar sx={{ minHeight: '3rem !important'}} />
			<Box sx={{ overflow: 'auto' }}>
				{children}
			</Box>
		</Drawer>
	);
}
