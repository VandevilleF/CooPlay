import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export const TrophyGrid = () => {
	const trophyPlaceholders = [
		{ title: 'Premier Événement', color: '#FF9500' },
		{ title: 'Team Player', color: '#34C759' },
		{ title: 'Social Butterfly', color: '#5856D6' },
		{ title: 'Légende', color: '#8E8E93' }
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
				Trophées et Succès
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

				{/* Grille des cards (semi-transparentes) */}
				<Box sx={{
					display: 'flex',
					gap: 2,
					flexWrap: 'wrap',
					justifyContent: 'space-between',
					position: 'relative',
					zIndex: 2,
					opacity: 0.4
				}}>
					{trophyPlaceholders.map((trophy, index) => (
						<Card
							key={index}
							sx={{
								minWidth: 180,
								minHeight: 100,
								backgroundColor: 'rgba(28, 28, 30, 0.8)',
								border: '1px solid #38383A',
								borderRadius: 1,
								flex: '1 1 calc(25% - 12px)',
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
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								textAlign: 'center',
								padding: 2
							}}>
								<Box sx={{
									width: 30,
									height: 30,
									borderRadius: '50%',
									backgroundColor: trophy.color,
									opacity: 0.5,
									marginBottom: 1,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
									<Typography sx={{ color: '#FFFFFF', fontSize: '1rem' }}>
										🏆
									</Typography>
								</Box>

								<Typography
									variant="caption"
									sx={{
										color: '#FFFFFF',
										fontWeight: 'medium',
										opacity: 0.8
									}}
								>
									{trophy.title}
								</Typography>
							</CardContent>
						</Card>
					))}
				</Box>
			</Box>
		</Box>
	);
}
