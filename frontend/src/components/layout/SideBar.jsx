import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const drawerWidth = 250;

export const SideBar = ({ children, mobileOpen, onDrawerToggle }) => {
	const drawer = (
		<>
			<Toolbar sx={{ minHeight: '3rem !important', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
				<Typography
					variant='h5'
					component='div'
					sx={{ color: '#4f46e5', width: '100%', display: { xs: 'none', sm: 'block' } }}
				>
					CooPlay
				</Typography>
			</Toolbar>
			<Box sx={{ overflow: 'auto' }}>
				{children}
			</Box>
		</>
	);

	return (
		<Box
			component="nav"
			sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
		>
			{/* Drawer temporaire pour mobile */}
			<Drawer
				variant="temporary"
				open={mobileOpen}
				onClose={onDrawerToggle}
				sx={{
					display: { xs: 'block', sm: 'none' },
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
						backgroundColor: '#1a1a1a',
						'--Paper-overlay': 'none !important',
						'--Paper-shadow': 'none !important',
						backgroundImage: 'none !important',
						boxShadow: 'none !important'
					},
				}}
				ModalProps={{
					keepMounted: true, // Meilleure performance sur mobile
				}}
			>
				{drawer}
			</Drawer>

			{/* Drawer permanent pour desktop */}
			<Drawer
				variant="permanent"
				sx={{
					display: { xs: 'none', sm: 'block' },
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
						backgroundColor: '#1a1a1a'
					},
				}}
				open
			>
				{drawer}
			</Drawer>
		</Box>
	);
}
