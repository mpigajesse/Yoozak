"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  BuildingOfficeIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  UserGroupIcon
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

interface Service {
  id: number;
  nom: string;
  description: string;
  pole?: {
    id: number;
    nom: string;
    code: string;
  };
  team_count?: number;
  user_count?: number;
}

interface Pole {
  id: number;
  nom: string;
  code: string;
  description: string;
}

const defaultServiceFormData = {
  id: 0,
  nom: "",
  description: "",
  pole_id: 0
};

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [poles, setPoles] = useState<Pole[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPoles, setLoadingPoles] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<any>(defaultServiceFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [poleFilter, setPoleFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
    fetchPoles();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
      
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
      setError("Une erreur est survenue lors du chargement des services.");
      setServices(getMockServices());
      setLoading(false);
    }
  };

  const fetchPoles = async () => {
    try {
      setLoadingPoles(true);
      
      try {
        // Récupération des pôles depuis l'API
        const data = await apiService.organisation.getPoles();
        // Assurer que les données retournées sont dans un format exploitable
        const polesData = Array.isArray(data) ? data : (data && typeof data === 'object' && 'results' in data ? data.results : []);
        setPoles(polesData as Pole[]);
      } catch (apiError) {
        console.error("Erreur lors de la récupération des pôles:", apiError);
        // En cas d'erreur, utiliser des données simulées pour le développement
        const mockData = getMockPoles();
        setPoles(mockData);
      }
      
      setLoadingPoles(false);
    } catch (error) {
      console.error("Erreur lors du chargement des pôles:", error);
      setPoles(getMockPoles());
      setLoadingPoles(false);
    }
  };

  // Données simulées pour le développement
  const getMockServices = (): Service[] => {
    return [
      { 
        id: 1, 
        nom: "Support Client", 
        description: "Service d'assistance aux clients",
        pole: {
          id: 1,
          nom: "Clients",
          code: "CLIENTS"
        },
        team_count: 2,
        user_count: 12
      },
      { 
        id: 2, 
        nom: "Catalogues", 
        description: "Gestion des catalogues produits",
        pole: {
          id: 3,
          nom: "Produits",
          code: "PRODUCTS"
        },
        team_count: 1,
        user_count: 5
      },
      { 
        id: 3, 
        nom: "Inventaire", 
        description: "Gestion des stocks et inventaires",
        pole: {
          id: 3,
          nom: "Produits",
          code: "PRODUCTS"
        },
        team_count: 1,
        user_count: 3
      },
      { 
        id: 4, 
        nom: "Facturation", 
        description: "Service de facturation et comptabilité",
        pole: {
          id: 2,
          nom: "Commandes",
          code: "COMMANDES"
        },
        team_count: 1,
        user_count: 4
      },
      { 
        id: 5, 
        nom: "Livraison", 
        description: "Service de livraison et suivi",
        pole: {
          id: 2,
          nom: "Commandes",
          code: "COMMANDES"
        },
        team_count: 2,
        user_count: 8
      }
    ];
  };

  const getMockPoles = (): Pole[] => {
    return [
      { id: 1, nom: "Clients", code: "CLIENTS", description: "Gestion de la relation client" },
      { id: 2, nom: "Commandes", code: "COMMANDES", description: "Gestion des commandes et livraisons" },
      { id: 3, nom: "Produits", code: "PRODUCTS", description: "Gestion du catalogue et des produits" }
    ];
  };

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      // Mode édition
      setFormData({
        id: service.id,
        nom: service.nom,
        description: service.description,
        pole_id: service.pole?.id || 0
      });
      setIsEditing(true);
      setCurrentServiceId(service.id);
    } else {
      // Mode création
      setFormData(defaultServiceFormData);
      setIsEditing(false);
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setFormData(defaultServiceFormData);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setCurrentServiceId(id);
    setShowDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setCurrentServiceId(null);
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
      if (isEditing && currentServiceId) {
        // Mode édition
        try {
          await apiService.organisation.updateService(currentServiceId, formData);
          
          // Récupérer le pôle associé
          const pole = poles.find(p => p.id === formData.pole_id);
          
          // Mise à jour locale
          setServices(prev => prev.map(service => 
            service.id === currentServiceId ? { 
              ...service, 
              ...formData,
              pole: pole ? {
                id: pole.id,
                nom: pole.nom,
                code: pole.code
              } : undefined
            } : service
          ));
        } catch (apiError) {
          console.error("Erreur lors de la mise à jour du service:", apiError);
          setError("Erreur lors de la mise à jour du service.");
        }
      } else {
        // Mode création
        try {
          const newService = await apiService.organisation.createService(formData);
          // Convertir la réponse en objet Service
          const createdService: Service = {
            id: typeof newService === 'object' && newService !== null && 'id' in newService ? Number(newService.id) : Math.round(Math.random() * 1000),
            nom: formData.nom,
            description: formData.description,
            pole: poles.find(p => p.id === formData.pole_id),
            team_count: 0,
            user_count: 0
          };
          // Ajout local avec type correct
          setServices(prev => [...prev, createdService]);
        } catch (apiError) {
          console.error("Erreur lors de la création du service:", apiError);
          setError("Erreur lors de la création du service.");
          
          // Pour le développement, on ajoute quand même des données simulées
          const newId = Math.max(...services.map(s => s.id), 0) + 1;
          const pole = poles.find(p => p.id === formData.pole_id);
          
          setServices(prev => [...prev, { 
            id: newId, 
            nom: formData.nom, 
            description: formData.description,
            pole: pole ? {
              id: pole.id,
              nom: pole.nom,
              code: pole.code
            } : undefined,
            team_count: 0,
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
    if (!currentServiceId) return;
    
    try {
      try {
        await apiService.organisation.deleteService(currentServiceId);
      } catch (apiError) {
        console.error("Erreur lors de la suppression du service:", apiError);
        setError("Erreur lors de la suppression du service.");
      }
      
      // Suppression locale
      setServices(prev => prev.filter(service => service.id !== currentServiceId));
      
      // Fermer le dialogue
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Erreur:", error);
      setError("Une erreur inattendue est survenue lors de la suppression.");
    }
  };

  // Filtrage des services selon la recherche et le filtre de pôle
  const filteredServices = services.filter(service => {
    const searchMatch = 
      service.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (service.pole?.nom && service.pole.nom.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const poleMatch = 
      !poleFilter || 
      (service.pole && service.pole.id.toString() === poleFilter);
    
    return searchMatch && poleMatch;
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Services</h1>
            </div>
            <p className="text-gray-600">
              Créez et gérez les services de votre organisation.
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouveau Service
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
                placeholder="Rechercher un service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-1/2">
              <Select value={poleFilter || ""} onValueChange={(value) => setPoleFilter(value || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par pôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Tous les pôles</SelectItem>
                  {poles.map((pole) => (
                    <SelectItem key={pole.id} value={pole.id.toString()}>
                      {pole.nom}
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
            <p className="mt-4 text-gray-600">Chargement des services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <BuildingOfficeIcon className="h-16 w-16 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun service trouvé</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || poleFilter
                ? "Aucun service ne correspond à vos critères de recherche." 
                : "Vous n'avez pas encore créé de service. Commencez par en créer un !"}
            </p>
            {!searchTerm && !poleFilter && (
              <Button onClick={() => handleOpenDialog()} className="mt-4">
                <PlusIcon className="h-5 w-5 mr-2" />
                Créer un service
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{service.nom}</h3>
                      {service.pole && (
                        <Badge className={getPoleColor(service.pole.code)}>
                          <BuildingOfficeIcon className="h-3 w-3 mr-1" />
                          {service.pole.nom}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOpenDialog(service)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleOpenDeleteDialog(service.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      <span>{service.team_count || 0} Équipes</span>
                    </div>
                    <div>
                      <span>{service.user_count || 0} Utilisateurs</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                    onClick={() => router.push(`/organisation/services/${service.id}/teams`)}
                  >
                    Gérer les équipes
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
            <DialogTitle>{isEditing ? "Modifier le service" : "Créer un nouveau service"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Modifiez les informations du service existant." 
                : "Remplissez les informations pour créer un nouveau service."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nom">Nom du service</Label>
                <Input
                  id="nom"
                  name="nom"
                  placeholder="ex: Support Client"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="pole_id">Pôle</Label>
                <Select 
                  value={formData.pole_id ? formData.pole_id.toString() : "0"} 
                  onValueChange={(value) => handleSelectChange("pole_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un pôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingPoles ? (
                      <SelectItem value="loading" disabled>Chargement des pôles...</SelectItem>
                    ) : poles.length === 0 ? (
                      <SelectItem value="none" disabled>Aucun pôle disponible</SelectItem>
                    ) : (
                      poles.map((pole) => (
                        <SelectItem key={pole.id} value={pole.id.toString()}>
                          {pole.nom}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {poles.length === 0 && !loadingPoles && (
                  <p className="text-xs text-yellow-600">
                    Vous devez d'abord créer des pôles avant de pouvoir créer des services.
                  </p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Description du service et de ses responsabilités"
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
                disabled={!formData.pole_id || formData.pole_id === 0}
              >
                {isEditing ? "Enregistrer les modifications" : "Créer le service"}
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
              Êtes-vous sûr de vouloir supprimer ce service ? Cette action ne peut pas être annulée.
              Toutes les équipes associées à ce service seront également supprimées.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
              <div>
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Attention : </span>
                  La suppression d'un service affectera tous les utilisateurs qui y sont rattachés.
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