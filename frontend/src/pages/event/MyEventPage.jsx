import { EventList } from '../../components/event/EventList.jsx';
import { EventFilter } from '../../components/event/EventFilter.jsx';
import { MainLayout } from '../../components/layout/MainLayout.jsx';
import { CreateEvent } from '../../components/event/ModalEvent.jsx';
import { useState } from 'react';

export const MyEventPage = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  return (
    <div className='event-page'>
      <MainLayout>
        {({ currentUserId, authReady }) => (
          <>
            <EventFilter onCreateEvent={handleOpenModal} />
            <EventList
            isUserEvent={true}
            currentUserId={currentUserId}
            authReady={authReady}
            />
            <CreateEvent
            open={openModal}
            onClose={handleCloseModal}
            />
          </>
        )}
      </MainLayout>
    </div>
  );
}
