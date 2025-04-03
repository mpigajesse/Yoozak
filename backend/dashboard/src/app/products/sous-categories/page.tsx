"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Search, Edit, Trash2, Plus, Tag, FolderTree } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SousCategorie {
  id: number;
  nom: string;
  description: string;
  slug: string;
  categorieParentId: number;
  categorieParentNom: string;
  nombreProduits: number;
  dateCreation: string;
  estActive: boolean;
}

// Données fictives
const sousCategories: SousCategorie[] = [
  {
    id: 1,
    nom: "Running",
    description: "Chaussures adaptées à la course à pied",
    slug: "running",
    categorieParentId: 1,
    categorieParentNom: "Sportives",
    nombreProduits: 42,
    dateCreation: "2023-03-15",
    estActive: true
  },
  {
    id: 2,
    nom: "Training",
    description: "Chaussures pour l'entraînement en salle",
    slug: "training",
    categorieParentId: 1,
    categorieParentNom: "Sportives",
    nombreProduits: 28,
    dateCreation: "2023-03-15",
    estActive: true
  },
  {
    id: 3,
    nom: "Randonnée",
    description: "Chaussures pour la randonnée en montagne",
    slug: "randonnee",
    categorieParentId: 1,
    categorieParentNom: "Sportives",
    nombreProduits: 36,
    dateCreation: "2023-03-20",
    estActive: true
  },
  {
    id: 4,
    nom: "Derbies",
    description: "Chaussures de ville élégantes à lacets",
    slug: "derbies",
    categorieParentId: 2,
    categorieParentNom: "Ville",
    nombreProduits: 19,
    dateCreation: "2023-04-01",
    estActive: true
  },
  {
    id: 5,
    nom: "Mocassins",
    description: "Chaussures de ville sans lacets",
    slug: "mocassins",
    categorieParentId: 2,
    categorieParentNom: "Ville",
    nombreProduits: 23,
    dateCreation: "2023-04-05",
    estActive: true
  },
  {
    id: 6,
    nom: "Espadrilles",
    description: "Chaussures légères en toile pour l'été",
    slug: "espadrilles",
    categorieParentId: 3,
    categorieParentNom: "Été",
    nombreProduits: 15,
    dateCreation: "2023-04-15",
    estActive: true
  },
  {
    id: 7,
    nom: "Sandales",
    description: "Chaussures ouvertes pour les journées chaudes",
    slug: "sandales",
    categorieParentId: 3,
    categorieParentNom: "Été",
    nombreProduits: 27,
    dateCreation: "2023-04-15",
    estActive: true
  },
  {
    id: 8,
    nom: "Bottes",
    description: "Chaussures montantes pour l'hiver",
    slug: "bottes",
    categorieParentId: 4,
    categorieParentNom: "Hiver",
    nombreProduits: 31,
    dateCreation: "2023-04-20",
    estActive: true
  }
];

const SousCategoriesPage = () => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [donneesSousCategories, setDonneesSousCategories] = useState<SousCategorie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtreCategorie, setFiltreCategorie] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    // Simuler le chargement des données
    setTimeout(() => {
      setDonneesSousCategories(sousCategories);
      setIsLoading(false);
    }, 500);
  }, []);

  // Obtenir les catégories uniques pour le filtre
  const categoriesUniques = Array.from(
    new Set(donneesSousCategories.map(item => item.categorieParentId))
  ).map(categorieId => {
    const categorie = donneesSousCategories.find(item => item.categorieParentId === categorieId);
    return {
      id: categorieId,
      nom: categorie ? categorie.categorieParentNom : ''
    };
  });

  // Filtrer les sous-catégories
  const sousCategorieFiltrees = donneesSousCategories.filter(sousCategorie => {
    const matchesSearch = 
      sousCategorie.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sousCategorie.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategorie = filtreCategorie === null || sousCategorie.categorieParentId === filtreCategorie;
    
    return matchesSearch && matchesCategorie;
  });

  // Supprimer une sous-catégorie
  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette sous-catégorie ?")) {
      setDonneesSousCategories(prev => prev.filter(item => item.id !== id));
    }
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="text-gray-500 dark:text-gray-400">Chargement des sous-catégories...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Sous-catégories</h1>
          <Button>
            <FolderTree className="mr-2 h-4 w-4" />
            Nouvelle sous-catégorie
          </Button>
        </div>

        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Rechercher une sous-catégorie..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
              value={filtreCategorie || ""}
              onChange={(e) => setFiltreCategorie(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Toutes les catégories</option>
              {categoriesUniques.map((categorie) => (
                <option key={categorie.id} value={categorie.id}>
                  {categorie.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grille de sous-catégories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sousCategorieFiltrees.length > 0 ? (
            sousCategorieFiltrees.map((sousCategorie) => (
              <Card key={sousCategorie.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{sousCategorie.nom}</h3>
                      <Badge variant="outline" className="mb-2">
                        {sousCategorie.categorieParentNom}
                      </Badge>
                    </div>
                    <Badge variant="secondary">
                      {sousCategorie.nombreProduits} produits
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-3 line-clamp-2">
                    {sousCategorie.description}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>Créée le {new Date(sousCategorie.dateCreation).toLocaleDateString('fr-FR')}</span>
                    <span className="mx-2">•</span>
                    <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs">
                      {sousCategorie.slug}
                    </code>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-4 flex justify-end space-x-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-500 dark:text-red-400"
                    onClick={() => handleDelete(sousCategorie.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-3 p-8 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <FolderTree className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-1">Aucune sous-catégorie trouvée</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Aucune sous-catégorie ne correspond à vos critères de recherche.
              </p>
              <Button onClick={() => { setSearchQuery(''); setFiltreCategorie(null); }}>
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SousCategoriesPage; 