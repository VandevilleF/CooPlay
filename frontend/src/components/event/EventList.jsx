import '../../styles/components/eventComponent.css';

import { auth } from '../../services/firebase/config';

import { EventCard } from './EventCard.jsx';
import { useEffect, useState } from 'react';
import { formatEventDate } from '../../utils/dateFormatter.js';
import { eventService } from '../../services/eventService.js';
import { userService } from '../../services/userService';


export const EventList = ({ isUserEvent }) => {
  const [eventsList, setEventsList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // Écouter l'état d'authentification Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Récupérer l'utilisateur quand Firebase est prêt
  useEffect(() => {
    if (!authReady) return;

    const getCurrentUser = async () => {
      try {
        const user = await userService.getCurrentUser();
        setCurrentUserId(user.id);
      } catch (error) {
        console.error('Erreur récupération utilisateur:', error);
      }
    };
    getCurrentUser();
  }, [authReady]);

  // Charger les événements quand Firebase est prêt
  useEffect(() => {
    if (!authReady) return;
    loadEvents();
  }, [isUserEvent, authReady]);

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
