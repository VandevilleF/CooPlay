import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import '../../styles/components/eventComponent.css'
import { useState } from 'react';

export const EventCard = ({ gameTitle,
	eventTitle,
	dateTime,
	description,
	participants,
	maxParticipants,
	isUserEvent = false,
	isParticipating = false,
	onJoin,
	onView
}) => {
	const [open, setOpen] = useState(false);

	const handleTooltipOpen = () => {
		setOpen(true);
	}
	const handleTooltipClose = () => {
		setOpen(false);
	}

	return (
		<Card variant="outlined" className='event-card'>
			<CardContent>
				<Typography className='game-title'>{gameTitle}</Typography>
				<Typography className='event-title'>{eventTitle}</Typography>
				<Typography className='event-detail'>{dateTime}</Typography>
				<Tooltip
				title={description}
				onClick={handleTooltipOpen}
				onClose={handleTooltipClose}
				open={open}
				>
					<Typography className='event-detail'>{description}</Typography>
				</Tooltip>
			</CardContent>
			<CardActions>
				<Typography className='participants-count'>{participants}/{maxParticipants} participants</Typography>
				{!isParticipating && !isUserEvent ? (
					<Button className='join-button' variant="outlined" onClick={onJoin}>
						Rejoindre
					</Button>
				) : (
				<Button className='view-button' variant="outlined" onClick={onView}>
					Afficher
				</Button>
				)}
			</CardActions>
		</Card>
	)
}
