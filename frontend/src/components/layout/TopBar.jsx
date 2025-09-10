import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';

export const TopBar = () => {
	const title = 'Événements disponibles';
	const userAvatar = 'JD'
	return (
		<AppBar position='fixed' sx={{height: '4rem', backgroundColor: '#1a1a1a'}}>
			<Typography variant='h4' component='div' sx={{width: '250px', color: '#4f46e5'}}>CooPlay</Typography>
			<Divider orientation="vertical" />
			<Container maxWidth={false}>
				<Typography variant='h4' component='div'>{title}</Typography>
				<Avatar sx={{ backgroundColor: '#4f46e5', color: '#fafafa' }}>{userAvatar}</Avatar>
			</Container>
		</AppBar>
	)
}
