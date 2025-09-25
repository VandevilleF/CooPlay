import { TopBar } from "./TopBar";
import { SideBar } from './SideBar';
import Box from "@mui/material/Box";
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { userService } from '../../services/userService';
import { auth } from '../../services/firebase/config';
import { CommunSideBar } from "./CommunSideBar";
import { ProfileAvatar } from "../avatar/ProfilAvatar";


export const MainLayout = ({ children }) => {
	const [user, setUser] = useState(null);
	const [currentUserId, setCurrentUserId] = useState(null);
	const [authReady, setAuthReady] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	// Écouter l'état d'authentification Firebase
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
			setAuthReady(true);
		});
		return () => unsubscribe();
	}, []);

	// Récupérer l'utilisateur quand Firebase est prêt
	useEffect(() => {
		if (!authReady) return;

		const fetchUser = async () => {
			try {
				const userData = await userService.getCurrentUser();
				setUser(userData);
				setCurrentUserId(userData.id);
			} catch (error) {
				console.error('Erreur lors de la récupération de l\'utilisateur:', error);
			}
		};

		fetchUser();
	}, [authReady]);


	return (
		<Box sx={{ display: 'flex'}}>
			{/* <CssBaseline /> */}
			<TopBar user={user} onDrawerToggle={handleDrawerToggle} >
				<ProfileAvatar user={user} />
			</TopBar>
			<SideBar
			mobileOpen={mobileOpen}
			onDrawerToggle={handleDrawerToggle}
			>
				<CommunSideBar />
			</SideBar>
			<Box
			component='main'
			sx={{
				flexGrow: 1
			}}
			>
				<Toolbar sx={{ minHeight: '3rem !important'}} />
				{ children({ user, currentUserId, authReady }) || (
					<Typography>
						Contenu de l'appli
					</Typography>
				)}
			</Box>
		</Box>
	);
}
