import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';

const drawerWidth = 250;

export const TopBar = ({ children, user, onDrawerToggle }) => {
	const location = useLocation();

	const getTitle = () => {
		const path = location.pathname;

		switch (true) {
			case path === '/events':
			return 'Événements disponibles';
			case path === '/events/my-events':
			return 'Mes Événements';
			case path.match(/^\/events\/\d+$/) !== null:
			return "Chat de l'événement";
			default:
			return 'CooPlay';
		}
	};

	return (
		<AppBar
		position='fixed'
		sx={{ backgroundColor: '#1a1a1a',
			'--Paper-overlay': 'none',
			backgroundImage: 'none',
			zIndex: (theme) => theme.zIndex.drawer + 1,
			width: { sm: `calc(100% - ${drawerWidth}px)` },
			ml: { sm: `${drawerWidth}px` }
		}}
		>
			<Toolbar
			disableGutters
			sx={{
				minHeight: '3rem !important'
			}}>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					edge="start"
					onClick={onDrawerToggle}
					sx={{ mr: 2, ml: 1, display: { sm: 'none' } }}
				>
					<MenuIcon />
				</IconButton>
				<Container
				maxWidth={false}
				sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1}}
				>
					<Typography variant='h5' component='div'>
						{getTitle()}
					</Typography>
					{children}
				</Container>
			</Toolbar>
		</AppBar>
	)
}
