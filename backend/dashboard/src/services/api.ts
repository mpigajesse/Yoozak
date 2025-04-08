"use client";

import axios, { AxiosError } from "axios";

// Configuration de l'URL de base pour les appels API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types pour les réponses API
interface ApiResponse<T> {
  results?: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
  [key: string]: any;
}

// Création d'une instance axios avec configuration par défaut
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs globalement
apiClient.interceptors.response.use(
  (response) => {
    // On s'assure de renvoyer les données correctement
    // Si la réponse contient un champ 'results', on le renvoie directement
    if (response.data && response.data.results !== undefined) {
      return response.data;
    }
    // Sinon on renvoie tout le corps de la réponse
    return response.data;
  },
  (error) => {
    // Gestion des erreurs d'authentification (401)
    if (error.response && error.response.status === 401) {
      // Rediriger vers la page de connexion si le token est expiré
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    // Formater les erreurs pour une meilleure lisibilité
    const errorMessage = error.response?.data?.detail || error.message || 'Une erreur est survenue';
    return Promise.reject({ message: errorMessage, status: error.response?.status, details: error.response?.data });
  }
);

// Service API pour la gestion des utilisateurs
const userService = {
  // Récupérer tous les utilisateurs avec filtres optionnels
  getUsers: (params = {}) => apiClient.get('/users/', { params }),
  
  // Récupérer un utilisateur par ID
  getUserById: (id: number | string) => apiClient.get(`/users/${id}/`),
  
  // Créer un nouvel utilisateur
  createUser: (userData: any) => apiClient.post('/users/', userData),
  
  // Mettre à jour un utilisateur existant
  updateUser: (id: number | string, userData: any) => apiClient.patch(`/users/${id}/`, userData),
  
  // Supprimer un utilisateur
  deleteUser: (id: number | string) => apiClient.delete(`/users/${id}/`),
  
  // Récupérer les rôles d'un utilisateur
  getUserRoles: (id: number | string) => apiClient.get(`/users/${id}/roles/`),
  
  // Ajouter un rôle à un utilisateur
  addUserRole: (id: number | string, roleData: any) => apiClient.post(`/users/${id}/roles/`, roleData),
  
  // Supprimer un rôle d'un utilisateur
  removeUserRole: (userId: number | string, roleId: number | string) => 
    apiClient.delete(`/users/${userId}/roles/${roleId}/`),
};

// Export d'un service API général
const apiService = {
  users: userService,
  
  // Service API pour la gestion de l'organisation
  organisation: {
    // Pôles
    getPoles: () => apiClient.get('/poles/'),
    getPoleById: (id: number | string) => apiClient.get(`/poles/${id}/`),
    createPole: (poleData: any) => apiClient.post('/poles/', poleData),
    updatePole: (id: number | string, poleData: any) => apiClient.patch(`/poles/${id}/`, poleData),
    deletePole: (id: number | string) => apiClient.delete(`/poles/${id}/`),
    
    // Services
    getServices: (params = {}) => apiClient.get('/services/', { params }),
    getServiceById: (id: number | string) => apiClient.get(`/services/${id}/`),
    getServicesByPole: (poleId: number | string) => apiClient.get('/services/', { params: { pole: poleId } }),
    createService: (serviceData: any) => apiClient.post('/services/', serviceData),
    updateService: (id: number | string, serviceData: any) => apiClient.patch(`/services/${id}/`, serviceData),
    deleteService: (id: number | string) => apiClient.delete(`/services/${id}/`),
    
    // Équipes
    getTeams: (params = {}) => apiClient.get('/teams/', { params }),
    getTeamById: (id: number | string) => apiClient.get(`/teams/${id}/`),
    getTeamsByService: (serviceId: number | string) => apiClient.get('/teams/', { params: { service: serviceId } }),
    createTeam: (teamData: any) => apiClient.post('/teams/', teamData),
    updateTeam: (id: number | string, teamData: any) => apiClient.patch(`/teams/${id}/`, teamData),
    deleteTeam: (id: number | string) => apiClient.delete(`/teams/${id}/`),
  },
  
  // Service API pour l'authentification
  auth: {
    login: (credentials: { username: string; password: string }) => 
      apiClient.post('/token/', credentials),
    
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return Promise.resolve(true);
    },
    
    refreshToken: (refreshToken: string) => 
      apiClient.post('/token/refresh/', { refresh: refreshToken }),
    
    getCurrentUser: () => apiClient.get('/users/current/'),
    
    updateProfile: (profileData: any) => apiClient.patch('/users/profile/update/', profileData),
    
    isAuthenticated: () => {
      return !!localStorage.getItem('token');
    },
  },
  
  // Méthodes génériques pour les appels API
  get: (url: string, config = {}) => apiClient.get(url, config),
  post: (url: string, data = {}, config = {}) => apiClient.post(url, data, config),
  put: (url: string, data = {}, config = {}) => apiClient.put(url, data, config),
  patch: (url: string, data = {}, config = {}) => apiClient.patch(url, data, config),
  delete: (url: string, config = {}) => apiClient.delete(url, config),
};

// Fonctions d'authentification pour compatibilité avec le store d'auth existant
export const getUserInfo = () => apiService.auth.getCurrentUser();
export const loginUser = (username: string, password: string) => apiService.auth.login({ username, password });
export const logoutUser = () => apiService.auth.logout();
export const updateUserProfile = (userData: any) => apiService.auth.updateProfile(userData);
export const refreshToken = (token: string) => apiService.auth.refreshToken(token);
export const verifyToken = (token: string) => apiClient.post('/token/verify/', { token });

export { apiService };
export default apiService;