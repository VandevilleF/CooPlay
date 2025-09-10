import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EventIcon from '@mui/icons-material/Event';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useState } from 'react';


export const Sidebar = () => {
	const [selectedItem, setSelectedItem] = useState('Événements');

	const menuItems = [
		{text: 'Événements', icon: <EventIcon />},
		{text: 'Mes événements', icon: <EventNoteIcon />},
		{text: 'Favoris', icon: <FavoriteIcon />},
		{text: 'Profil', icon: <AccountCircleIcon />},
		{text: 'Paramètres', icon: <SettingsIcon />},
	]
	const handleItemClick = (itemText) => {
		setSelectedItem(itemText);
		// navigate(`/${itemText.toLowerCase()}`);
	};

	const drawerContent = (
		<Box sx={{ width: 250, paddingTop: '2rem' }}>
			<List>
				{menuItems.map((item, index) => (
					<ListItem key={item.text} disablePadding>
						<ListItemButton
						selected={selectedItem === item.text}
						onClick={() => handleItemClick(item.text)}
						>
							<ListItemIcon sx={{color: '#9ca3af'}}>{item.icon}</ListItemIcon>
							<ListItemText sx={{color: '#9ca3af'}} primary={item.text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
			<Divider />
		</Box>
	);

	return (
		<div>
			<Drawer
			variant="permanent"
			sx={{['& .MuiDrawer-paper']: { backgroundColor: '#1a1a1a'}}}
			>
				{drawerContent}
			</Drawer>
		</div>
	);
}
