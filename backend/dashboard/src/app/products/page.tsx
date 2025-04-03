"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Edit, Trash2, Search, Plus, Filter } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Types des données
interface Product {
  id: number;
  nom: string;
  prix: number;
  description: string;
  type_de_semelle: string;
  matieres_premieres: string;
  origine: string;
  categorie: string;
  stock: number;
  status: 'active' | 'inactive';
  dateCreation: string;
}

// Données fictives des produits
const productsData: Product[] = [
  {
    id: 1,
    nom: "Baskets Urban Trend",
    prix: 89.99,
    description: "Baskets urbaines au design moderne et confortable pour tous les jours.",
    type_de_semelle: "Caoutchouc EVA",
    matieres_premieres: "Cuir synthétique, mesh respirant",
    origine: "Vietnam",
    categorie: "Baskets",
    stock: 32,
    status: 'active',
    dateCreation: "2023-05-15"
  },
  {
    id: 2,
    nom: "Escarpins Élégance",
    prix: 129.99,
    description: "Escarpins classiques pour une allure élégante en toutes circonstances.",
    type_de_semelle: "Cuir véritable",
    matieres_premieres: "Cuir pleine fleur, doublure en cuir",
    origine: "Italie",
    categorie: "Escarpins",
    stock: 18,
    status: 'active',
    dateCreation: "2023-04-22"
  },
  {
    id: 3,
    nom: "Bottines Chelsea",
    prix: 149.99,
    description: "Bottines Chelsea en cuir de qualité supérieure, parfaites pour l'automne.",
    type_de_semelle: "Caoutchouc naturel",
    matieres_premieres: "Cuir pleine fleur, doublure en cuir",
    origine: "Portugal",
    categorie: "Bottines",
    stock: 24,
    status: 'active',
    dateCreation: "2023-04-10"
  },
  {
    id: 4,
    nom: "Sandales Tropicales",
    prix: 69.99,
    description: "Sandales légères et colorées pour l'été, avec semelle confortable.",
    type_de_semelle: "EVA",
    matieres_premieres: "Tissu synthétique, PVC",
    origine: "Chine",
    categorie: "Sandales",
    stock: 42,
    status: 'active',
    dateCreation: "2023-03-15"
  },
  {
    id: 5,
    nom: "Mocassins Business",
    prix: 109.99,
    description: "Mocassins élégants pour une allure professionnelle et confortable.",
    type_de_semelle: "Cuir véritable",
    matieres_premieres: "Cuir pleine fleur",
    origine: "Italie",
    categorie: "Mocassins",
    stock: 15,
    status: 'active',
    dateCreation: "2023-05-05"
  },
  {
    id: 6,
    nom: "Baskets Performance",
    prix: 119.99,
    description: "Baskets haute performance pour le sport et les activités physiques.",
    type_de_semelle: "Caoutchouc absorbant",
    matieres_premieres: "Mesh technique, renfort en TPU",
    origine: "Vietnam",
    categorie: "Baskets",
    stock: 28,
    status: 'active',
    dateCreation: "2023-04-18"
  },
  {
    id: 7,
    nom: "Ballerines Confort",
    prix: 59.99,
    description: "Ballerines souples et confortables pour une utilisation quotidienne.",
    type_de_semelle: "Caoutchouc souple",
    matieres_premieres: "Cuir synthétique, doublure en textile",
    origine: "Espagne",
    categorie: "Ballerines",
    stock: 35,
    status: 'active',
    dateCreation: "2023-03-28"
  },
  {
    id: 8,
    nom: "Bottines Western",
    prix: 159.99,
    description: "Bottines de style western avec détails caractéristiques et cuir de qualité.",
    type_de_semelle: "Cuir et caoutchouc",
    matieres_premieres: "Cuir pleine fleur, doublure en cuir",
    origine: "Mexique",
    categorie: "Bottines",
    stock: 12,
    status: 'active',
    dateCreation: "2023-05-02"
  },
  {
    id: 9,
    nom: "Escarpins Soirée",
    prix: 139.99,
    description: "Escarpins élégants pour les occasions spéciales avec détails brillants.",
    type_de_semelle: "Cuir véritable",
    matieres_premieres: "Satin, cristaux décoratifs",
    origine: "Italie",
    categorie: "Escarpins",
    stock: 20,
    status: 'active',
    dateCreation: "2023-04-15"
  },
  {
    id: 10,
    nom: "Sandales Confort",
    prix: 79.99,
    description: "Sandales anatomiques offrant un excellent soutien pour la marche.",
    type_de_semelle: "Liège naturel",
    matieres_premieres: "Cuir véritable, semelle en liège",
    origine: "Espagne",
    categorie: "Sandales",
    stock: 22,
    status: 'active',
    dateCreation: "2023-03-20"
  }
];

const ProductsPage = () => {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Simuler le chargement des données
    setTimeout(() => {
      setProducts(productsData);
      setFilteredProducts(productsData);
      setIsLoading(false);
    }, 800);
  }, []);

  // Gestion de la recherche et des filtres
  useEffect(() => {
    if (products.length > 0) {
      let filtered = [...products];
      
      // Filtrer par termes de recherche
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          product => 
            product.nom.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query) ||
            product.categorie.toLowerCase().includes(query)
        );
      }
      
      // Filtrer par catégorie
      if (categoryFilter) {
        filtered = filtered.filter(product => product.categorie === categoryFilter);
      }
      
      setFilteredProducts(filtered);
    }
  }, [searchQuery, categoryFilter, products]);

  // Récupération des catégories uniques
  const categories = Array.from(new Set(products.map(product => product.categorie)));

  // Formatage du prix avec le symbole €
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  // Supprimer un produit
  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      setFilteredProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    }
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="text-gray-500 dark:text-gray-400">Chargement des produits...</p>
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
          <h1 className="text-2xl font-bold tracking-tight">Gestion des produits</h1>
          <Link href="/products/new" passHref>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau produit
            </Button>
          </Link>
        </div>

        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Rechercher un produit..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tableau des produits */}
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Catégorie</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prix</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium">{product.nom}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {product.description}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{product.categorie}</td>
                      <td className="px-4 py-3 text-sm font-medium">{formatPrice(product.prix)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`${product.stock < 20 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                          {product.stock} unités
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/products/${product.id}`} passHref>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4 text-blue-500" />
                            </Button>
                          </Link>
                          <Link href={`/products/edit/${product.id}`} passHref>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4 text-orange-500" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      Aucun produit trouvé pour cette recherche.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage; 