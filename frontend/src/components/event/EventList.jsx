import { EventCard } from './EventCard.jsx';
import '../../styles/components/eventComponent.css';
import { useEffect, useState } from 'react';
import { formatEventDate } from '../../utils/dateFormatter.js';

export const EventList = () => {
  const [eventsList, setEventsList] = useState([]);
  const [isUserEvent, setIsUserEvent] = useState(false);

  const loadEvents = async () => {
    try {
      const events = await eventService.getAll(isUserEvent);
      setEventsList(events);
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoin = async (eventId) => {
    try {
      await eventService.join(eventId);
      loadEvents();
    } catch (error) {
      console.error('Erreur lors de la participation:', error);
    }
  };

  const handleView = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  useEffect(() => {
    loadEvents();
  }, [isUserEvent]);

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
                        isUserEvent={isUserEvent}
                        isParticipating={event.participants.some(p => p.user_id === currentUserId)}
                        onJoin={() => handleJoin(event.id)}
                        onView={() => handleView(event.id)}
                    />
                ))}
        </div>
    );
}
