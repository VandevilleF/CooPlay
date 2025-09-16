import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useState } from 'react';

export const EventFilter = ({ onCreateEvent }) => {
	const [game, setGame] = useState('');
	const [date, setDate] = useState('');

	const handleGame = (event) => {
		setGame(event.target.value);
	};
	const handleDate = (event) => {
		setDate(event.target.value);
	};

	return (
		<Box className='event-filter'>
			<FormControl sx={{ minWidth: 140 }}>
				<Select
				value={game}
				onChange={handleGame}
				size="small"
				displayEmpty
				renderValue={(selected) => selected || "Tous les jeux"}
				>
					<MenuItem value=''>Tous les jeux</MenuItem>
					<MenuItem value='Ark'>Ark</MenuItem>
					<MenuItem value='GTA'>GTA</MenuItem>
					<MenuItem value='Payday'>PayDay</MenuItem>
				</Select>
			</FormControl>
			<FormControl sx={{ minWidth: 140 }}>
				<Select
				value={date}
				onChange={handleDate}
				size="small"
				displayEmpty
				renderValue={(selected) => selected || "Aujourd'hui"}
				>
					<MenuItem value=''>Aujourd'hui</MenuItem>
					<MenuItem value='tomorrow'>Demain</MenuItem>
				</Select>
			</FormControl>
				<Button
				className='create-event'
				onClick={onCreateEvent}
				>
					+ Créer un événement
				</Button>
		</Box>
	);
}
