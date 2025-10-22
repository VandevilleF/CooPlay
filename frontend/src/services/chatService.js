import httpClient from './httpClient';

export const chatService = {
	// Récupère la clé d'encryptage
	getEncryptionKey: async (eventId) => {
		const response = await httpClient.get(`/chat/events/${eventId}/encryption_key`);
		return response.data.data.key;
	},

	// Récupère les messages d'un événement
	getEventMessages: async (eventId) => {
		try {
			const response = await httpClient.get(`/chat/events/${eventId}/messages`);

			if (response.data.success && response.data.data) {
				// Transforme les messages pour ajouter l'objet user
				return response.data.data.map(msg => ({
					...msg,
					user: {
						id: msg.userId,
						username: msg.username
					}
				}));
			} else {
				return [];
			}
		} catch (error) {
			console.error('Erreur dans getEventMessages:', error)
		}
	},

	// Envoi un message
	// sendMessage: async (eventId, message) => {
	// 	const response = await httpClient.post(`/chat/events/${eventId}/messages`, { message });
	// 	return response.data;
	// }
}
