import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export const RecentActivity = () => {
	const activityPlaceholders = [
		{
			type: 'ranked',
			description: 'A participé à "Ranked 5v5 - Niveau Gold+"',
			game: 'Counter-Strike 2',
			time: 'il y a 2 heures',
			iconBg: '#34C759',
			icon: '✓'
		},
		{
			type: 'event',
			description: 'A créé l\'événement "Session chill Valorant"',
			game: 'Valorant',
			time: 'il y a 1 jour',
			iconBg: '#5856D6',
			icon: '+'
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
				Activité récente
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

				{/* Liste des activités (semi-transparente) */}
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
					position: 'relative',
					zIndex: 2,
					opacity: 0.4
				}}>
					{activityPlaceholders.map((activity, index) => (
						<Card
							key={index}
							sx={{
								width: '100%',
								backgroundColor: 'rgba(28, 28, 30, 0.8)',
								border: '1px solid #38383A',
								borderRadius: 1
							}}
						>
							<CardContent sx={{
								display: 'flex',
								alignItems: 'center',
								padding: 2,
								'&:last-child': { paddingBottom: 2 }
							}}>
								{/* Icône de l'activité */}
								<Box sx={{
									width: 40,
									height: 40,
									borderRadius: '50%',
									backgroundColor: activity.iconBg,
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
											fontSize: '1.2rem',
											fontWeight: 'bold'
										}}
									>
										{activity.icon}
									</Typography>
								</Box>

								{/* Contenu de l'activité */}
								<Box sx={{ flex: 1, minWidth: 0 }}>
									<Typography
										variant="body1"
										sx={{
											color: '#FFFFFF',
											fontWeight: 'medium',
											marginBottom: 0.5,
											opacity: 0.8
										}}
									>
										{activity.description}
									</Typography>

									<Box sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 1,
										flexWrap: 'wrap'
									}}>
										<Typography
											variant="caption"
											sx={{
												color: '#8E8E93',
												opacity: 0.8
											}}
										>
											{activity.game}
										</Typography>
										<Typography
											variant="caption"
											sx={{
												color: '#8E8E93',
												opacity: 0.6
											}}
										>
											•
										</Typography>
										<Typography
											variant="caption"
											sx={{
												color: '#8E8E93',
												opacity: 0.8
											}}
										>
											{activity.time}
										</Typography>
									</Box>
								</Box>
							</CardContent>
						</Card>
					))}
				</Box>
			</Box>
		</Box>
	);
}
