"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Edit, Trash2, Plus, FolderPlus } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: number;
  nom: string;
  description: string;
  slug: string;
  parentId: number | null;
  nombreProduits: number;
  dateCreation: string;
}

// Données fictives
const categoriesData: Category[] = [
  {
    id: 1,
    nom: "Baskets",
    description: "Chaussures de sport et baskets tendance",
    slug: "baskets",
    parentId: null,
    nombreProduits: 42,
    dateCreation: "2023-01-15"
  },
  {
    id: 2,
    nom: "Escarpins",
    description: "Escarpins élégants pour femme",
    slug: "escarpins",
    parentId: null,
    nombreProduits: 28,
    dateCreation: "2023-01-15"
  },
  {
    id: 3,
    nom: "Bottines",
    description: "Bottines pour homme et femme",
    slug: "bottines",
    parentId: null,
    nombreProduits: 35,
    dateCreation: "2023-01-20"
  },
  {
    id: 4,
    nom: "Sandales",
    description: "Sandales d'été et tongs",
    slug: "sandales",
    parentId: null,
    nombreProduits: 23,
    dateCreation: "2023-02-05"
  },
  {
    id: 5,
    nom: "Mocassins",
    description: "Mocassins et chaussures de ville",
    slug: "mocassins",
    parentId: null,
    nombreProduits: 19,
    dateCreation: "2023-02-12"
  },
  {
    id: 6,
    nom: "Ballerines",
    description: "Ballerines et chaussures plates pour femme",
    slug: "ballerines",
    parentId: null,
    nombreProduits: 17,
    dateCreation: "2023-02-20"
  }
];

const CategoriesPage = () => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    // Simuler le chargement des données
    setTimeout(() => {
      setCategories(categoriesData);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filtrer les catégories par le terme de recherche
  const filteredCategories = categories.filter(category => 
    category.nom.toLowerCase().includes(searchQuery.toLowerCase()) || 
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Supprimer une catégorie
  const handleDeleteCategory = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="text-gray-500 dark:text-gray-400">Chargement des catégories...</p>
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
          <h1 className="text-2xl font-bold tracking-tight">Catégories de produits</h1>
          <Button>
            <FolderPlus className="mr-2 h-4 w-4" />
            Nouvelle catégorie
          </Button>
        </div>

        {/* Barre de recherche */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Rechercher une catégorie..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Liste des catégories */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{category.nom}</h3>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{category.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Slug: {category.slug}</span>
                      <span>{category.nombreProduits} produits</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                    Créée le: {new Date(category.dateCreation).toLocaleDateString('fr-FR')}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-md">
              <p className="text-gray-500 dark:text-gray-400">Aucune catégorie trouvée</p>
              <Button variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Créer une catégorie
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CategoriesPage; 