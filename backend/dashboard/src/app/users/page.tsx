"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  UserIcon, 
  PlusIcon, 
  BuildingOfficeIcon,
  UserGroupIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';

// Types pour les utilisateurs et leurs rôles
interface UserRole {
  id: number;
  role: string;
  role_display: string;
  pole?: {
    id: number;
    nom: string;
    code: string;
  };
  service?: {
    id: number;
    nom: string;
  };
  team?: {
    id: number;
    nom: string;
  };
}

interface UserProfile {
  id: number;
  matricule: string;
  photo?: string;
  poste: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  profile?: UserProfile;
  roles: UserRole[];
}

// Couleurs pour les badges des pôles
const poleColors: Record<string, string> = {
  'CLIENTS': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'COMMANDES': 'bg-blue-100 text-blue-800 border-blue-300',
  'PRODUCTS': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'default': 'bg-gray-100 text-gray-800 border-gray-300'
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [poleFilter, setPoleFilter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Préparation des paramètres pour les filtres
        const params: Record<string, any> = {};
        if (activeFilter === 'active') params.is_active = true;
        if (activeFilter === 'inactive') params.is_active = false;
        if (poleFilter) params.pole__code = poleFilter;
        
        // Tentative de récupération des utilisateurs depuis l'API
        try {
          const response = await apiService.users.getUsers(params);
          console.log("Réponse des utilisateurs:", response);
          
          // S'assurer que response est un tableau, sinon utiliser un tableau vide
          if (Array.isArray(response)) {
            setUsers(response);
          } else if (response?.results && Array.isArray(response.results)) {
            setUsers(response.results);
          } else if (response && typeof response === 'object') {
            // Si la réponse est un objet mais pas un tableau, vérifier s'il contient des utilisateurs
            const responseObj = response as any;
            if (responseObj.count !== undefined && responseObj.results) {
              setUsers(responseObj.results);
            } else {
              console.warn("Format de réponse inattendu:", response);
              setUsers([]);
            }
          } else {
            console.warn("Format de réponse inattendu:", response);
            setUsers([]);
          }
        } catch (apiError) {
          console.error("Erreur lors de la récupération des utilisateurs:", apiError);
          // En cas d'erreur d'API, utiliser les données simulées pour le développement
          setUsers(getMockUsers());
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        setError("Une erreur est survenue lors du chargement des utilisateurs.");
        setUsers(getMockUsers()); // Données simulées pour le développement
        setLoading(false);
      }
    };

    fetchUsers();
  }, [activeFilter, poleFilter]);

  // Fonction pour les données simulées (utilisée uniquement en développement ou en cas d'erreur d'API)
  const getMockUsers = (): User[] => {
    return [
      {
        id: 1,
        username: 'admin',
        email: 'admin@yoozak.com',
        first_name: 'Admin',
        last_name: 'Système',
        is_active: true,
        profile: {
          id: 1,
          matricule: 'MAT001',
          poste: 'Administrateur Système',
        },
        roles: [
          {
            id: 1,
            role: 'SUPERADMIN',
            role_display: 'Super Administrateur',
          }
        ]
      },
      {
        id: 2,
        username: 'jdupont',
        email: 'j.dupont@yoozak.com',
        first_name: 'Jean',
        last_name: 'Dupont',
        is_active: true,
        profile: {
          id: 2,
          matricule: 'MAT002',
          poste: 'Directeur Produits',
        },
        roles: [
          {
            id: 2,
            role: 'DIRECTEUR_PRODUITS',
            role_display: 'Directeur Produits',
            pole: {
              id: 3,
              nom: 'Produits',
              code: 'PRODUCTS'
            }
          }
        ]
      },
      {
        id: 3,
        username: 'mmartin',
        email: 'm.martin@yoozak.com',
        first_name: 'Marie',
        last_name: 'Martin',
        is_active: true,
        profile: {
          id: 3,
          matricule: 'MAT003',
          poste: 'Responsable Catalogues',
        },
        roles: [
          {
            id: 3,
            role: 'RESPONSABLE_CATALOGUE',
            role_display: 'Responsable Catalogue',
            pole: {
              id: 3,
              nom: 'Produits',
              code: 'PRODUCTS'
            },
            service: {
              id: 2,
              nom: 'Catalogues'
            }
          }
        ]
      },
      {
        id: 4,
        username: 'plemoine',
        email: 'p.lemoine@yoozak.com',
        first_name: 'Pierre',
        last_name: 'Lemoine',
        is_active: true,
        profile: {
          id: 4,
          matricule: 'MAT004',
          poste: 'Directeur Commandes',
        },
        roles: [
          {
            id: 4,
            role: 'DIRECTEUR_COMMANDES',
            role_display: 'Directeur Commandes',
            pole: {
              id: 2,
              nom: 'Commandes',
              code: 'COMMANDES'
            }
          }
        ]
      },
      {
        id: 5,
        username: 'cdurand',
        email: 'c.durand@yoozak.com',
        first_name: 'Claire',
        last_name: 'Durand',
        is_active: false,
        profile: {
          id: 5,
          matricule: 'MAT005',
          poste: 'Directrice Clients',
        },
        roles: [
          {
            id: 5,
            role: 'DIRECTEUR_CLIENTS',
            role_display: 'Directeur Clients',
            pole: {
              id: 1,
              nom: 'Clients',
              code: 'CLIENTS'
            }
          }
        ]
      }
    ];
  };

  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter(user => {
    // Filtre de recherche
    const searchMatch = 
      searchTerm === '' ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.profile?.poste && user.profile.poste.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return searchMatch;
  });

  // Obtenir le badge de couleur pour un utilisateur en fonction de son pôle principal
  const getUserPoleColor = (user: User) => {
    const mainRole = user.roles[0]; // On prend le premier rôle comme principal
    if (mainRole && mainRole.pole) {
      return poleColors[mainRole.pole.code] || poleColors.default;
    }
    return poleColors.default;
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion des Utilisateurs</h1>
            <p className="text-gray-600">
              Gérez les utilisateurs et leurs rôles dans l'organisation.
            </p>
          </div>
          <Button className="mt-4 md:mt-0">
            <PlusIcon className="w-5 h-5 mr-2" />
            Nouvel Utilisateur
          </Button>
        </header>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={activeFilter === null ? "default" : "outline"}
                onClick={() => setActiveFilter(null)}
                size="sm"
              >
                Tous
              </Button>
              <Button
                variant={activeFilter === 'active' ? "default" : "outline"}
                onClick={() => setActiveFilter('active')}
                size="sm"
              >
                Actifs
              </Button>
              <Button
                variant={activeFilter === 'inactive' ? "default" : "outline"}
                onClick={() => setActiveFilter('inactive')}
                size="sm"
              >
                Inactifs
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={poleFilter === null ? "default" : "outline"}
                onClick={() => setPoleFilter(null)}
                size="sm"
              >
                Tous les pôles
              </Button>
              <Button
                variant={poleFilter === 'PRODUCTS' ? "default" : "outline"}
                onClick={() => setPoleFilter('PRODUCTS')}
                size="sm"
                className="border-emerald-500 text-emerald-700"
              >
                PRODUCTS
              </Button>
              <Button
                variant={poleFilter === 'COMMANDES' ? "default" : "outline"}
                onClick={() => setPoleFilter('COMMANDES')}
                size="sm"
                className="border-blue-500 text-blue-700"
              >
                COMMANDES
              </Button>
              <Button
                variant={poleFilter === 'CLIENTS' ? "default" : "outline"}
                onClick={() => setPoleFilter('CLIENTS')}
                size="sm"
                className="border-yellow-500 text-yellow-700"
              >
                CLIENTS
              </Button>
            </div>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="font-medium">Erreur</p>
              <p>{error}</p>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poste & Matricule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pôles & Services
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                      </div>
                      <p className="mt-2">Chargement des utilisateurs...</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Aucun utilisateur ne correspond aux critères de recherche.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.profile?.photo ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.profile.photo}
                                alt={`${user.first_name} ${user.last_name}`}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                            <div className="text-xs text-gray-400">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.profile ? (
                          <>
                            <div className="text-sm text-gray-900">{user.profile.poste}</div>
                            <div className="text-sm text-gray-500">{user.profile.matricule}</div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-500">Non défini</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {user.roles.map((role, index) => (
                            role.pole && (
                              <div key={`pole-${index}`} className="flex items-center">
                                <Badge className={poleColors[role.pole.code] || poleColors.default}>
                                  <BuildingOfficeIcon className="h-3 w-3 mr-1" />
                                  {role.pole.nom}
                                </Badge>
                                {role.service && (
                                  <Badge className="ml-1 bg-white text-gray-700 border border-gray-300">
                                    <UserGroupIcon className="h-3 w-3 mr-1" />
                                    {role.service.nom}
                                  </Badge>
                                )}
                              </div>
                            )
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role, index) => (
                            <Badge key={`role-${index}`} variant="outline" className="bg-gray-100">
                              <TagIcon className="h-3 w-3 mr-1" />
                              {role.role_display}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900">
                          Éditer
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage; 