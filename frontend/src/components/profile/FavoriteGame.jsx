import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export const FavoritesGame = () => {
	const gamePlaceholders = [
		{
			title: 'Counter-Strike 2',
			abbr: 'CS2',
			color: '#4A90E2'
		},
		{
			title: 'Valorant',
			abbr: 'VAL',
			color: '#FF4655'
		},
		{
			title: 'Apex Legends',
			abbr: 'APX',
			color: '#FF6600'
		}
	];

	return (
		<Box sx={{ padding: 2 }}>
			<Typography
				variant="h5"
				sx={{
					fontWeight: 'bold',
					color: '#FFFFFF'
				}}
			>
				Jeux favoris
			</Typography>

			{/* Container avec effet hachuré */}
			<Box sx={{
				position: 'relative',
				padding: 2,
				borderRadius: 1,
				backgroundColor: '#1C1C1E',
				border: '1px solid #38383A',
				overflow: 'hidden'
			}}>
				{/* Motif hachuré sur toute la zone */}
				<Box sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `repeating-linear-gradient(
						45deg,
						transparent,
						transparent 12px,
						rgba(142, 142, 147, 0.1) 12px,
						rgba(142, 142, 147, 0.1) 24px
					)`,
					zIndex: 1
				}} />

				{/* Message "Bientôt disponible" centré */}
				<Box sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					zIndex: 3,
					textAlign: 'center'
				}}>
					<Typography
						variant="h6"
						sx={{
							color: '#8E8E93',
							fontStyle: 'italic',
							fontWeight: 'medium',
							fontSize: 'xx-large'
						}}
					>
						Bientôt disponible
					</Typography>
				</Box>

				{/* Grille des cards de jeux (semi-transparentes) */}
				<Box sx={{
					display: 'flex',
					gap: 2,
					flexWrap: 'wrap',
					position: 'relative',
					zIndex: 2,
					opacity: 0.4
				}}>
					{gamePlaceholders.map((game, index) => (
						<Card
							key={index}
							sx={{
								minWidth: 280,
								minHeight: 80,
								backgroundColor: 'rgba(28, 28, 30, 0.8)',
								border: '1px solid #38383A',
								borderRadius: 1,
								flex: '1 1 calc(33.333% - 12px)',
								'@media (max-width: 900px)': {
									flex: '1 1 calc(50% - 12px)'
								},
								'@media (max-width: 600px)': {
									flex: '1 1 100%'
								}
							}}
						>
							<CardContent sx={{
								height: '100%',
								display: 'flex',
								alignItems: 'center',
								padding: 2,
								'&:last-child': { paddingBottom: 2 }
							}}>
								{/* Avatar du jeu */}
								<Box sx={{
									width: 50,
									height: 50,
									borderRadius: 1,
									backgroundColor: game.color,
									opacity: 0.5,
									marginRight: 2,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									flexShrink: 0
								}}>
									<Typography
										sx={{
											color: '#FFFFFF',
											fontSize: '0.9rem',
											fontWeight: 'bold'
										}}
									>
										{game.abbr}
									</Typography>
								</Box>

								{/* Informations du jeu */}
								<Box sx={{ flex: 1, minWidth: 0 }}>
									<Typography
										variant="body1"
										sx={{
											color: '#FFFFFF',
											fontWeight: 'medium',
											marginBottom: 0.5,
											opacity: 0.8,
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap'
										}}
									>
										{game.title}
									</Typography>
								</Box>
							</CardContent>
						</Card>
					))}
				</Box>
			</Box>
		</Box>
	);
}
