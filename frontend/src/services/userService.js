import httpClient from './httpClient';

export const userService = {
  getCurrentUser: async () => {
    const response = await httpClient.get('/users/profil');
    return response.data.user;
  }
};
