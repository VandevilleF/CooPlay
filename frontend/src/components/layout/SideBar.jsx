import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Toolbar from '@mui/material/Toolbar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EventIcon from '@mui/icons-material/Event';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 250;

export const SideBar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [selectedItem, setSelectedItem] = useState('Événements');

	const menuItems = [
		{text: 'Événements', icon: <EventIcon />, path: '/events'},
		{text: 'Mes événements', icon: <EventNoteIcon />, path: '/events/my-events'},
		{text: 'Favoris', icon: <FavoriteIcon />, path: '/favoris'},
		{text: 'Profil', icon: <AccountCircleIcon />, path: '/profil'},
		{text: 'Paramètres', icon: <SettingsIcon />, path: '/parametres'},
	]

	useEffect(() => {
		const currentItem = menuItems.find(item => item.path === location.pathname);
		if (currentItem) {
			setSelectedItem(currentItem.text);
		}
	}, [location.pathname]);

	const handleItemClick = (item) => {
		setSelectedItem(item.text);
		navigate(item.path);
	};

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

				<List sx={{ paddingTop: '10px'}}>
					{menuItems.map((item, index) => (
						<ListItem key={item.text} disablePadding>
							<ListItemButton selected={selectedItem === item.text}
							onClick={() => handleItemClick(item)}
							sx={{
									'&.Mui-selected': {
										backgroundColor: '#2d2d30',
										'&:hover': {
											backgroundColor: '#3d3d40',
										},
									},
									'&.Mui-selected .MuiListItemIcon-root': {
										color: '#4f46e5',
									},
									'&.Mui-selected .MuiListItemText-root': {
										color: '#4f46e5',
									},
								}}
							>
								<ListItemIcon sx={{color: '#9ca3af'}}>
									{item.icon}
								</ListItemIcon>
								<ListItemText
									sx={{color: '#9ca3af'}}
									primary={item.text}
								/>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Box>
		</Drawer>
	);
}
