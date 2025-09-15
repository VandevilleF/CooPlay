import { EventList } from '../../components/event/EventList.jsx';
import { EventFilter } from '../../components/event/EventFilter.jsx';
import { MainLayout } from '../../components/layout/MainLayout.jsx';
import { CreateEvent } from '../../components/event/ModalEvent.jsx';

export const EventPage = () => {
	const [openModal, setOpenModal] = useState(false);

	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);

	return (
		<div className='event-page'>
			<MainLayout>
				<EventFilter onCreateEvent={handleOpenModal} />
				<EventList />
				<CreateEvent
				open={openModal}
				onClose={handleCloseModal}
				/>
			</MainLayout>
		</div>
	);
}
