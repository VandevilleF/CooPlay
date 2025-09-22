import httpClient from './httpClient';

export const eventService = {
	// Création d'événement
	create: async (eventData) => {
		const response = await httpClient.post('/events', eventData);
		return response.data;
	},

	// Charger les événements(tous ou mes événements)
	getAll: async (isUserEvent) => {
		const endpoint = isUserEvent ? '/events/my-events' : '/events';
		const response = await httpClient.get(endpoint);
		return response.data;
	},

	// Rejoindre un événement
	join: async (eventId) => {
		await httpClient.post(`/events/${eventId}/join`);
	},

	// Récupérer un événement par ID
	getById: async (eventId) => {
		const response = await httpClient.get(`/events/${eventId}`);
		return response.data;
	},

	// Quitter un événement
	leave: async (eventId) => {
		const response = await httpClient.post(`/events/${eventId}/leave`);
		return response.data;
	},

	// Suprimer un événement
	delete: async (eventId) => {
		const response = await httpClient.delete(`/events/${eventId}`);
		return response.data;
	},

	// Mettre à jour un événement
	update: async (eventId, eventData) => {
		const reponse = await httpClient.put(`/events/${eventId}`, eventData);
		return reponse.data;
	},

	// Récuéperer liste des participant d'un événement
	getParticipants: async (eventId) => {
		const response = await httpClient.get(`/events/${eventId}/participants`);
		return response.data;
	}
}
