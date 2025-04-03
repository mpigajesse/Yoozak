// Constantes globales pour l'application

// URL de base de l'API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Constantes liées à l'authentification
export const TOKEN_KEY = 'yoozak_auth_token';
export const USER_KEY = 'yoozak_user';

// Autres constantes
export const APP_NAME = 'Yoozak Dashboard';
export const APP_VERSION = '1.0.0';

// Paramètres de pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

// Thème
export const DEFAULT_THEME = 'light'; 