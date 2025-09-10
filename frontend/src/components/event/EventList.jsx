import { EventCard } from './EventCard.jsx';
import '../../styles/components/eventComponent.css'

export const EventList = () => {
	const events = [
    {
      id: 1,
      gameTitle: "Counter-Strike 2",
      eventTitle: "Ranked 5v5 - Niveau Gold+",
      dateTime: "Aujourd'hui à 20h30 • Durée: 2h",
      description: "Recherche joueurs expérimentés pour du ranked sérieux",
      participants: "3",
      maxParticipants: "5",
    },
    {
      id: 2,
      gameTitle: "Valorant",
      eventTitle: "Session chill entre amis",
      dateTime: "Demain à 19h00 • Durée: 3h",
      description: "Parties détendues, tous niveaux bienvenus",
      participants: "2",
      maxParticipants: "5",
    },
    {
      id: 3,
      gameTitle: "Apex Legends",
      eventTitle: "Trio Ranked Push",
      dateTime: "Ce soir à 21h00 • Durée: 4h",
      description: "Push vers Diamond, micro obligatoire",
      participants: "1",
      maxParticipants: "3",
    },
    {
      id: 4,
      gameTitle: "World of Warcraft",
      eventTitle: "Donjon Mythique+",
      dateTime: "Samedi à 14h00 • Durée: 2h",
      description: "Besoin tank et heal pour M+ 15+",
      participants: "3",
      maxParticipants: "5",
    }
  ];
	return (
		<div className='event-list'>
				{events.map(event => (
					<EventCard
						key={event.id}
						gameTitle={event.gameTitle}
						eventTitle={event.eventTitle}
						dateTime={event.dateTime}
						description={event.description}
						participants={event.participants}
						maxParticipants={event.maxParticipants}
					/>
				))}
		</div>
	);
}
