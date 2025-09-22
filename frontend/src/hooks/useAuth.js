import { useState, useEffect } from 'react';
import { auth } from '../services/firebase/config';
import { userService } from '../services/userService';


export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // Écouter l'état d'authentification Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setAuthReady(true);

      if (firebaseUser) {
        // Attendre que le token soit disponible avant de faire l'appel API
        try {
          await firebaseUser.getIdToken(); // S'assurer que le token est prêt
          const userData = await userService.getCurrentUser();

          setUser(userData);
          setCurrentUserId(userData.id);
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'utilisateur:', error);
          setUser(null);
          setCurrentUserId(null);
        }
      } else {
        setUser(null);
        setCurrentUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return {
    user,
    currentUserId,
    authReady,
    loading: !authReady || (authReady && !user && auth.currentUser), // Loading si Firebase user existe mais pas encore récupéré
    isAuthenticated: !!user
  };
};
