
// ce fichier gere les constantes de l'application
// on utilise export pour exporter les constantes
// on utilise process.env pour gerer les variables d'environnement  
// on utilise process.env pour gerer les variables d'environnement

// URL de base de l'API provenant de l'environnement cote client 
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Constantes liées à l'authentification
// on utilise export pour exporter les constantes 
// car on a besoin de gerer les variables d'environnement
export const TOKEN_KEY = 'yoozak_auth_token';
export const USER_KEY = 'yoozak_user';

// Autres constantes
// on utilise export pour exporter les constantes 
// car on a besoin de gerer les variables d'environnement
export const APP_NAME = 'Yoozak Dashboard';
export const APP_VERSION = '1.0.0';

// Paramètres de pagination
// on utilise export pour exporter les constantes 
// car on a besoin de gerer les variables d'environnement
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

// Thème
// on utilise export pour exporter les constantes 
// car on a besoin de gerer les variables d'environnement
export const DEFAULT_THEME = 'light'; 