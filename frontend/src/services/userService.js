import httpClient from './httpClient';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, verifyBeforeUpdateEmail, deleteUser } from 'firebase/auth';
import { auth } from './firebase/config';

export const userService = {
  getCurrentUser: async () => {
    const response = await httpClient.get('/users/profil');
    return response.data.user;
  },

  deleteUserFromDB: async () => {
    await httpClient.delete('/users/profil');
  },

  reauthenticate: async (currentPassword) => {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
  },

  updateUserEmailWithVerification: async (newEmail) => {
    const user = auth.currentUser;
    await verifyBeforeUpdateEmail(user, newEmail);
  },

  updateUserPassword: async (newPassword) => {
    await updatePassword(auth.currentUser, newPassword);
  },

  updateUserProfile: async (username, describe, email) => {
    const response = await httpClient.patch('/users/profil', { username, describe, email });
    return response.data.user;
  },

  deleteUserFromFirebase: async () => {
    const user = auth.currentUser;
    await deleteUser(user);
  },

  deleteUserCompletely: async (currentPassword) => {
    // 1. Réauthentification requise pour la suppression
    await userService.reauthenticate(currentPassword);
    // 2. Supprimer de la base de données d'abord
    await userService.deleteUserFromDB();
    // 3. Puis supprimer de Firebase Auth
    await userService.deleteUserFromFirebase();
  },
};
