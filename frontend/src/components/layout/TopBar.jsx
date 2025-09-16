import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { useLocation } from 'react-router-dom';
import { UserAvatar } from '../avatar/Avatar';

export const TopBar = ({ user }) => {
	const location = useLocation();

	const getTitle = () => {
		switch(location.pathname) {
			case '/events':
				return 'Événements disponibles';
			case '/events/my-events':
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
						{getTitle()}
					</Typography>
					{user ? (
						// Ne s'affiche QUE quand user est chargé
						user.avatar ? (
							<Avatar
							src={user.avatar}
							alt={user.name}
							sx={{ width: 35, height: 35 }}
							/>
						) : (
							<UserAvatar
							username={user.username}
							sx={{ width: 35, height: 35 }}
							/>
						)
						) : (
						// Pendant le chargement : rien, ou un skeleton
						<Box sx={{ width: 35, height: 35 }} />
						)}
				</Container>
			</Toolbar>
		</AppBar>
	)
}
