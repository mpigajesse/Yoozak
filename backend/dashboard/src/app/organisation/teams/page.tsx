"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  UserGroupIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BuildingOfficeIcon
} from "@heroicons/react/24/outline";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { apiService } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Team {
  id: number;
  nom: string;
  description: string;
  service?: {
    id: number;
    nom: string;
    pole?: {
      id: number;
      nom: string;
      code: string;
    }
  };
  user_count?: number;
}

interface Service {
  id: number;
  nom: string;
  pole?: {
    id: number;
    nom: string;
    code: string;
  };
}

const defaultTeamFormData = {
  id: 0,
  nom: "",
  description: "",
  service_id: 0
};

export default function TeamsPage() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<any>(defaultTeamFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeamId, setCurrentTeamId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
    fetchServices();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Récupération des équipes depuis l'API
        const data = await apiService.organisation.getTeams();
        // Assurer que les données retournées sont dans un format exploitable
        const teamsData = Array.isArray(data) ? data : (data && typeof data === 'object' && 'results' in data ? data.results : []);
        setTeams(teamsData as Team[]);
      } catch (apiError) {
        console.error("Erreur lors de la récupération des équipes:", apiError);
        // En cas d'erreur, utiliser des données simulées pour le développement
        const mockData = getMockTeams();
        setTeams(mockData);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des équipes:", error);
      setError("Une erreur est survenue lors du chargement des équipes.");
      setTeams(getMockTeams());
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      
      try {
        // Récupération des services depuis l'API
        const data = await apiService.organisation.getServices();
        // Assurer que les données retournées sont dans un format exploitable
        const servicesData = Array.isArray(data) ? data : (data && typeof data === 'object' && 'results' in data ? data.results : []);
        setServices(servicesData as Service[]);
      } catch (apiError) {
        console.error("Erreur lors de la récupération des services:", apiError);
        // En cas d'erreur, utiliser des données simulées pour le développement
        const mockData = getMockServices();
        setServices(mockData);
      }
      
      setLoadingServices(false);
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
      setServices(getMockServices());
      setLoadingServices(false);
    }
  };

  // Données simulées pour le développement
  const getMockTeams = (): Team[] => {
    return [
      { 
        id: 1, 
        nom: "Équipe Support Niveau 1", 
        description: "Support client de premier niveau",
        service: {
          id: 1,
          nom: "Support Client",
          pole: {
            id: 1,
            nom: "Clients",
            code: "CLIENTS"
          }
        },
        user_count: 8
      },
      { 
        id: 2, 
        nom: "Équipe Support Niveau 2", 
        description: "Support client de second niveau pour problèmes complexes",
        service: {
          id: 1,
          nom: "Support Client",
          pole: {
            id: 1,
            nom: "Clients",
            code: "CLIENTS"
          }
        },
        user_count: 4
      },
      { 
        id: 3, 
        nom: "Équipe Catalogue France", 
        description: "Gestion du catalogue français",
        service: {
          id: 2,
          nom: "Catalogues",
          pole: {
            id: 3,
            nom: "Produits",
            code: "PRODUCTS"
          }
        },
        user_count: 5
      },
      { 
        id: 4, 
        nom: "Équipe Logistique Paris", 
        description: "Gestion des expéditions région parisienne",
        service: {
          id: 5,
          nom: "Livraison",
          pole: {
            id: 2,
            nom: "Commandes",
            code: "COMMANDES"
          }
        },
        user_count: 6
      }
    ];
  };

  const getMockServices = (): Service[] => {
    return [
      { id: 1, nom: "Support Client", pole: { id: 1, nom: "Clients", code: "CLIENTS" } },
      { id: 2, nom: "Catalogues", pole: { id: 3, nom: "Produits", code: "PRODUCTS" } },
      { id: 3, nom: "Inventaire", pole: { id: 3, nom: "Produits", code: "PRODUCTS" } },
      { id: 4, nom: "Facturation", pole: { id: 2, nom: "Commandes", code: "COMMANDES" } },
      { id: 5, nom: "Livraison", pole: { id: 2, nom: "Commandes", code: "COMMANDES" } }
    ];
  };

  const handleOpenDialog = (team?: Team) => {
    if (team) {
      // Mode édition
      setFormData({
        id: team.id,
        nom: team.nom,
        description: team.description,
        service_id: team.service?.id || 0
      });
      setIsEditing(true);
      setCurrentTeamId(team.id);
    } else {
      // Mode création
      setFormData(defaultTeamFormData);
      setIsEditing(false);
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setFormData(defaultTeamFormData);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setCurrentTeamId(id);
    setShowDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setCurrentTeamId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentTeamId) {
        // Mode édition
        try {
          await apiService.organisation.updateTeam(currentTeamId, formData);
          
          // Récupérer le service associé
          const service = services.find(s => s.id === formData.service_id);
          
          // Mise à jour locale
          setTeams(prev => prev.map(team => 
            team.id === currentTeamId ? { 
              ...team, 
              ...formData,
              service: service ? {
                id: service.id,
                nom: service.nom,
                pole: service.pole
              } : undefined
            } : team
          ));
        } catch (apiError) {
          console.error("Erreur lors de la mise à jour de l'équipe:", apiError);
          setError("Erreur lors de la mise à jour de l'équipe.");
        }
      } else {
        // Mode création
        try {
          const newTeam = await apiService.organisation.createTeam(formData);
          // Convertir la réponse en un objet Team attendu
          const createdTeam: Team = {
            id: (typeof newTeam === 'object' && newTeam !== null && 'id' in newTeam) ? 
                (newTeam as {id: number}).id : 
                Math.round(Math.random() * 1000),
            nom: formData.nom,
            description: formData.description,
            service: services.find(s => s.id === formData.service_id),
            user_count: 0
          };
          // Ajout local avec type correct
          setTeams(prev => [...prev, createdTeam]);
        } catch (apiError) {
          console.error("Erreur lors de la création de l'équipe:", apiError);
          setError("Erreur lors de la création de l'équipe.");
          
          // Pour le développement, on ajoute quand même des données simulées
          const newId = Math.max(...teams.map(t => t.id), 0) + 1;
          const service = services.find(s => s.id === formData.service_id);
          
          setTeams(prev => [...prev, { 
            id: newId, 
            nom: formData.nom, 
            description: formData.description,
            service: service ? {
              id: service.id,
              nom: service.nom,
              pole: service.pole
            } : undefined,
            user_count: 0
          }]);
        }
      }
      
      // Fermer le dialogue
      handleCloseDialog();
    } catch (error) {
      console.error("Erreur:", error);
      setError("Une erreur inattendue est survenue");
    }
  };

  const handleDelete = async () => {
    if (!currentTeamId) return;
    
    try {
      try {
        await apiService.organisation.deleteTeam(currentTeamId);
      } catch (apiError) {
        console.error("Erreur lors de la suppression de l'équipe:", apiError);
        setError("Erreur lors de la suppression de l'équipe.");
      }
      
      // Suppression locale
      setTeams(prev => prev.filter(team => team.id !== currentTeamId));
      
      // Fermer le dialogue
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Erreur:", error);
      setError("Une erreur inattendue est survenue lors de la suppression.");
    }
  };

  // Filtrage des équipes selon la recherche et le filtre de service
  const filteredTeams = teams.filter(team => {
    const searchMatch = 
      team.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (team.description && team.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (team.service?.nom && team.service.nom.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const serviceMatch = 
      !serviceFilter || 
      (team.service && team.service.id.toString() === serviceFilter);
    
    return searchMatch && serviceMatch;
  });

  // Couleurs associées aux pôles
  const getPoleColor = (code?: string) => {
    if (!code) return "bg-gray-100 text-gray-800 border-gray-200";
    
    const colors: Record<string, string> = {
      "CLIENTS": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "COMMANDES": "bg-blue-100 text-blue-800 border-blue-200",
      "PRODUCTS": "bg-emerald-100 text-emerald-800 border-emerald-200"
    };
    
    return colors[code] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="mb-2"
                onClick={() => router.push('/organisation')}
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Retour
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Équipes</h1>
            </div>
            <p className="text-gray-600">
              Créez et gérez les équipes de votre organisation.
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouvelle Équipe
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              <p className="font-medium">Erreur</p>
            </div>
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <Input
                placeholder="Rechercher une équipe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-1/2">
              <Select value={serviceFilter || "_all"} onValueChange={(value) => setServiceFilter(value === "_all" ? null : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Tous les services</SelectItem>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.nom} {service.pole ? `(${service.pole.nom})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
            <p className="mt-4 text-gray-600">Chargement des équipes...</p>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <UserGroupIcon className="h-16 w-16 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune équipe trouvée</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || serviceFilter
                ? "Aucune équipe ne correspond à vos critères de recherche." 
                : "Vous n'avez pas encore créé d'équipe. Commencez par en créer une !"}
            </p>
            {!searchTerm && !serviceFilter && (
              <Button onClick={() => handleOpenDialog()} className="mt-4">
                <PlusIcon className="h-5 w-5 mr-2" />
                Créer une équipe
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{team.nom}</h3>
                      {team.service && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {team.service.pole && (
                            <Badge className={getPoleColor(team.service.pole.code)}>
                              <BuildingOfficeIcon className="h-3 w-3 mr-1" />
                              {team.service.pole.nom}
                            </Badge>
                          )}
                          <Badge className="bg-white text-gray-700 border border-gray-300">
                            {team.service.nom}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOpenDialog(team)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleOpenDeleteDialog(team.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{team.description}</p>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      <span>{team.user_count || 0} Membres</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                    onClick={() => router.push(`/organisation/teams/${team.id}/members`)}
                  >
                    Gérer les membres
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogue de création/édition */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Modifier l'équipe" : "Créer une nouvelle équipe"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Modifiez les informations de l'équipe existante." 
                : "Remplissez les informations pour créer une nouvelle équipe."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nom">Nom de l'équipe</Label>
                <Input
                  id="nom"
                  name="nom"
                  placeholder="ex: Équipe Support Niveau 1"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="service_id">Service</Label>
                <Select 
                  value={formData.service_id ? formData.service_id.toString() : "0"} 
                  onValueChange={(value) => handleSelectChange("service_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingServices ? (
                      <SelectItem value="loading" disabled>Chargement des services...</SelectItem>
                    ) : services.length === 0 ? (
                      <SelectItem value="none" disabled>Aucun service disponible</SelectItem>
                    ) : (
                      services.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.nom} {service.pole ? `(${service.pole.nom})` : ''}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {services.length === 0 && !loadingServices && (
                  <p className="text-xs text-yellow-600">
                    Vous devez d'abord créer des services avant de pouvoir créer des équipes.
                  </p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Description de l'équipe et de ses responsabilités"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Annuler
              </Button>
              <Button 
                type="submit"
                disabled={!formData.service_id || formData.service_id === 0}
              >
                {isEditing ? "Enregistrer les modifications" : "Créer l'équipe"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette équipe ? Cette action ne peut pas être annulée.
              Tous les membres associés à cette équipe seront détachés.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
              <div>
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Attention : </span>
                  La suppression d'une équipe affectera tous les utilisateurs qui y sont rattachés.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDeleteDialog}>
              Annuler
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
} 