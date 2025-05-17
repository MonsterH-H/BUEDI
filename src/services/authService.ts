import { User, RegisterData, LoginData, AuthResponse } from '@/types/auth';
import { mockApi } from './mockApi';

export const authService = {
  async login({ email, password, rememberMe }: LoginData): Promise<AuthResponse> {
    try {
      // Utiliser l'API mock au lieu de l'API réelle
      return await mockApi.login({ email, password, rememberMe });
    } catch (error) {
      throw new Error('Échec de la connexion');
    }
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Utiliser l'API mock au lieu de l'API réelle
      return await mockApi.register(userData);
    } catch (error) {
      throw new Error("Échec de l'inscription");
    }
  },

  async logout(): Promise<void> {
    try {
      // Utiliser l'API mock au lieu de l'API réelle
      await mockApi.logout();
      localStorage.clear();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // On clear quand même le localStorage
      localStorage.clear();
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      // Utiliser l'API mock au lieu de l'API réelle
      return await mockApi.getCurrentUser();
    } catch (error) {
      throw new Error('Impossible de récupérer les informations utilisateur');
    }
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      // Utiliser l'API mock au lieu de l'API réelle
      return await mockApi.updateProfile(data);
    } catch (error) {
      throw new Error('Échec de la mise à jour du profil');
    }
  },

  async refreshToken(): Promise<{ token: string; refreshToken: string }> {
    try {
      const response = await api.post('/auth/refresh-token');
      return response.data;
    } catch (error) {
      throw new Error('Échec du rafraîchissement du token');
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      throw new Error('Échec de la demande de réinitialisation');
    }
  },

  async resetPassword(token: string, password: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', { token, password });
    } catch (error) {
      throw new Error('Échec de la réinitialisation du mot de passe');
    }
  },

  async verifyEmail(token: string): Promise<void> {
    try {
      await api.post('/auth/verify-email', { token });
    } catch (error) {
      throw new Error("Échec de la vérification de l'email");
    }
  },
};