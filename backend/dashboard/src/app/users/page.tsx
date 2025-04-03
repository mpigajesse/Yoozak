"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'react-toastify';
import apiService from '@/services/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  date_joined: string;
  last_login: string;
}

const UsersPage = () => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMounted(true);
    
    const fetchUsers = async () => {
      try {
        // Récupérer la liste des utilisateurs depuis l'API
        const response = await apiService.get('/api/users/');
        if (Array.isArray(response)) {
          setUsers(response);
        } else if (response.results && Array.isArray(response.results)) {
          // Si l'API renvoie un objet avec une propriété results
          setUsers(response.results);
        } else {
          console.error("Format de réponse inattendu:", response);
          setUsers([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        toast.error("Impossible de charger la liste des utilisateurs");
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (mounted) {
      fetchUsers();
    }
  }, [mounted]);

  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (!mounted) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="text-gray-500 dark:text-gray-400">Chargement des utilisateurs...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-500">Actif</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800/30 dark:text-gray-400">Inactif</Badge>;
    }
  };

  const getRoleBadge = (user: User) => {
    if (user.is_superuser) {
      return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-500">Super Admin</Badge>;
    } else if (user.is_staff) {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-500">Administrateur</Badge>;
    } else {
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-500">Utilisateur</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Jamais";
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Gestion des utilisateurs</h1>
          <Link href="/users/nouveau" passHref>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nouvel utilisateur
            </Button>
          </Link>
        </div>

        {/* Barre de recherche */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Rechercher un utilisateur..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Liste des utilisateurs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Link href={`/users/${user.id}`} key={user.id} passHref>
                <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer">
                  <CardContent className="p-0">
                    <div className="p-4 flex items-start gap-4">
                      <Avatar className="h-12 w-12 border">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {getRoleBadge(user)}
                          {getStatusBadge(user.is_active)}
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/50 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                      Dernière connexion: {formatDate(user.last_login)}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center py-6">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? "Aucun utilisateur ne correspond à votre recherche" : "Aucun utilisateur trouvé"}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage; 