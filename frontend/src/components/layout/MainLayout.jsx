import { TopBar } from "./TopBar";
import { SideBar } from './SideBar';
import Box from "@mui/material/Box";
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from "@mui/material/Typography";


export const MainLayout = ({ children }) => {
	return (
		<Box sx={{ display: 'flex'}}>
			<CssBaseline />
			<TopBar />
			<SideBar />
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
