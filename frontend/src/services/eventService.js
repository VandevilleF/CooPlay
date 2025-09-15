import httpClient from './httpClient';

export const eventService = {
	// Création d'événement
	create: async (eventData) => {
		const response = await httpClient.post('/events', eventData);
		return response.data;
	},

	// Charger les événements(tous ou mes événements)
	getAll: async (isUserEvent = false) => {
		const endpoint = isUserEvent ? '/my-events' : '/events';
		const response = await httpClient.get(endpoint);
		return response.data;
	},

	// Rejoindre un événement
	join: async (eventId) => {
		await httpClient.post(`/events/${eventId}/join`);
	},
}
