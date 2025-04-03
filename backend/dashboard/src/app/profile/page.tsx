"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiLock, FiSave, FiArrowLeft, FiEdit, FiClock, FiEye, FiEyeOff, FiRefreshCw, FiShield, FiUsers } from "react-icons/fi";
import { toast } from "react-toastify";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, getUserInfo, updateUserInfo } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [groupNames, setGroupNames] = useState<Record<number, string>>({});
  const [permissionNames, setPermissionNames] = useState<Record<number, string>>({});
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    password_confirm: ""
  });
  
  // Fonction pour récupérer les noms des groupes et permissions
  const fetchAdditionalInfo = async () => {
    if (!user) return;
    
    try {
      // Pour les groupes, nous utilisons des noms codés en dur pour l'instant
      const hardcodedGroups: Record<number, string> = {
        1: "Administrateurs",
        2: "Editeurs",
        3: "Clients Premium"
      };
      setGroupNames(hardcodedGroups);
      
      // Pour les permissions, nous utilisons des noms codés en dur pour l'instant
      const hardcodedPermissions: Record<number, string> = {
        1: "add_logentry",
        2: "change_logentry",
        3: "delete_logentry",
        4: "view_logentry",
        5: "add_permission",
        6: "change_permission",
        7: "delete_permission",
        8: "view_permission"
      };
      setPermissionNames(hardcodedPermissions);
      
      /* Commenté jusqu'à ce que les endpoints fonctionnent
      // Récupérer les noms des groupes si l'utilisateur a des groupes
      if (user.groups && user.groups.length > 0) {
        const response = await apiService.request<{results: Array<{id: number, name: string}>}>({
          url: "/groups/",
          method: "GET"
        });
        
        if (response.results) {
          const groups = response.results.reduce((acc: Record<number, string>, group: {id: number, name: string}) => {
            acc[group.id] = group.name;
            return acc;
          }, {});
          setGroupNames(groups);
        }
      }
      
      // Récupérer les noms des permissions si l'utilisateur a des permissions
      if (user.user_permissions && user.user_permissions.length > 0) {
        const response = await apiService.request<{results: Array<{id: number, codename: string}>}>({
          url: "/permissions/",
          method: "GET"
        });
        
        if (response.results) {
          const permissions = response.results.reduce((acc: Record<number, string>, perm: {id: number, codename: string}) => {
            acc[perm.id] = perm.codename;
            return acc;
          }, {});
          setPermissionNames(permissions);
        }
      }
      */
    } catch (error) {
      console.error("Erreur lors de la récupération des informations supplémentaires:", error);
    }
  };
  
  // Fonction pour actualiser les informations de l'utilisateur depuis l'API
  const refreshUserInfo = async () => {
    try {
      await getUserInfo();
      
      // Récupérer les informations supplémentaires
      await fetchAdditionalInfo();
    } catch (error) {
      console.error("Erreur d'actualisation:", error);
    }
  };
  
  useEffect(() => {
    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!token) {
      router.push("/login");
      return;
    }
    
    // Actualiser les informations de l'utilisateur au chargement de la page
    refreshUserInfo();
  }, [token, router]);
  
  useEffect(() => {
    // Si les données utilisateur sont disponibles, les utiliser pour initialiser le formulaire
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        password: "",
        password_confirm: ""
      });
      
      // Récupérer les informations supplémentaires
      fetchAdditionalInfo();
    }
  }, [user]);
  
  const toggleEditing = () => {
    setEditing(!editing);
    // Réinitialiser les mots de passe lors du basculement
    if (!editing) {
      setFormData({
        ...formData,
        password: "",
        password_confirm: ""
      });
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider que les mots de passe correspondent s'ils sont renseignés
    if (formData.password && formData.password !== formData.password_confirm) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    
    // Validation supplémentaire du mot de passe si fourni
    if (formData.password) {
      // Vérifier la longueur minimale
      if (formData.password.length < 8) {
        toast.error("Le mot de passe doit contenir au moins 8 caractères");
        return;
      }
      
      // Vérifier qu'il n'est pas entièrement numérique
      if (/^\d+$/.test(formData.password)) {
        toast.error("Le mot de passe ne peut pas être entièrement numérique");
        return;
      }
      
      // Vérifier qu'il n'est pas trop similaire aux informations personnelles
      if (
        formData.password.toLowerCase().includes(formData.username.toLowerCase()) ||
        formData.password.toLowerCase().includes(formData.firstName.toLowerCase()) ||
        formData.password.toLowerCase().includes(formData.lastName.toLowerCase())
      ) {
        toast.error("Le mot de passe ne doit pas être similaire à vos informations personnelles");
        return;
      }
    }
    
    setLoading(true);
    
    try {
      // Préparer les données à envoyer à l'API
      const payload = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        ...(formData.password ? { password: formData.password } : {})
      };
      
      // Mettre à jour les informations utilisateur
      await updateUserInfo(payload);
      
      // Rafraîchir les informations utilisateur pour s'assurer que les changements sont visibles
      await refreshUserInfo();
      
      toast.success("Profil mis à jour avec succès");
      setEditing(false);
      
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error(error.response?.data?.detail || "Une erreur est survenue lors de la mise à jour du profil");
    } finally {
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Obtenir le libellé du rôle en fonction des permissions
  const getRoleLabel = () => {
    if (!user) return "Utilisateur";
    
    if (user.isSuperuser) return "Super Administrateur";
    if (user.isStaff) return "Administrateur";
    return "Utilisateur";
  };
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div
          className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 border-gray-200 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-center text-gray-600 dark:text-gray-300">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mon Profil</h1>
            <p className="text-gray-600 dark:text-gray-400">Gérez vos informations personnelles</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              color="secondary"
              size="md"
              withMotion
              className="flex items-center gap-2 rounded-lg px-4 py-2 font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              onClick={() => router.push('/dashboard')}
              leftIcon={<FiArrowLeft size={18} />}
            >
              Retour
            </Button>
            <Button
              variant={editing ? "ghost" : "primary"}
              color={editing ? "secondary" : "edit"}
              size="md"
              withMotion
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 font-medium",
                editing 
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  : "bg-indigo-700 text-white hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-700"
              )}
              onClick={toggleEditing}
              leftIcon={editing ? <FiArrowLeft size={18} /> : <FiEdit size={18} />}
            >
              {editing ? "Annuler" : "Modifier"}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Carte d'info principale */}
          <div
            className="col-span-1 h-fit rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800"
          >
            <div className="flex flex-col items-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-yoozak-100 text-yoozak-600 dark:bg-yoozak-900/30 dark:text-yoozak-400">
                {user?.firstName ? (
                  <span className="text-4xl font-bold">
                    {user.firstName.charAt(0).toUpperCase()}
                    {user.lastName && user.lastName.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <span className="text-4xl font-bold">
                    {user?.username?.charAt(0).toUpperCase() || "A"}
                  </span>
                )}
              </div>
              
              <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username || "Admin"}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-400">{user?.email || ""}</p>
              
              <div className="mt-6 w-full border-t border-gray-200 pt-4 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FiUser className="text-gray-500 dark:text-gray-400" />
                  <span>Username:</span>
                  <span className="font-medium">{user?.username || ""}</span>
                </div>
                
                <div className="mt-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FiClock className="text-gray-500 dark:text-gray-400" />
                  <span>Rôle:</span>
                  <span className="font-medium">
                    {getRoleLabel()}
                  </span>
                </div>
                
                {user?.lastLogin && (
                  <div className="mt-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FiClock className="text-gray-500 dark:text-gray-400" />
                    <span>Dernière connexion:</span>
                    <span className="font-medium">
                      {new Date(user.lastLogin).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
                
                {user?.dateJoined && (
                  <div className="mt-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FiClock className="text-gray-500 dark:text-gray-400" />
                    <span>Date d'inscription:</span>
                    <span className="font-medium">
                      {new Date(user.dateJoined).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
                
                <div className="mt-4">
                  <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Permissions</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        user?.isSuperuser ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      )} />
                      <span className={cn(
                        "text-sm",
                        user?.isSuperuser 
                          ? "text-gray-800 dark:text-gray-200" 
                          : "text-gray-500 dark:text-gray-400"
                      )}>
                        Super Admin
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        user?.isStaff ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      )} />
                      <span className={cn(
                        "text-sm",
                        user?.isStaff 
                          ? "text-gray-800 dark:text-gray-200" 
                          : "text-gray-500 dark:text-gray-400"
                      )}>
                        Staff
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        user?.isActive ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      )} />
                      <span className={cn(
                        "text-sm",
                        user?.isActive
                          ? "text-gray-800 dark:text-gray-200" 
                          : "text-gray-500 dark:text-gray-400"
                      )}>
                        Actif
                      </span>
                    </div>
                  </div>
                </div>

                {user?.groups && user.groups.length > 0 && (
                  <div className="mt-4">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <FiUsers className="text-gray-500 dark:text-gray-400" />
                      Groupes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.groups.map((group: string, index: number) => (
                        <span 
                          key={index}
                          className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-400"
                        >
                          {group}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {user?.userPermissions && user.userPermissions.length > 0 && (
                  <div className="mt-4">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <FiShield className="text-gray-500 dark:text-gray-400" />
                      Permissions spécifiques
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.userPermissions.length <= 10 ? (
                        user.userPermissions.map((permission: string, index: number) => (
                          <span 
                            key={index}
                            className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/40 dark:text-purple-400"
                            title={`Permission: ${permission}`}
                          >
                            {permission}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {user.userPermissions.length} permissions assignées
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Formulaire de modification */}
          <div 
            className="col-span-1 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800 md:col-span-2"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
              {editing ? "Modifier les informations" : "Informations personnelles"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Prénom
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                      <FiUser size={16} />
                    </span>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!editing || loading}
                      className={cn(
                        "w-full rounded-lg border border-gray-300 bg-transparent py-2 pl-10 pr-4 text-gray-800 transition-colors",
                        "focus:border-yoozak-500 focus:ring-2 focus:ring-yoozak-500/20 disabled:cursor-not-allowed disabled:opacity-70",
                        "dark:border-gray-600 dark:text-white dark:focus:border-yoozak-400 dark:focus:ring-yoozak-400/20"
                      )}
                      placeholder="Prénom"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nom
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                      <FiUser size={16} />
                    </span>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!editing || loading}
                      className={cn(
                        "w-full rounded-lg border border-gray-300 bg-transparent py-2 pl-10 pr-4 text-gray-800 transition-colors",
                        "focus:border-yoozak-500 focus:ring-2 focus:ring-yoozak-500/20 disabled:cursor-not-allowed disabled:opacity-70",
                        "dark:border-gray-600 dark:text-white dark:focus:border-yoozak-400 dark:focus:ring-yoozak-400/20"
                      )}
                      placeholder="Nom"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                    <FiMail size={16} />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editing || loading}
                    className={cn(
                      "w-full rounded-lg border border-gray-300 bg-transparent py-2 pl-10 pr-4 text-gray-800 transition-colors",
                      "focus:border-yoozak-500 focus:ring-2 focus:ring-yoozak-500/20 disabled:cursor-not-allowed disabled:opacity-70",
                      "dark:border-gray-600 dark:text-white dark:focus:border-yoozak-400 dark:focus:ring-yoozak-400/20"
                    )}
                    placeholder="Email"
                  />
                </div>
              </div>
              
              {editing && (
                <>
                  <div>
                    <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nouveau mot de passe (optionnel)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                        <FiLock size={16} />
                      </span>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        className={cn(
                          "w-full rounded-lg border border-gray-300 bg-transparent py-2 pl-10 pr-10 text-gray-800 transition-colors",
                          "focus:border-yoozak-500 focus:ring-2 focus:ring-yoozak-500/20 disabled:cursor-not-allowed disabled:opacity-70",
                          "dark:border-gray-600 dark:text-white dark:focus:border-yoozak-400 dark:focus:ring-yoozak-400/20"
                        )}
                        placeholder="Laisser vide pour ne pas changer"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
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
                  
                  <div>
                    <label htmlFor="password_confirm" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirmer le mot de passe
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                        <FiLock size={16} />
                      </span>
                      <input
                        id="password_confirm"
                        name="password_confirm"
                        type={showPassword ? "text" : "password"}
                        value={formData.password_confirm}
                        onChange={handleChange}
                        disabled={loading}
                        className={cn(
                          "w-full rounded-lg border border-gray-300 bg-transparent py-2 pl-10 pr-10 text-gray-800 transition-colors",
                          "focus:border-yoozak-500 focus:ring-2 focus:ring-yoozak-500/20 disabled:cursor-not-allowed disabled:opacity-70",
                          "dark:border-gray-600 dark:text-white dark:focus:border-yoozak-400 dark:focus:ring-yoozak-400/20"
                        )}
                        placeholder="Confirmez le nouveau mot de passe"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>
                </>
              )}
              
              {editing && (
                <Button
                  type="submit"
                  variant="primary"
                  color="save"
                  size="lg"
                  fullWidth
                  withMotion
                  isLoading={loading}
                  leftIcon={<FiSave size={18} />}
                >
                  Enregistrer les modifications
                </Button>
              )}
            </form>
          </div>
        </div>

        <div className="mt-4 flex w-full items-center justify-center">
          <Button
            variant="outline"
            color="info"
            size="md"
            withMotion
            onClick={refreshUserInfo}
            leftIcon={<FiRefreshCw size={18} className={cn(isRefreshing && "animate-spin")} />}
            isLoading={isRefreshing}
          >
            Actualiser les informations
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
} 