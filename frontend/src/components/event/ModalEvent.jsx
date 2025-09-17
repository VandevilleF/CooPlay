import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { GameSearch } from '../game/GameSearch';
import { eventService } from '../../services/eventService';

export const CreateEvent = ({ open, onClose, onSubmit }) => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		start_at: '',
		max_participants: '',
		gameId: '',
	});

	const handleGameSelect = (selectedGame) => {
		setFormData(prev => ({
			...prev,
			gameId: selectedGame.id.toString() // Stocke l'ID du jeu sélectionné
		}));
	};

	const handleInputChange = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const combineDateTime = (date, time) => {
		return `${date}T${time}:00`;
	}

	const handleSubmit = async () => {
		setLoading(true);
		try {
			const eventData = {
				title: formData.title,
				description: formData.description,
				start_at: combineDateTime(formData.date, formData.time),
				max_participants: parseInt(formData.max_participants),
				gameId: parseInt(formData.gameId)
			};
			await eventService.create(eventData);
			onClose();

			// Reset du formulaire
			setFormData({
				title: '',
				description: '',
				start_at: '',
				max_participants: '',
				gameId: '',
				microRequired: false
			});
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const getCurrentDate = () => {
		const today = new Date();
		return today.toISOString().split('T')[0];
	};

	const getCurrentTime = () => {
		const now = new Date();
		return now.toTimeString().slice(0, 5);
	};

	const modalStyle = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 500,
		bgcolor: '#1a1a1a',
		border: '1px solid #333',
		borderRadius: 1,
		boxShadow: 24,
		p: 2,
		color: 'white'
	};

	const inputStyle = {
		'& .MuiOutlinedInput-root': {
			backgroundColor: '#2a2a2a',
			color: 'white',
			'& fieldset': { borderColor: '#404040' },
			'&:hover fieldset': { borderColor: '#555' },
			'&.Mui-focused fieldset': { borderColor: '#666' }
		},
		'& .MuiInputBase-input::placeholder': {
			color: '#888',
			opacity: 1
		}
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Box sx={modalStyle}>
				{/* Header */}
				<Box sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 3
				}}>
					<Typography variant="h5" sx={{ color: 'white', fontWeight: 500 }}>
						Créer un événement
					</Typography>
					<Button onClick={onClose}
					sx={{ color: '#aaa', fontWeight: 500, borderRadius: '10px' }}
					>
						X
					</Button>
				</Box>

				{/* Titre */}
				<Box sx={{ mb: 3 }}>
					<Typography variant="subtitle2" sx={{ color: '#aaa', mb: 1 }}>
						Titre de l'événement
					</Typography>
					<TextField
						fullWidth
						value={formData.title}
						onChange={(e) => handleInputChange('title', e.target.value)}
						placeholder="Donnez un titre à votre événement"
						sx={inputStyle}
					/>
				</Box>

				{/* Jeu et participants */}
				<Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
					<GameSearch onGameSelect={handleGameSelect} />
					<Box sx={{ flex: 1 }}>
						<Typography variant="subtitle2" sx={{ color: '#aaa', mb: 1 }}>
							Participants max
						</Typography>
						<TextField
							fullWidth
							type="number"
							value={formData.max_participants}
							onChange={(e) => handleInputChange('max_participants', e.target.value)}
							placeholder="5"
							sx={inputStyle}
						/>
					</Box>
				</Box>

				{/* Date et Heure */}
				<Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
					<Box sx={{ flex: 1 }}>
						<Typography variant="subtitle2" sx={{ color: '#aaa', mb: 1 }}>
							Date
						</Typography>
						<TextField
							fullWidth
							type="date"
							value={formData.date}
							onChange={(e) => handleInputChange('date', e.target.value)}
							defaultValue={getCurrentDate()}
							sx={inputStyle}
						/>
					</Box>

					<Box sx={{ flex: 1 }}>
						<Typography variant="subtitle2" sx={{ color: '#aaa', mb: 1 }}>
							Heure
						</Typography>
						<TextField
							fullWidth
							type="time"
							value={formData.time}
							onChange={(e) => handleInputChange('time', e.target.value)}
							defaultValue={getCurrentTime()}
							sx={inputStyle}
						/>
					</Box>
				</Box>

				{/* Description */}
				<Box sx={{ mb: 3 }}>
					<Typography variant="subtitle2" sx={{ color: '#aaa', mb: 1 }}>
						Description
					</Typography>
					<TextField
						fullWidth
						multiline
						rows={3}
						value={formData.description}
						onChange={(e) => handleInputChange('description', e.target.value)}
						placeholder="Décrivez votre événement, le niveau requis, vos attentes..."
						sx={inputStyle}
					/>
				</Box>

				{/* Boutons */}
				<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
					<Button
						onClick={onClose}
						sx={{
							color: '#aaa', backgroundColor: '#2a2a2a', borderRadius: '10px'
						}}
					>
						Annuler
					</Button>
					<Button
						variant="contained"
						onClick={handleSubmit}
						disabled={loading}
						sx={{
							backgroundColor: '#4f46e5',
							borderRadius: '10px',
							'&:hover': { backgroundColor: '#3f36d5' }
						}}
					>
						{loading ? 'Création...' : "Créer l'événement"}
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};
