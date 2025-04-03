"use client";

import axios, { AxiosError } from "axios";

// URL de base pour l'API
const API_BASE_URL = "http://localhost:8000";

// Création d'une instance axios pour les appels API
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajout d'un intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fonctions d'authentification
export const loginUser = async (username: string, password: string) => {
  try {
    console.log(`Tentative de connexion avec ${username} à ${API_BASE_URL}/api/users/auth/login/`);
    const response = await axios.post(`${API_BASE_URL}/api/users/auth/login/`, {
      username,
      password
    });
    
    console.log("Réponse d'authentification:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Erreur de connexion:", error);
    if (error instanceof AxiosError && error.response) {
      console.error("Détails de l'erreur:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    }
    throw error;
  }
};

export const refreshToken = async (refresh: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/users/auth/refresh/`, {
      refresh
    });
    return response.data;
  } catch (error) {
    console.error("Erreur de rafraîchissement du token:", error);
    throw error;
  }
};

export const verifyToken = async (token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/token/verify/`, {
      token
    });
    return response.data;
  } catch (error) {
    console.error("Erreur de vérification du token:", error);
    throw error;
  }
};

// Fonctions utilisateur
export const getUserInfo = async () => {
  try {
    console.log("Récupération des informations utilisateur...");
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Aucun token d'authentification");
    }

    // Configuration des headers pour toutes les requêtes
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Utiliser l'endpoint de profil admin que nous avons créé
    console.log("Tentative avec /api/users/profile/");
    const response = await axios.get(`${API_BASE_URL}/api/users/profile/`, { headers });
    console.log("Informations utilisateur récupérées:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erreur de récupération des informations utilisateur:", error);
    throw error;
  }
};

export const updateUserProfile = async (userData: Record<string, any>) => {
  try {
    const response = await api.patch("/api/users/profile/update/", userData);
    return response.data;
  } catch (error) {
    console.error("Erreur de mise à jour du profil:", error);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  return { success: true };
};

// Méthodes génériques pour les requêtes HTTP
export const post = async (url: string, data: any) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la requête POST à ${url}:`, error);
    throw error;
  }
};

export const patch = async (url: string, data: any) => {
  try {
    const response = await api.patch(url, data);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la requête PATCH à ${url}:`, error);
    throw error;
  }
};

export const get = async (url: string, params?: any) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la requête GET à ${url}:`, error);
    throw error;
  }
};

export const remove = async (url: string) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la requête DELETE à ${url}:`, error);
    throw error;
  }
};

// Export des fonctions API principales
const apiService = {
  login: loginUser,
  logout: logoutUser,
  refreshToken,
  verifyToken,
  getUserInfo,
  updateUserProfile,
  post,
  patch,
  get,
  remove,
  
  // Produits
  getProducts: () => api.get("/api/products/"),
  getProduct: (id: number) => api.get(`/api/products/${id}/`),
  
  // Clients
  getClients: () => api.get("/api/clients/clients/"),
  getClient: (id: number) => api.get(`/api/clients/clients/${id}/`),
  
  // Commandes
  getCommandes: () => api.get("/api/commandes/commandes/"),
  getCommande: (id: number) => api.get(`/api/commandes/commandes/${id}/`),
  
  // Statistiques
  getStats: () => api.get("/api/clients/clients/stats/"),
};

export default apiService;