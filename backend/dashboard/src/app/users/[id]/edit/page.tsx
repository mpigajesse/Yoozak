"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import apiService from '@/services/api';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface UserEditPageProps {
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
}

export default function UserEditPage({ params }: UserEditPageProps) {
  const router = useRouter();
  const { id } = params;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'staff', // staff ou superuser
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await apiService.get(`/api/users/${id}/`);
        
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          password: '',
          confirmPassword: '',
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          role: userData.is_superuser ? 'superuser' : 'staff',
          isActive: userData.is_active,
        });
        
        setIsLoading(false);
      } catch (error: any) {
        console.error("Erreur lors de la récupération des informations utilisateur:", error);
        setError("Impossible de charger les informations de l'utilisateur");
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, [id]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }
    
    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    } else if (formData.password && /^\d+$/.test(formData.password)) {
      newErrors.password = "Le mot de passe ne peut pas être entièrement numérique";
    } else if (
      formData.password && (
        formData.password.toLowerCase().includes(formData.username.toLowerCase()) ||
        formData.password.toLowerCase().includes(formData.firstName.toLowerCase()) ||
        formData.password.toLowerCase().includes(formData.lastName.toLowerCase())
      )
    ) {
      newErrors.password = "Le mot de passe ne doit pas être similaire à vos informations personnelles";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Préparer les données pour l'API
      const payload: Record<string, any> = {
        username: formData.username,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        is_active: formData.isActive,
        is_superuser: formData.role === 'superuser',
      };
      
      // Ajouter le mot de passe seulement s'il est fourni
      if (formData.password) {
        payload.password = formData.password;
      }
      
      // Appel à l'API pour mettre à jour l'utilisateur
      await apiService.patch(`/api/users/${id}/`, payload);
      
      toast.success("L'utilisateur a été mis à jour avec succès");
      router.push(`/users/${id}`);
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      const errorMessage = error.response?.data?.detail || "Une erreur est survenue lors de la mise à jour de l'utilisateur";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-bold">Erreur</h2>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
          <Button onClick={() => router.push('/users')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la liste
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Modifier l'utilisateur</h1>
          <div className="flex items-center gap-2">
            <Link href={`/users/${id}`} passHref>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour
              </Button>
            </Link>
          </div>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Informations utilisateur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informations d'identification */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informations d'identification</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input 
                      id="username" 
                      name="username" 
                      value={formData.username} 
                      onChange={handleChange}
                      className={cn(errors.username && "border-red-500")}
                    />
                    {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      className={cn(errors.email && "border-red-500")}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Nouveau mot de passe (facultatif)</Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      value={formData.password} 
                      onChange={handleChange}
                      placeholder="Laisser vide pour ne pas modifier"
                      className={cn(errors.password && "border-red-500")}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mt-1">
                      <p>Le mot de passe doit respecter les critères suivants :</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li>Au moins 8 caractères</li>
                        <li>Ne pas être similaire à vos informations personnelles</li>
                        <li>Ne pas être un mot de passe courant</li>
                        <li>Ne pas être entièrement numérique</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password" 
                      value={formData.confirmPassword} 
                      onChange={handleChange}
                      placeholder="Confirmer le nouveau mot de passe"
                      className={cn(errors.confirmPassword && "border-red-500")}
                      disabled={!formData.password}
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
              
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informations personnelles</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleChange}
                      className={cn(errors.firstName && "border-red-500")}
                    />
                    {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleChange}
                      className={cn(errors.lastName && "border-red-500")}
                    />
                    {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                  </div>
                </div>
              </div>
              
              {/* Rôle et statut */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Rôle et statut</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Select value={formData.role} onValueChange={handleRoleChange}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff">Administrateur</SelectItem>
                        <SelectItem value="superuser">Super Administrateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch 
                        id="status" 
                        checked={formData.isActive} 
                        onCheckedChange={handleSwitchChange}
                      />
                      <Label htmlFor="status" className="cursor-pointer">
                        {formData.isActive ? "Actif" : "Inactif"}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button 
                variant="ghost" 
                onClick={() => router.push(`/users/${id}`)}
                disabled={isSaving}
                type="button"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer les modifications
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
} 