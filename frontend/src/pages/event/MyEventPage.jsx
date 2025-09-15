import { EventList } from '../../components/event/EventList.jsx';
import { EventFilter } from '../../components/event/EventFilter.jsx';
import { MainLayout } from '../../components/layout/MainLayout.jsx';

export const MyEventsPage = () => {
  return (
    <div className='event-page'>
      <MainLayout>
        <EventFilter />
        <EventList isUserEvent={true} />
      </MainLayout>
    </div>
  );
}
