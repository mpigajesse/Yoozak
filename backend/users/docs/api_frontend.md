# Documentation API Frontend (Dashboard)

Ce document explique les fonctions d'API implémentées dans le fichier `api.ts` qui est utilisé par le dashboard pour communiquer avec le backend.

## Configuration de base

Le fichier `api.ts` configure une instance Axios pour communiquer avec l'API backend. Il définit :

```typescript
// URL de base pour l'API
const API_BASE_URL = "http://localhost:8000";

// Création d'une instance axios pour les appels API
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

## Intercepteurs d'authentification

Des intercepteurs sont configurés pour injecter automatiquement le token JWT dans les en-têtes de requêtes :

```typescript
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
```

## Services d'authentification

### Connexion administrateur

```typescript
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/users/auth/login/`, {
      username,
      password
    });
    return response.data;
  } catch (error) {
    // Gestion des erreurs
    throw error;
  }
};
```

**Paramètres :**
- `username` : Nom d'utilisateur administrateur
- `password` : Mot de passe de l'utilisateur

**Retourne :**
Un objet contenant :
- `refresh` : Token de rafraîchissement
- `access` : Token d'accès
- `user` : Données de l'utilisateur

### Rafraîchissement du token

```typescript
export const refreshToken = async (refresh: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/users/auth/refresh/`, {
      refresh
    });
    return response.data;
  } catch (error) {
    // Gestion des erreurs
    throw error;
  }
};
```

**Paramètres :**
- `refresh` : Token de rafraîchissement

**Retourne :**
Un objet contenant :
- `access` : Nouveau token d'accès

### Vérification du token

```typescript
export const verifyToken = async (token: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/token/verify/`, {
      token
    });
    return response.data;
  } catch (error) {
    // Gestion des erreurs
    throw error;
  }
};
```

**Paramètres :**
- `token` : Token JWT à vérifier

**Retourne :**
Un objet vide en cas de succès, ou une erreur si le token est invalide

### Déconnexion

```typescript
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  return { success: true };
};
```

**Retourne :**
Un objet avec `success: true`

## Gestion des utilisateurs

### Récupérer les informations de l'utilisateur

```typescript
export const getUserInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Aucun token d'authentification");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.get(`${API_BASE_URL}/api/users/profile/`, { headers });
    return response.data;
  } catch (error) {
    // Gestion des erreurs
    throw error;
  }
};
```

**Retourne :**
Les données de l'utilisateur connecté

### Mettre à jour le profil utilisateur

```typescript
export const updateUserProfile = async (userData: Record<string, any>) => {
  try {
    const response = await api.patch("/api/users/profile/update/", userData);
    return response.data;
  } catch (error) {
    // Gestion des erreurs
    throw error;
  }
};
```

**Paramètres :**
- `userData` : Objet contenant les champs à mettre à jour (username, email, first_name, last_name, password)

**Retourne :**
Les données mises à jour de l'utilisateur

## Service API unifié

Le fichier exporte un objet `apiService` qui centralise toutes les fonctions :

```typescript
const apiService = {
  login: loginUser,
  logout: logoutUser,
  refreshToken,
  verifyToken,
  getUserInfo,
  updateUserProfile,
  
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
```

## Utilisation dans le frontend

### Exemple d'authentification

```typescript
import apiService from "@/services/api";

// Connexion
const handleLogin = async (username, password) => {
  try {
    const result = await apiService.login(username, password);
    // Stockage des tokens et redirection
  } catch (error) {
    // Gestion des erreurs
  }
};

// Récupération des données utilisateur
const fetchUserProfile = async () => {
  try {
    const userInfo = await apiService.getUserInfo();
    // Utilisation des données
  } catch (error) {
    // Gestion des erreurs
  }
};

// Modification du profil
const updateProfile = async (formData) => {
  try {
    const updatedProfile = await apiService.updateUserProfile({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password
    });
    // Traitement des données mises à jour
  } catch (error) {
    // Gestion des erreurs
  }
};
```

## Gestion des erreurs

Le service API inclut une gestion détaillée des erreurs, notamment pour les problèmes d'authentification :

```typescript
try {
  // Appel API
} catch (error: unknown) {
  if (error instanceof AxiosError && error.response) {
    console.error("Détails de l'erreur:", {
      status: error.response.status,
      data: error.response.data,
      url: error.config?.url
    });
  }
  throw error;
}
```

## Intégration avec le store d'authentification

Ces services API sont utilisés par le store d'authentification (`authStore.ts`) pour gérer l'état de connexion de l'utilisateur dans l'application dashboard. 