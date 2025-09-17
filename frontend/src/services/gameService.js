import httpClient from './httpClient';

export const gameService = {
	searchGames: async (query, options = {}) => {
		const { limit = 10 } = options;

		try {
			const response = await httpClient.get('/games/search', {
				params: { q: query, limit }
			});

			return response.data;
		} catch (error) {
			throw new Error(error.response?.data?.error || 'Erreur lors de la recherche');
		}
	}
};
