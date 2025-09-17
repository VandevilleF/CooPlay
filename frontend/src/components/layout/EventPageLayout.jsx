import { TopBar } from '../../components/layout/TopBar.jsx';
import { SideBarEvent } from '../event/SideBarEvent.jsx';

export const EventPageLayout = ({ children }) => {
	return (
		<Box sx={{ display: 'flex'}}>
			<CssBaseline />
			<TopBar />
			<SideBarEvent />
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
