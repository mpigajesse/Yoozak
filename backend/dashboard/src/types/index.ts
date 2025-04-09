
// le dossier types gere les types
// les types sont des objets qui permettent de gerer les données dans les components
// car on a besoin de gerer les types dans les components
//exemple : les types de la réponse de l'api, les types de l'utilisateur, les types de l'organisation, etc.

// Interface utilisateur
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isStaff: boolean;
  isSuperuser: boolean;
  isActive: boolean;
  dateJoined: string;
  lastLogin: string;
  groups: string[];
  userPermissions: string[];
  password?: string;
}

// Types pour l'authentification
export interface AuthResponse {
  access: string;
  refresh: string;
}

// Types pour les produits
export interface Category {
  id: number;
  nom: string;
  description: string | null;
}

// Types pour les sous-catégories
export interface SubCategory {
  id: number;
  nom: string;
  description: string | null;
  categorie: number;
}

// Types pour les produits
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

// Types pour les articles
export interface Article {
  id: number;
  produit: number;
  couleur: string | null;
  pointure: string | null;
  code_bar: string;
  date_achat: string | null;
}

// Types pour les créatifs
export interface Creative {
  id: number;
  produit: number;
  type_creative: string | null;
  url: string;
}

// Types pour les promotions
export interface Promotion {
  id: number;
  produit: number;
  type_promo: string;
  reduction: number;
  date_debut: string;
  date_fin: string;
}

// Types pour les clients
export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

// Types pour les favoris
export interface Favoris {
  id: number;
  client: number;
  produit: number;
  date_ajout: string;
}

// Types pour les avis
export interface Avis {
  id: number;
  client: number;
  produit: number;
  commentaire: string | null;
  note: number;
  date_creation: string;
}

// Types pour les commandes
export interface EtatCommande {
  id: number;
  libelle_etat: string;
}

export interface Order {
  id: number;
  client: Client;
  products: Product[];
  total: number;
  status: string;
  createdAt: string;
}

// Types pour le panier
export interface Panier {
  id: number;
  client: number;
  produit: number;
  quantite: number;
  date_ajout: string;
}

// Types pour les lignes de commande
export interface LigneCommande {
  id: number;
  commande: number;
  produit: number;
  article: number | null;
  quantite: number;
  prix_unitaire: number;
}

// Types pour les codes promo
export interface CodePromo {
  id: number;
  numero_promo: string;
  taux: number;
  commande: number | null;
  date_debut: string | null;
  date_fin: string | null;
  est_actif: boolean;
}

// Types pour les remises
export interface Remise {
  id: number;
  commande: number;
  taux_de_reduction: number;
  date_creation: string;
}

// Types pour les retours   
export interface Retour {
  id: number;
  commande: number;
  motif: string | null;
  date_retour: string;
  date_creation: string;
}

// Types pour les tableaux de bord
export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalClients: number;
  totalProducts: number;
  recentOrders: Order[];
  topProducts: Product[];
  
  // Ces propriétés sont utilisées dans le dashboard
  total_clients: number;
  total_commandes: number;
  total_produits: number;
  total_ventes: number;
  produits_populaires: {
    id: number;
    nom: string;
    ventes: number;
  }[];
  ventes_par_mois: {
    mois: string;
    montant: number;
  }[];
}

// Types pour la pagination
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Types pour les notifications
export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

// Types pour les erreurs API
export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, string[]>;
} 