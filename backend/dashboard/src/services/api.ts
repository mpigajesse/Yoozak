
// le dossier services gere les services
// les services sont des objets qui permettent de gerer les données dans les components


// ce fichier gere les appels à l'api
// il gere les erreurs, les intercepteurs, les services, les fonctions d'authentification
// et les types de la réponse de l'api
// il gere les types de la réponse de l'api
// il gere les types de l'utilisateur
// il gere les types de l'organisation
// il gere les types de l'authentification
// il gere les types de la réponse de l'api
// il gere les types de l'utilisateur
// il gere les types de l'organisation

// 'utilisation de 'use client' pour que le store soit accessible dans les components
//car le store est un composant client 
"use client";

// importation de axios pour faire les appels à l'api 
//car on a besoin de faire les appels à l'api dans les components
import axios from "axios";

// Configuration de l'URL de base pour les appels API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Création d'une instance axios avec configuration par défaut ,pour faire les appels à l'api
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
// car on a besoin de l'ajouter à chaque requête pour l'authentification
// afin de pouvoir accéder aux ressources protégées ,telles que les utilisateurs, les organisations, les services, les équipes, les rôles, etc.
// on ajoute le token à chaque requête pour l'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Envoi d'une requête API vers:", config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs globalement
apiClient.interceptors.response.use(
  (response) => {
    console.log("Réponse API reçue:", response.config.url, response.status);
    // On s'assure de renvoyer les données correctement
    // Si la réponse contient un champ 'results', on le renvoie directement
    if (response.data && response.data.results !== undefined) {
      return response.data;
    }
    // Sinon on renvoie tout le corps de la réponse
    return response.data;
  },
  (error) => {
    console.error("Erreur API:", error.response?.status, error.response?.data);
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
// car on a besoin de gerer les utilisateurs
// on gere les utilisateurs avec les filtres optionnels 
const userService = {
  // Récupérer tous les utilisateurs avec filtres optionnels
  getUsers: (params = {}) => {
    console.log("Récupération des utilisateurs avec params:", params);
    // Par défaut, inclure tous les utilisateurs (actifs et inactifs)
    const defaultParams = { est_actif: null, ...params };
    return apiClient.get('/users/', { params: defaultParams });
  },
  
  // Récupérer un utilisateur par ID
  getUserById: (id: number | string) => apiClient.get(`/users/${id}/`),
  
  // Créer un nouvel utilisateur
  createUser: (userData: any) => apiClient.post('/users/users/', userData),
  
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
// car on a besoin de gerer les organisations, les services, les équipes, les rôles, etc.
// on gere les organisations, les services, les équipes, les rôles, etc.

// apiService est un objet qui contient les services API pour la gestion des utilisateurs, des organisations, des services, des équipes, des rôles, etc.
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
// car on a besoin de gerer les fonctions d'authentification
// on gere les fonctions d'authentification avec les fonctions d'authentification
export const getUserInfo = () => apiService.auth.getCurrentUser();
export const loginUser = (username: string, password: string) => apiService.auth.login({ username, password });
export const logoutUser = () => apiService.auth.logout();
export const updateUserProfile = (userData: any) => apiService.auth.updateProfile(userData);
export const refreshToken = (token: string) => apiService.auth.refreshToken(token);
export const verifyToken = (token: string) => apiClient.post('/token/verify/', { token });

export { apiService };
export default apiService;