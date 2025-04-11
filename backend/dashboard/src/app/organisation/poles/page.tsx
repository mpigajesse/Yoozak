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
  InformationCircleIcon
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
import { apiService } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Pole {
  id: number;
  nom: string;
  code: string;
  description: string;
  service_count?: number;
  user_count?: number;
}

const defaultPoleFormData = {
  id: 0,
  nom: "",
  code: "",
  description: ""
};

export default function PolesPage() {
  const router = useRouter();
  const [poles, setPoles] = useState<Pole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState<Pole>(defaultPoleFormData);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPoleId, setCurrentPoleId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPoles();
  }, []);

  const fetchPoles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Récupération des pôles depuis l'API
        const data = await apiService.organisation.getPoles();
        setPoles(Array.isArray(data) ? data : (data?.results || []));
      } catch (apiError) {
        console.error("Erreur lors de la récupération des pôles:", apiError);
        // En cas d'erreur, utiliser des données simulées pour le développement
        const mockData = getMockPoles();
        setPoles(mockData);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des pôles:", error);
      setError("Une erreur est survenue lors du chargement des pôles.");
      setPoles(getMockPoles());
      setLoading(false);
    }
  };

  // Données simulées pour le développement
  const getMockPoles = (): Pole[] => {
    return [
      { 
        id: 1, 
        nom: "Clients", 
        code: "CLIENTS", 
        description: "Gestion de la relation client et du support client",
        service_count: 3,
        user_count: 12
      },
      { 
        id: 2, 
        nom: "Commandes", 
        code: "COMMANDES", 
        description: "Traitement des commandes, facturation et logistique",
        service_count: 4,
        user_count: 15
      },
      { 
        id: 3, 
        nom: "Produits", 
        code: "PRODUCTS", 
        description: "Gestion du catalogue et des produits",
        service_count: 2,
        user_count: 8
      }
    ];
  };

  const handleOpenDialog = (pole?: Pole) => {
    if (pole) {
      // Mode édition
      setFormData(pole);
      setIsEditing(true);
      setCurrentPoleId(pole.id);
    } else {
      // Mode création
      setFormData(defaultPoleFormData);
      setIsEditing(false);
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setFormData(defaultPoleFormData);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setCurrentPoleId(id);
    setShowDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setCurrentPoleId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentPoleId) {
        // Mode édition
        try {
          await apiService.organisation.updatePole(currentPoleId, formData);
          // Mise à jour locale
          setPoles(prev => prev.map(pole => 
            pole.id === currentPoleId ? { ...pole, ...formData } : pole
          ));
        } catch (apiError) {
          console.error("Erreur lors de la mise à jour du pôle:", apiError);
          setError("Erreur lors de la mise à jour du pôle.");
        }
      } else {
        // Mode création
        try {
          const newPole = await apiService.organisation.createPole(formData);
          // Ajout local
          setPoles(prev => [...prev, newPole]);
        } catch (apiError) {
          console.error("Erreur lors de la création du pôle:", apiError);
          setError("Erreur lors de la création du pôle.");
          // Pour le développement, on ajoute quand même les données simulées
          const newId = Math.max(...poles.map(p => p.id), 0) + 1;
          setPoles(prev => [...prev, { ...formData, id: newId }]);
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
    if (!currentPoleId) return;
    
    try {
      try {
        await apiService.organisation.deletePole(currentPoleId);
      } catch (apiError) {
        console.error("Erreur lors de la suppression du pôle:", apiError);
        setError("Erreur lors de la suppression du pôle.");
      }
      
      // Suppression locale
      setPoles(prev => prev.filter(pole => pole.id !== currentPoleId));
      
      // Fermer le dialogue
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Erreur:", error);
      setError("Une erreur inattendue est survenue lors de la suppression.");
    }
  };

  // Filtrage des pôles selon la recherche
  const filteredPoles = poles.filter(pole => {
    return pole.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
           pole.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
           pole.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Couleurs associées aux pôles
  const getPoleColor = (code: string) => {
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
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Pôles</h1>
            </div>
            <p className="text-gray-600">
              Créez et gérez les pôles de votre organisation.
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouveau Pôle
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
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-1/2">
              <Input
                placeholder="Rechercher un pôle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 items-center">
              <InformationCircleIcon className="h-5 w-5 text-gray-500" />
              <p className="text-sm text-gray-500">Les pôles sont les grandes divisions de votre organisation.</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
            <p className="mt-4 text-gray-600">Chargement des pôles...</p>
          </div>
        ) : filteredPoles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <BuildingOfficeIcon className="h-16 w-16 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun pôle trouvé</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm 
                ? "Aucun pôle ne correspond à votre recherche." 
                : "Vous n'avez pas encore créé de pôles. Commencez par en créer un !"}
            </p>
            {!searchTerm && (
              <Button onClick={() => handleOpenDialog()} className="mt-4">
                <PlusIcon className="h-5 w-5 mr-2" />
                Créer un pôle
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPoles.map((pole) => (
              <motion.div
                key={pole.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{pole.nom}</h3>
                      <Badge className={`${getPoleColor(pole.code)}`}>
                        {pole.code}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOpenDialog(pole)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleOpenDeleteDialog(pole.id)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{pole.description}</p>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                      <span>{pole.service_count || 0} Services</span>
                    </div>
                    <div>
                      <span>{pole.user_count || 0} Utilisateurs</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                    onClick={() => router.push(`/organisation/poles/${pole.id}/services`)}
                  >
                    Gérer les services
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
            <DialogTitle>{isEditing ? "Modifier le pôle" : "Créer un nouveau pôle"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Modifiez les informations du pôle existant." 
                : "Remplissez les informations pour créer un nouveau pôle."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nom">Nom du pôle</Label>
                <Input
                  id="nom"
                  name="nom"
                  placeholder="ex: Clients"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="code">
                  Code du pôle
                  <span className="text-xs text-gray-500 ml-2">(en majuscules)</span>
                </Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="ex: CLIENTS"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  pattern="[A-Z0-9_]+"
                  title="Le code doit être en majuscules, sans espaces ni caractères spéciaux"
                />
                <p className="text-xs text-gray-500">
                  Format recommandé: lettres majuscules, chiffres et underscores uniquement.
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Description du pôle et de ses responsabilités"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Annuler
              </Button>
              <Button type="submit">
                {isEditing ? "Enregistrer les modifications" : "Créer le pôle"}
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
              Êtes-vous sûr de vouloir supprimer ce pôle ? Cette action ne peut pas être annulée.
              Tous les services associés à ce pôle seront également supprimés.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
              <div>
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Attention : </span>
                  La suppression d'un pôle affectera tous les utilisateurs qui y sont rattachés.
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