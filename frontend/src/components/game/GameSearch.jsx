import { TextField, CircularProgress, Typography, Box, Paper } from '@mui/material';
import { useGameSearch } from '../../hooks/useGameSearch.js';

export const GameSearch = ({ onGameSelect }) => {
	const { query, setQuery, games, loading, error, clearResults } = useGameSearch();

	const handleSearch = (event) => {
		setQuery(event.target.value);
	};

	const handleGameClick = (game) => {
		// Remplit le champ avec le nom du jeu sélectionné
		setQuery(game.name);

		// Vide la liste des résultats
		if (clearResults) {
			clearResults();
		}

		// Callback vers le parent pour récupérer l'ID du jeu
		if (onGameSelect) {
			onGameSelect(game);
		}
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
		<Box sx={{ position: 'relative', flex: 1 }}>
			<Typography variant="subtitle2" sx={{ color: '#aaa', mb: 1 }}>
				Jeu
			</Typography>

			<Box sx={{ position: 'relative' }}>
				<TextField
					fullWidth
					placeholder="Counter-Strike 2"
					sx={inputStyle}
					value={query}
					onChange={handleSearch}
					disabled={loading}
				/>

				{loading && (
					<Box sx={{
						position: 'absolute',
						right: 12,
						top: '50%',
						transform: 'translateY(-50%)',
						zIndex: 1
					}}>
						<CircularProgress size={20} sx={{ color: '#666' }} />
					</Box>
				)}
			</Box>

			{error && (
				<Typography sx={{
					mt: 1,
					color: '#ef4444',
					fontSize: '0.875rem'
				}}>
					{error}
				</Typography>
			)}

			{/* Liste des résultats - Position absolue pour flotter par-dessus */}
			{games.length > 0 && (
				<Paper
					elevation={8}
					sx={{
						position: 'absolute',
						top: '100%',
						left: 0,
						right: 0,
						mt: 1,
						'--Paper-overlay': 'none', backgroundImage: 'none',
						backgroundColor: '#2a2a2a',
						border: '1px solid #404040',
						borderRadius: '8px',
						maxHeight: '200px',
						overflowY: 'auto',
						zIndex: 9999,
						'&::-webkit-scrollbar': {
							width: '6px',
						},
						'&::-webkit-scrollbar-track': {
							backgroundColor: '#1a1a1a',
						},
						'&::-webkit-scrollbar-thumb': {
							backgroundColor: '#404040',
							borderRadius: '3px',
						},
					}}
				>
					{games.map((game, index) => (
						<Box
							key={game.id}
							onClick={() => handleGameClick(game)}
							sx={{
								p: 1,
								cursor: 'pointer',
								display: 'flex',
								alignItems: 'center',
								gap: 1,
								borderBottom: index < games.length - 1 ? '1px solid #404040' : 'none',
								'&:hover': {
									backgroundColor: '#3a3a3a',
								},
								'&:last-child': {
									borderBottomLeftRadius: '8px',
									borderBottomRightRadius: '8px',
								},
								'&:first-of-type': {
									borderTopLeftRadius: '8px',
									borderTopRightRadius: '8px',
								},
							}}
						>
							{game.cover_url && (
								<Box
									component="img"
									src={game.cover_url}
									alt={game.name}
									sx={{
										width: 40,
										height: 40,
										borderRadius: '4px',
										objectFit: 'cover',
										flexShrink: 0,
									}}
								/>
							)}
							<Box sx={{ flexGrow: 1, minWidth: 0 }}>
								<Typography
									variant="body2"
									sx={{
										color: '#ffffff',
										fontWeight: 500,
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}}
								>
									{game.name}
								</Typography>
							</Box>
						</Box>
					))}
				</Paper>
			)}
		</Box>
	);
};
