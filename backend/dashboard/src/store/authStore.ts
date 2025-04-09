"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUserInfo, loginUser, logoutUser, updateUserProfile, refreshToken, verifyToken } from "@/services/api";
import { User } from "@/types";

// Types pour l'authentification
interface AuthResponse {
  access: string;
  refresh: string;
  user?: any;
  user_roles?: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refreshToken: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  getUserInfo: () => Promise<User | null>;
  updateUserInfo: (userData: Partial<User>) => Promise<User | null>;
  clearError: () => void;
  refreshAuthToken: () => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
}

// Convertit les données utilisateur renvoyées par l'API Django au format User
const transformUserData = (apiData: any): User => {
  if (!apiData) return {} as User;
  
  // Si c'est un administrateur (données venant de /api/users/profile/)
  if (apiData.is_staff !== undefined) {
    return {
      id: apiData.id || 0,
      username: apiData.username || '',
      email: apiData.email || '',
      firstName: apiData.first_name || '',
      lastName: apiData.last_name || '',
      isStaff: apiData.is_staff || false,
      isSuperuser: apiData.is_superuser || false,
      isActive: apiData.is_active || false,
      dateJoined: apiData.date_joined || '',
      lastLogin: apiData.last_login || '',
      groups: apiData.groups?.map((g: any) => g.name) || [],
      userPermissions: apiData.user_permissions?.map((p: any) => p.codename) || [],
    };
  }
  
  // Format standard pour un client avec profil
  return {
    id: apiData.id || 0,
    username: apiData.user?.username || '',
    email: apiData.user?.email || '',
    firstName: apiData.prenom || apiData.user?.first_name || '',
    lastName: apiData.nom || apiData.user?.last_name || '',
    isStaff: apiData.user?.is_staff || false,
    isSuperuser: apiData.user?.is_superuser || false,
    isActive: apiData.user?.is_active || false,
    dateJoined: apiData.user?.date_joined || '',
    lastLogin: apiData.user?.last_login || '',
    groups: apiData.user?.groups || [],
    userPermissions: apiData.user?.user_permissions || [],
  };
};

// Créer et exporter le store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      isLoading: false,
      error: null,
      refreshToken: null,
      
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          console.log(`Connexion avec l'utilisateur: ${username}`);
          const response = await loginUser(username, password);
          const data = response as unknown as AuthResponse;
          console.log("Données d'authentification reçues:", data);
          
          if (data.access && data.refresh) {
            // Stocker les tokens
            localStorage.setItem("token", data.access);
            localStorage.setItem("refreshToken", data.refresh);
            
            set({ 
              token: data.access,
              refreshToken: data.refresh,
              isLoading: false,
              isAuthenticated: true
            });
            
            // Récupérer les informations de l'utilisateur après la connexion
            try {
              const userInfo = await getUserInfo();
              console.log("Informations utilisateur récupérées:", userInfo);
              
              const transformedUser = transformUserData(userInfo);
              console.log("Utilisateur transformé:", transformedUser);
              
              set({ 
                user: transformedUser,
                isAuthenticated: true,
                isLoading: false
              });
            } catch (userError: any) {
              console.error("Erreur lors de la récupération des infos utilisateur:", userError);
              // Si nous ne pouvons pas récupérer les infos utilisateur, nous considérons 
              // que l'authentification a échoué
              set({
                isLoading: false,
                isAuthenticated: false,
                error: "Impossible de récupérer les informations utilisateur. Vérifiez vos permissions."
              });
              return false;
            }
            
            return true;
          } else {
            throw new Error("Réponse d'authentification incomplète");
          }
        } catch (error: any) {
          console.error("Erreur d'authentification:", error);
          set({ 
            isLoading: false, 
            error: error.message || "Échec de l'authentification",
            isAuthenticated: false,
            user: null
          });
          return false;
        }
      },
      
      logout: () => {
        try {
          // Appeler l'API de déconnexion
          logoutUser();
        } catch (error) {
          console.error("Erreur lors de la déconnexion:", error);
        } finally {
          // Réinitialiser le state
          set({ 
            user: null, 
            token: null, 
            refreshToken: null,
            error: null,
            isAuthenticated: false
          });
        }
      },
      
      getUserInfo: async () => {
        set({ isLoading: true, error: null });
        try {
          const userData = await getUserInfo();
          console.log("Données utilisateur reçues:", userData);
          
          // Transformer les données pour correspondre à l'interface User
          const userWithCorrectFormat = transformUserData(userData);
          
          set({ 
            user: userWithCorrectFormat, 
            isAuthenticated: true,
            isLoading: false 
          });
          return userWithCorrectFormat;
        } catch (error: any) {
          console.error("Erreur getUserInfo:", error);
          set({ 
            isLoading: false, 
            error: error.message || "Échec de la récupération des données utilisateur"
          });
          throw error;
        }
      },
      
      updateUserInfo: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          console.log("Mise à jour des données utilisateur:", userData);
          
          // Transformer les données de l'interface User au format attendu par l'API
          const apiUserData = {
            username: userData.username,
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            ...(userData.password ? { password: userData.password } : {})
          };
          
          const updatedUserData = await updateUserProfile(apiUserData);
          
          // Mettre à jour le state avec les nouvelles données utilisateur
          const currentUser = get().user;
          if (currentUser) {
            const userWithCorrectFormat: User = {
              ...currentUser,
              ...transformUserData(updatedUserData)
            };
            
            set({ 
              user: userWithCorrectFormat,
              isLoading: false 
            });
            return userWithCorrectFormat;
          }
          
          return null;
        } catch (error: any) {
          console.error("Erreur updateUserInfo:", error);
          set({ 
            isLoading: false, 
            error: error.message || "Échec de la mise à jour des données utilisateur"
          });
          throw error;
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      refreshAuthToken: async () => {
        const currentRefreshToken = get().refreshToken;
        if (!currentRefreshToken) {
          return false;
        }
        
        try {
          const response = await refreshToken(currentRefreshToken);
          const data = response as unknown as AuthResponse;
          if (data.access) {
            localStorage.setItem("token", data.access);
            set({ token: data.access });
            return true;
          }
          return false;
        } catch (error) {
          console.error("Erreur lors du rafraîchissement du token:", error);
          return false;
        }
      },
      
      checkAuth: async () => {
        const token = get().token;
        if (!token) {
          return false;
        }
        
        try {
          await verifyToken(token);
          return true;
        } catch (error) {
          console.error("Erreur lors de la vérification du token:", error);
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);