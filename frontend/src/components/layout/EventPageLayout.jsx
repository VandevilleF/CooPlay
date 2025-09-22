import { TopBar } from '../../components/layout/TopBar.jsx';
import { SideBar } from './SideBar.jsx';
import { SideBarChat } from '../chat/SideBarChat.jsx';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { EventActions } from '../event/EventActions.jsx';

export const EventPageLayout = ({ children }) => {
	return (
		<Box sx={{ display: 'flex'}}>
			<CssBaseline />
			<TopBar>
				<EventActions />
			</TopBar>
			<SideBar>
				<SideBarChat />
			</SideBar>
			<Box
			component='main'
			sx={{
				flexGrow: 1
			}}
			>
				<Toolbar sx={{ minHeight: '3rem !important'}} />
				{children || (
					<Typography>
						Contenu de l'appli
					</Typography>
				)}
			</Box>
		</Box>
	);
}
