import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { useAuth } from './useAuth';

export const useEvent = (eventId = null) => {
	const { eventId: paramEventId } = useParams();
	const finalEventId = eventId || paramEventId;
	const { user } = useAuth();

	const [event, setEvent] = useState(null);
	const [participants, setParticipants] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Fonction pour charger les données de l'événement
	const fetchEventData = async () => {
		if (!finalEventId) {
			setError("Aucun ID d'événement fourni");
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			// Récupération en parallèle de l'événement et des participants
			const [eventData, participantsData] = await Promise.all([
				eventService.getById(finalEventId),
				eventService.getParticipants(finalEventId)
			]);

			setEvent(eventData);
			setParticipants(participantsData);
		} catch (err) {
			setError(err.message || "Erreur lors du chargement de l'événement");
			console.error("Erreur lors du chargement de l'événement:", err);
		} finally {
			setLoading(false);
		}
	};

	// Fonction pour quitter l'événement (participant) ou annuler (créateur)
	const leaveOrCancelEvent = async (confirmDelete = false) => {
		try {
			const isCreator = event?.creator_id === user?.id;

			if (isCreator) {
				// Si c'est le créateur, demander confirmation avant suppression
				if (!confirmDelete) {
				return {
					success: false,
					needsConfirmation: true,
					message: 'Êtes-vous sûr de vouloir annuler cet événement ? Cette action est irréversible.'
				};
				}

				// Supprimer l'événement
				await eventService.delete(finalEventId);
				return { success: true, deleted: true, message: 'Événement annulé avec succès' };
			} else {
				// Si c'est un participant, quitter l'événement
				await eventService.leave(finalEventId);
				return { success: true, deleted: false, message: 'Vous avez quitté l\'événement' };
			}
		} catch (err) {
			console.error('Erreur lors de l\'action:', err);
			return { success: false, error: err.message || 'Erreur lors de l\'action' };
		}
	};

	// Fonction pour rejoindre l'événement
	const joinEvent = async () => {
		try {
			await eventService.join(finalEventId);
			// Recharger les participants après avoir rejoint
			await fetchEventData();
			return { success: true };
		} catch (err) {
			console.error('Erreur lors de l\'inscription à l\'événement:', err);
			return { success: false, error: err.message || 'Erreur lors de l\'inscription' };
		}
	};

	// Fonction pour rafraîchir les données
	const refetch = () => {
		fetchEventData();
	};

	// Chargement initial des données
	useEffect(() => {
		fetchEventData();
	}, [finalEventId]);

	// Calculs pour déterminer le rôle de l'utilisateur
	const isUserCreator = event && user && (event.creator_id === user.id);
	const isUserParticipant = participants.some(p => p.user_id === user?.id);
	const userRole = isUserCreator ? 'creator' : isUserParticipant ? 'participant' : 'viewer';

	return {
		// Données
		event,
		participants,
		eventId: finalEventId,

		// États
		loading,
		error,

		// Actions
		leaveOrCancelEvent, // Nouvelle fonction unifiée
		joinEvent,
		refetch,

		// Données calculées
		participantCount: participants.length,
		maxParticipants: event?.maxParticipants || event?.max_participants || 0,
		isEventFull: participants.length >= (event?.maxParticipants || event?.max_participants || 0),

		// Informations sur l'utilisateur
		isUserCreator,
		isUserParticipant,
		userRole,
		actionButtonText: isUserCreator ? "Annuler l'événement" : "Quitter l'événement",
		actionButtonColor: isUserCreator ? 'error' : 'warning',
	};
};
