import { useState, useEffect, useRef } from 'react';
import { gameService } from '../services/gameService';

export const useGameSearch = (initialQuery = '') => {
	const [query, setQuery] = useState(initialQuery);
	const [games, setGames] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const isSelectingRef = useRef(false);

	const searchGames = async (searchTerm, options = {}) => {
		if (searchTerm.length < 2) {
			setGames([]);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const result = await gameService.searchGames(searchTerm, options);

			if (result.success) {
				setGames(result.data.games);
			}
		} catch (err) {
			setError(err.message);
			setGames([]);
		} finally {
			setLoading(false);
		}
	};

	// Debounce pour éviter trop d'appels API
	useEffect(() => {
		// Si on vient de sélectionner un jeu, on skip la recherche
		if (isSelectingRef.current) {
		isSelectingRef.current = false;
		return;
		}

		const timer = setTimeout(() => {
			if (query.length > 2) {
				searchGames(query);
			}
		}, 500);

		return () => clearTimeout(timer);
	}, [query]);

	const clearResults = () => {
		setGames([]);
		isSelectingRef.current = true;
	};

	return {
		query,
		setQuery,
		games,
		loading,
		error,
		searchGames,
		clearResults
	};
};
