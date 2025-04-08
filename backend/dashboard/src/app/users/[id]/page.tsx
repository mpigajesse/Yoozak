"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeftIcon, UserIcon, BuildingOfficeIcon, UserGroupIcon, TagIcon } from '@heroicons/react/24/outline';
import { apiService } from '@/services/api';

// Types
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

interface Pole {
  id: number;
  nom: string;
  code: string;
  description: string;
}

interface Service {
  id: number;
  nom: string;
  pole: number;
  description: string;
}

interface Role {
  id: number;
  name: string;
  display_name: string;
}

const poleColors: Record<string, string> = {
  'CLIENTS': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'COMMANDES': 'bg-blue-100 text-blue-800 border-blue-300',
  'PRODUCTS': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'default': 'bg-gray-100 text-gray-800 border-gray-300'
};

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [savingData, setSavingData] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Données mockées pour les pôles, services et rôles
  const poles: Pole[] = [
    { id: 1, nom: "Clients", code: "CLIENTS", description: "Gestion des clients" },
    { id: 2, nom: "Commandes", code: "COMMANDES", description: "Gestion des commandes" },
    { id: 3, nom: "Produits", code: "PRODUCTS", description: "Gestion des produits" }
  ];
  
  const services: Service[] = [
    { id: 1, nom: "Support Client", pole: 1, description: "Service support client" },
    { id: 2, nom: "Catalogues", pole: 3, description: "Gestion des catalogues" },
    { id: 3, nom: "Livraisons", pole: 2, description: "Service de livraison" }
  ];
  
  const roles: Role[] = [
    { id: 1, name: "SUPERADMIN", display_name: "Super Administrateur" },
    { id: 2, name: "DIRECTEUR_PRODUITS", display_name: "Directeur Produits" },
    { id: 3, name: "RESPONSABLE_CATALOGUE", display_name: "Responsable Catalogue" },
    { id: 4, name: "SUPPORT_CLIENT", display_name: "Support Client" },
    { id: 5, name: "RESPONSABLE_COMMANDES", display_name: "Responsable Commandes" }
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        try {
          // Tenter de récupérer l'utilisateur depuis l'API
          const response = await apiService.users.getUserById(parseInt(params.id));
          const userData = response?.data || null;
          setUser(userData);
        } catch (apiError) {
          console.error("Erreur lors de la récupération de l'utilisateur:", apiError);
          // En cas d'erreur, utiliser des données simulées pour le développement
          setUser(getMockUser(parseInt(params.id)));
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des détails de l'utilisateur:", error);
        setError("Une erreur est survenue lors du chargement des détails de l'utilisateur.");
        setUser(getMockUser(parseInt(params.id)));
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [params.id]);

  // Fonction pour données simulées (utilisée uniquement en développement ou en cas d'erreur d'API)
  const getMockUser = (id: number): User => {
    const mockUsers = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@yoozak.com',
        first_name: 'Admin',
        last_name: 'Système',
        is_active: true,
        date_joined: '2023-01-01T00:00:00Z',
        last_login: '2023-07-15T08:30:00Z',
        profile: {
          id: 1,
          matricule: 'MAT001',
          poste: 'Administrateur Système',
          telephone: '+33123456789',
          date_embauche: '2023-01-01',
          notes: 'Administrateur principal du système',
        },
        roles: [
          {
            id: 1,
            role: 'SUPERADMIN',
            role_display: 'Super Administrateur',
            description: 'Accès complet à toutes les fonctionnalités du système',
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
        date_joined: '2023-02-15T00:00:00Z',
        last_login: '2023-07-14T14:22:00Z',
        profile: {
          id: 2,
          matricule: 'MAT002',
          poste: 'Directeur Produits',
          telephone: '+33612345678',
          date_embauche: '2023-02-15',
          notes: 'Responsable de la stratégie produits',
        },
        roles: [
          {
            id: 2,
            role: 'DIRECTEUR_PRODUITS',
            role_display: 'Directeur Produits',
            description: 'Gestion des catalogues et des produits',
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
        date_joined: '2023-03-01T00:00:00Z',
        last_login: '2023-07-15T09:45:00Z',
        profile: {
          id: 3,
          matricule: 'MAT003',
          poste: 'Responsable Catalogues',
          telephone: '+33698765432',
          date_embauche: '2023-03-01',
          notes: 'Gestion des produits dans les catalogues',
        },
        roles: [
          {
            id: 3,
            role: 'RESPONSABLE_CATALOGUE',
            role_display: 'Responsable Catalogue',
            description: 'Gestion des produits dans les catalogues',
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
      }
    ];
    
    const foundUser = mockUsers.find(u => u.id === id);
    return foundUser || mockUsers[0]; // Retourner le premier utilisateur par défaut si non trouvé
  };

  const handleUpdateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      setSavingData(true);
      setSaveMessage(null);
      
      // Simulation de l'enregistrement (à remplacer par l'appel API réel)
      try {
        if (!user.profile) return;
        
        // Mise à jour du profil via l'API
        await apiService.users.updateUser(user.id, { 
          profile: { ...user.profile, ...profileData } 
        });
        
        // Mise à jour locale de l'état
        setUser(prev => {
          if (!prev || !prev.profile) return prev;
          return {
            ...prev,
            profile: { ...prev.profile, ...profileData }
          } as User;
        });
        
        setSaveMessage({
          type: 'success',
          text: 'Profil mis à jour avec succès'
        });
      } catch (apiError) {
        console.error("Erreur lors de la mise à jour du profil:", apiError);
        setSaveMessage({
          type: 'error',
          text: 'Erreur lors de la mise à jour du profil'
        });
      }
      
      setSavingData(false);
    } catch (error) {
      console.error("Erreur:", error);
      setSaveMessage({
        type: 'error',
        text: 'Une erreur inattendue est survenue'
      });
      setSavingData(false);
    }
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      setSavingData(true);
      setSaveMessage(null);
      
      // Simulation de l'enregistrement (à remplacer par l'appel API réel)
      try {
        // Mise à jour de l'utilisateur via l'API
        await apiService.users.updateUser(user.id, userData);
        
        // Mise à jour locale de l'état
        setUser(prev => {
          if (!prev) return null;
          return { ...prev, ...userData } as User;
        });
        
        setSaveMessage({
          type: 'success',
          text: 'Informations utilisateur mises à jour avec succès'
        });
      } catch (apiError) {
        console.error("Erreur lors de la mise à jour de l'utilisateur:", apiError);
        setSaveMessage({
          type: 'error',
          text: 'Erreur lors de la mise à jour des informations utilisateur'
        });
      }
      
      setSavingData(false);
    } catch (error) {
      console.error("Erreur:", error);
      setSaveMessage({
        type: 'error',
        text: 'Une erreur inattendue est survenue'
      });
      setSavingData(false);
    }
  };

  const handleAddRole = async (roleData: Partial<UserRole>) => {
    if (!user) return;
    
    try {
      setSavingData(true);
      setSaveMessage(null);
      
      try {
        // Ajout du rôle via l'API
        await apiService.users.addUserRole(user.id, roleData);
        
        // Récupérer les rôles mis à jour
        const response = await apiService.users.getUserRoles(user.id);
        const updatedRoles = response?.data;
        
        // Mise à jour locale de l'état
        setUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            roles: Array.isArray(updatedRoles) ? updatedRoles : prev.roles
          } as User;
        });
        
        setSaveMessage({
          type: 'success',
          text: 'Rôle ajouté avec succès'
        });
      } catch (apiError) {
        console.error("Erreur lors de l'ajout du rôle:", apiError);
        setSaveMessage({
          type: 'error',
          text: 'Erreur lors de l\'ajout du rôle'
        });
      }
      
      setSavingData(false);
    } catch (error) {
      console.error("Erreur:", error);
      setSaveMessage({
        type: 'error',
        text: 'Une erreur inattendue est survenue'
      });
      setSavingData(false);
    }
  };

  const handleRemoveRole = async (roleId: number) => {
    if (!user) return;
    
    try {
      setSavingData(true);
      setSaveMessage(null);
      
      try {
        // Suppression du rôle via l'API
        await apiService.users.removeUserRole(user.id, roleId);
        
        // Mise à jour locale de l'état
        setUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            roles: prev.roles.filter(r => r.id !== roleId)
          } as User;
        });
        
        setSaveMessage({
          type: 'success',
          text: 'Rôle supprimé avec succès'
        });
      } catch (apiError) {
        console.error("Erreur lors de la suppression du rôle:", apiError);
        setSaveMessage({
          type: 'error',
          text: 'Erreur lors de la suppression du rôle'
        });
      }
      
      setSavingData(false);
    } catch (error) {
      console.error("Erreur:", error);
      setSaveMessage({
        type: 'error',
        text: 'Une erreur inattendue est survenue'
      });
      setSavingData(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="text-gray-500">Chargement des informations utilisateur...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-500">Utilisateur non trouvé</p>
            <Button 
              onClick={() => router.push('/users')} 
              className="mt-4"
              variant="outline"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-2" />
              Retour à la liste des utilisateurs
          </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => router.push('/users')}
              className="mr-4"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-gray-600">@{user.username}</p>
            </div>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
              <Button 
              variant={activeTab === "profile" ? "secondary" : "outline"}
              onClick={() => setActiveTab("profile")}
            >
              Profil
            </Button>
            <Button 
              variant={activeTab === "roles" ? "secondary" : "outline"}
              onClick={() => setActiveTab("roles")}
            >
              Rôles et Organisation
            </Button>
            <Button 
              variant={activeTab === "security" ? "secondary" : "outline"}
              onClick={() => setActiveTab("security")}
            >
              Sécurité
            </Button>
            <Button 
              variant={activeTab === "activity" ? "secondary" : "outline"}
              onClick={() => setActiveTab("activity")}
            >
              Activité
              </Button>
          </div>
        </div>
        
        <Tabs defaultValue="profile" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="roles">Rôles et Organisation</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
          <Card>
            <CardHeader>
                <CardTitle>Informations du Profil</CardTitle>
                <CardDescription>
                  Les informations personnelles de l'utilisateur
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="flex flex-col items-center gap-4">
                      {user.profile?.photo ? (
                        <img
                          src={user.profile.photo}
                          alt={`${user.first_name} ${user.last_name}`}
                          className="w-32 h-32 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      {activeTab === "profile" && (
                        <Button variant="outline" size="sm">
                          Changer la photo
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Prénom</Label>
                      <Input 
                        id="first_name" 
                        value={user.first_name} 
                        readOnly={activeTab !== "profile"}
                        onChange={(e) => handleUpdateUser({ first_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Nom</Label>
                      <Input 
                        id="last_name" 
                        value={user.last_name} 
                        readOnly={activeTab !== "profile"}
                        onChange={(e) => handleUpdateUser({ last_name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        value={user.email} 
                        readOnly={activeTab !== "profile"}
                        onChange={(e) => handleUpdateUser({ email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Nom d'utilisateur</Label>
                      <Input 
                        id="username" 
                        value={user.username} 
                        readOnly={activeTab !== "profile"}
                        onChange={(e) => handleUpdateUser({ username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matricule">Matricule</Label>
                      <Input 
                        id="matricule" 
                        value={user.profile?.matricule || ''} 
                        readOnly={activeTab !== "profile"}
                        onChange={(e) => handleUpdateProfile({ matricule: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="poste">Poste</Label>
                      <Input 
                        id="poste" 
                        value={user.profile?.poste || ''} 
                        readOnly={activeTab !== "profile"}
                        onChange={(e) => handleUpdateProfile({ poste: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="is_active" 
                          checked={user.is_active} 
                          disabled={activeTab !== "profile"}
                          onCheckedChange={(checked) => handleUpdateUser({ is_active: checked })}
                        />
                        <Label htmlFor="is_active">Utilisateur actif</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roles">
            <Card>
              <CardHeader>
                <CardTitle>Rôles et Affectations</CardTitle>
                <CardDescription>
                  Gérez les rôles et les affectations dans l'organisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {user.roles.map((userRole, index) => (
                    <div key={`role-${index}`} className="p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex flex-wrap gap-2 items-center mb-2 md:mb-0">
                          <Badge variant="outline" className="bg-gray-100 px-3 py-1">
                            <TagIcon className="h-4 w-4 mr-1" />
                            {userRole.role_display}
                          </Badge>
                          {userRole.pole && (
                            <Badge className={poleColors[userRole.pole.code] || poleColors.default}>
                              <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                              {userRole.pole.nom}
                            </Badge>
                          )}
                          {userRole.service && (
                            <Badge className="bg-white text-gray-700 border border-gray-300">
                              <UserGroupIcon className="h-4 w-4 mr-1" />
                              {userRole.service.nom}
                            </Badge>
                          )}
                        </div>
                        {activeTab === "roles" && (
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleRemoveRole(userRole.id)}>
                            Supprimer
                          </Button>
                        )}
                      </div>
                      {activeTab === "roles" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <Label htmlFor={`role-${index}`}>Rôle</Label>
                            <Select defaultValue={userRole.role}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un rôle" />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map(role => (
                                  <SelectItem key={role.id} value={role.name}>
                                    {role.display_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`pole-${index}`}>Pôle</Label>
                            <Select defaultValue={userRole.pole?.id.toString()}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un pôle" />
                              </SelectTrigger>
                              <SelectContent>
                                {poles.map(pole => (
                                  <SelectItem key={pole.id} value={pole.id.toString()}>
                                    {pole.nom}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor={`service-${index}`}>Service</Label>
                            <Select defaultValue={userRole.service?.id.toString()}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un service" />
                              </SelectTrigger>
                              <SelectContent>
                                {services
                                  .filter(s => userRole.pole ? s.pole === userRole.pole.id : true)
                                  .map(service => (
                                    <SelectItem key={service.id} value={service.id.toString()}>
                                      {service.nom}
                                    </SelectItem>
                                  ))
                                }
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {activeTab === "roles" && (
                    <Button className="w-full mt-4" onClick={() => handleAddRole({ role: 'DIRECTEUR_PRODUITS', role_display: 'Directeur Produits', pole: { id: 3, nom: 'Produits', code: 'PRODUCTS' } })}>
                      Ajouter un nouveau rôle
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité du Compte</CardTitle>
                <CardDescription>
                  Gérer la sécurité du compte utilisateur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Contenu de l'onglet sécurité...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activité Récente</CardTitle>
                <CardDescription>
                  Historique des activités de l'utilisateur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Contenu de l'onglet activité...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
} 