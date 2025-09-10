import { EventList } from '../../components/event/EventList.jsx';
import { EventFilter } from '../../components/event/EventFilter.jsx';

export const EventPage = () => {
	return (
		<div className='event-page'>
			<EventFilter />
			<EventList />
		</div>
	);
}
