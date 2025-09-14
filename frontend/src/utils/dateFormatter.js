import { formatRelative, format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatEventDate = (dateString) => {
  const eventDate = new Date(dateString);
  const now = new Date();

  return formatRelative(eventDate, now, { locale: fr })
    .replace(/à/, 'à')
    .trim();
};
