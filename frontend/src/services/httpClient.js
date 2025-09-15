import axios from 'axios';
import { auth } from '../services/firebase/config';

const baseURL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'  // Développement local
  : 'http://backend:5000';   // Dans Docker

const httpClient = axios.create({ baseURL });

// Intercepteur pour ajouter automatiquement le token Firebase aux headers
httpClient.interceptors.request.use(async (config) => {
  // Évite d'ajouter le header sur /login car le token est dans le body
  if (config.url !== '/login' && auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Erreur récupération token:', error);
    }
  }
  return config;
});

// Intercepteur pour gérer les erreurs de réponse
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Token invalide, redirection vers login');
    }
    return Promise.reject(error);
  }
);

export default httpClient;
