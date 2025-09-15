import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { useLocation } from 'react-router-dom';

export const TopBar = () => {
	const location = useLocation();

	const getTitle = () => {
		switch(location.pathname) {
			case '/events':
				return 'Événements disponibles';
			case '/my-events':
				return 'Mes Événements';
			default:
				return 'CooPlay';
			}
		};

	const userAvatar = 'JD'
	return (
		<AppBar
		position='fixed'
		sx={{ backgroundColor: '#1a1a1a', zIndex: (theme) => theme.zIndex.drawer + 1 }}
		>
			<Toolbar
			disableGutters
			sx={{
				minHeight: '3rem !important'
			}}>
				<Typography
				variant='h5'
				component='div'
				sx={{width: '250px', color: '#4f46e5', borderRight: '1px solid rgba(255, 255, 255, 0.12)', height: '3rem', alignContent: 'center', paddingLeft: 2}}
				>
					CooPlay
				</Typography>
				<Container
				maxWidth={false}
				sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1}}
				>
					<Typography variant='h5' component='div'>
						{getTitle}
					</Typography>
					<Avatar sx={{ backgroundColor: '#4f46e5', color: '#fafafa', width: 35, height: 35 }}>
						{userAvatar}
					</Avatar>
				</Container>
			</Toolbar>
		</AppBar>
	)
}
