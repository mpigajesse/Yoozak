"use client";

import { apiService } from "./api";

// Interface pour la réponse d'authentification
interface AuthResponse {
  access: string;
  refresh: string;
  user?: any;
  user_roles?: string[];
}

// Fonction pour obtenir les informations de l'utilisateur courant
export const getUserInfo = async () => {
  try {
    // Utiliser l'API pour récupérer les informations de l'utilisateur
    console.log("Récupération des informations de l'utilisateur courant");
    const response = await apiService.auth.getCurrentUser();
    console.log("Informations utilisateur reçues:", response);
    return response;
  } catch (error) {
    console.error("Erreur lors de la récupération des informations utilisateur:", error);
    throw error;
  }
};

// Fonction pour connecter un utilisateur
export const loginUser = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    // Route standard pour Simple JWT dans Django
    console.log("Appel à l'API d'authentification avec:", { username });
    const response = await apiService.post('/token/', { username, password });
    console.log("Réponse de l'API d'authentification:", response);
    return response.data;
  } catch (error) {
    console.error("Erreur de connexion:", error);
    throw error;
  }
};

// Fonction pour déconnecter un utilisateur
export const logoutUser = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return true;
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    throw error;
  }
};

// Fonction pour mettre à jour le profil de l'utilisateur
export const updateUserProfile = async (userData: any) => {
  try {
    // Utiliser le service API pour mettre à jour le profil
    const response = await apiService.auth.updateProfile(userData);
    return response;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    throw error;
  }
};

// Fonction pour rafraîchir le token
export const refreshToken = async (token: string): Promise<AuthResponse> => {
  try {
    // Route standard pour le rafraîchissement du token Simple JWT
    const response = await apiService.post('/token/refresh/', { refresh: token });
    return response.data;
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error);
    throw error;
  }
};

// Fonction pour vérifier la validité du token
export const verifyToken = async (token: string) => {
  try {
    // Route standard pour la vérification du token Simple JWT
    const response = await apiService.post('/token/verify/', { token });
    return response;
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    throw error;
  }
}; 