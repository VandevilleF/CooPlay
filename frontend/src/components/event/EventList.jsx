import { EventCard } from './EventCard.jsx';
import '../../styles/components/eventComponent.css'
import httpClient from '../../utils/httpClient.js';
import { useEffect, useState } from 'react';
import { formatEventDate } from '../../utils/dateFormatter.js';

export const EventList = () => {
  const [eventsList, setEventsList] = useState([]);

  const loadEvents = async () => {
    try {
      const response = await httpClient.get('/events');
      const events = response.data;
      setEventsList(events);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

	return (
		<div className='event-list'>
				{eventsList.map(event => (
					<EventCard
						key={event.id}
						gameTitle={event.game.name}
						eventTitle={event.title}
						dateTime={formatEventDate(event.start_at)}
						description={event.description}
						participants={event.participants.length}
						maxParticipants={event.max_participants}
					/>
				))}
		</div>
	);
}
