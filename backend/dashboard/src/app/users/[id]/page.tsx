"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import apiService from '@/services/api';
import Link from 'next/link';
import { getInitials, cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

interface UserPageProps {
  params: {
    id: string;
  };
}

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
  groups: string[];
  user_permissions: string[];
}

export default function UserDetailsPage({ params }: UserPageProps) {
  const router = useRouter();
  const { id } = params;
  const currentUser = useAuthStore((state) => state.user);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiService.get(`/api/users/${id}/`);
        setUser(response);
      } catch (error) {
        console.error("Erreur lors de la récupération des informations utilisateur:", error);
        toast.error("Impossible de charger les informations de l'utilisateur");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      await apiService.remove(`/api/users/delete/${user.id}/`);
      toast.success("L'utilisateur a été supprimé avec succès");
      router.push('/users');
    } catch (error: any) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      const errorMessage = error.response?.data?.detail || "Une erreur est survenue lors de la suppression de l'utilisateur";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Jamais";
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (user: User) => {
    if (user.is_superuser) {
      return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-500">Super Administrateur</Badge>;
    } else if (user.is_staff) {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-500">Administrateur</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300">Utilisateur</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-500">Actif</Badge>;
    } else {
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-500">Inactif</Badge>;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="text-gray-500 dark:text-gray-400">Chargement des informations utilisateur...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-bold">Utilisateur non trouvé</h2>
          <p className="text-gray-500 dark:text-gray-400">L'utilisateur que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button onClick={() => router.push('/users')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const userFullName = user.first_name && user.last_name 
    ? `${user.first_name} ${user.last_name}` 
    : user.username;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Détails de l'utilisateur</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/users')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour
            </Button>
            <Link href={`/users/${id}/edit`} passHref>
              <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" /> Modifier
              </Button>
            </Link>
            {currentUser?.isSuperuser && user.id !== currentUser.id && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Carte d'informations générales */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {getInitials(userFullName)}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h2 className="text-xl font-semibold">{userFullName}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getRoleBadge(user)}
                    {getStatusBadge(user.is_active)}
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nom d'utilisateur</p>
                    <p className="mt-1">{user.username}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                    <p className="mt-1">{user.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date d'inscription</p>
                    <p className="mt-1">{formatDate(user.date_joined)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Dernière connexion</p>
                    <p className="mt-1">{formatDate(user.last_login)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Carte des permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* États et rôles */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium">États</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <div className={cn(
                      "mr-2 h-3 w-3 rounded-full",
                      user.is_active ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                    )} />
                    <span>Actif</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={cn(
                      "mr-2 h-3 w-3 rounded-full",
                      user.is_staff ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                    )} />
                    <span>Administrateur</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={cn(
                      "mr-2 h-3 w-3 rounded-full",
                      user.is_superuser ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                    )} />
                    <span>Super administrateur</span>
                  </div>
                </div>
              </div>
              
              {/* Groupes */}
              {user.groups && user.groups.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Groupes</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.groups.map((group, index) => (
                      <Badge key={index} variant="secondary">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Permissions */}
              {user.user_permissions && user.user_permissions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Permissions spécifiques</h3>
                  {user.user_permissions.length <= 10 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.user_permissions.map((permission, index) => (
                        <Badge key={index} variant="outline">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.user_permissions.length} permissions assignées
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Modal de confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold mb-4 text-red-600 dark:text-red-500">Confirmer la suppression</h3>
              <p className="mb-6">
                Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userFullName}</strong> ? 
                Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Annuler
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 