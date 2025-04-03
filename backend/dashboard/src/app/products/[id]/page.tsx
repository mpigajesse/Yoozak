"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2, ShoppingBag, Tag, Box, TrendingUp, Calendar, MapPin, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

// Types basés sur la structure de la base de données
interface Article {
  id: number;
  couleur: string;
  pointure: string;
  code_bar: string;
  date_achat: string;
}

interface Creative {
  id: number;
  type_creative: string;
  url: string;
}

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
  articles?: Article[];
  creatives?: Creative[];
}

// Données fictives des produits (normalement, ces données viendraient d'une API)
const productsData: Product[] = [
  {
    id: 1,
    nom: "Baskets Urban Trend",
    prix: 89.99,
    description: "Baskets urbaines au design moderne et confortable pour tous les jours. Fabriquées avec des matériaux de qualité, ces baskets offrent un confort optimal pour une utilisation quotidienne. La semelle en caoutchouc EVA assure une bonne absorption des chocs, tandis que la tige en mesh respirant permet une bonne ventilation du pied.",
    type_de_semelle: "Caoutchouc EVA",
    matieres_premieres: "Cuir synthétique, mesh respirant",
    origine: "Vietnam",
    categorie: "Baskets",
    stock: 32,
    status: 'active',
    dateCreation: "2023-05-15",
    articles: [
      { id: 1, couleur: "Noir", pointure: "40", code_bar: "BSK-URB-001-40-BLK", date_achat: "2023-04-10" },
      { id: 2, couleur: "Noir", pointure: "41", code_bar: "BSK-URB-001-41-BLK", date_achat: "2023-04-10" },
      { id: 3, couleur: "Noir", pointure: "42", code_bar: "BSK-URB-001-42-BLK", date_achat: "2023-04-10" },
      { id: 4, couleur: "Blanc", pointure: "40", code_bar: "BSK-URB-001-40-WHT", date_achat: "2023-04-15" },
      { id: 5, couleur: "Blanc", pointure: "41", code_bar: "BSK-URB-001-41-WHT", date_achat: "2023-04-15" },
    ],
    creatives: [
      { id: 1, type_creative: "photo", url: "/products/urban-trend-1.jpg" },
      { id: 2, type_creative: "photo", url: "/products/urban-trend-2.jpg" },
      { id: 3, type_creative: "video", url: "/products/urban-trend-video.mp4" },
    ]
  },
  {
    id: 2,
    nom: "Escarpins Élégance",
    prix: 129.99,
    description: "Escarpins classiques pour une allure élégante en toutes circonstances. Ces escarpins en cuir véritable sont parfaits pour les occasions spéciales ou pour le quotidien au bureau. Le talon de 8 cm offre une hauteur idéale, ni trop haute ni trop basse, pour un confort optimal toute la journée.",
    type_de_semelle: "Cuir véritable",
    matieres_premieres: "Cuir pleine fleur, doublure en cuir",
    origine: "Italie",
    categorie: "Escarpins",
    stock: 18,
    status: 'active',
    dateCreation: "2023-04-22",
    articles: [
      { id: 6, couleur: "Noir", pointure: "36", code_bar: "ESC-ELG-002-36-BLK", date_achat: "2023-03-20" },
      { id: 7, couleur: "Noir", pointure: "37", code_bar: "ESC-ELG-002-37-BLK", date_achat: "2023-03-20" },
      { id: 8, couleur: "Noir", pointure: "38", code_bar: "ESC-ELG-002-38-BLK", date_achat: "2023-03-20" },
      { id: 9, couleur: "Rouge", pointure: "36", code_bar: "ESC-ELG-002-36-RED", date_achat: "2023-03-25" },
      { id: 10, couleur: "Rouge", pointure: "37", code_bar: "ESC-ELG-002-37-RED", date_achat: "2023-03-25" },
    ],
    creatives: [
      { id: 4, type_creative: "photo", url: "/products/elegance-1.jpg" },
      { id: 5, type_creative: "photo", url: "/products/elegance-2.jpg" },
    ]
  },
];

const ProductDetailPage = () => {
  const params = useParams();
  const productId = Number(params.id);
  const [mounted, setMounted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Simuler le chargement des données
    setTimeout(() => {
      const foundProduct = productsData.find(p => p.id === productId);
      setProduct(foundProduct || null);
      setIsLoading(false);
    }, 500);
  }, [productId]);

  // Formatage du prix avec le symbole €
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  // Formatage de la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDeleteProduct = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      // Dans un cas réel, appel API ici
      router.push('/products');
    }
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="text-gray-500 dark:text-gray-400">Chargement du produit...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="mb-4 text-5xl font-bold text-gray-300 dark:text-gray-700">404</div>
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Le produit que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Button onClick={() => router.push('/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste des produits
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/products')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">{product.nom}</h1>
            <Badge variant={product.status === 'active' ? 'success' : 'destructive'}>
              {product.status === 'active' ? 'Actif' : 'Inactif'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push(`/products/edit/${product.id}`)}>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteProduct}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations principales */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Informations du produit</CardTitle>
              <CardDescription>Détails et caractéristiques du produit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-base font-medium mb-2 flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-gray-500" />
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Caractéristiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-base font-medium mb-2 flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4 text-gray-500" />
                    Caractéristiques
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="font-medium min-w-32">Catégorie :</span>
                      <span className="text-gray-600 dark:text-gray-400">{product.categorie}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium min-w-32">Type de semelle :</span>
                      <span className="text-gray-600 dark:text-gray-400">{product.type_de_semelle}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium min-w-32">Matières :</span>
                      <span className="text-gray-600 dark:text-gray-400">{product.matieres_premieres}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-medium min-w-32">Origine :</span>
                      <span className="text-gray-600 dark:text-gray-400">{product.origine}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-medium mb-2 flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-gray-500" />
                    Informations commerciales
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="font-medium min-w-32">Prix :</span>
                      <span className="text-gray-600 dark:text-gray-400">{formatPrice(product.prix)}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="font-medium min-w-32">Stock :</span>
                      <span className={`${product.stock < 20 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                        {product.stock} unités
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="font-medium min-w-32">Date de création :</span>
                      <span className="text-gray-600 dark:text-gray-400">{formatDate(product.dateCreation)}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Articles / Variantes */}
              {product.articles && product.articles.length > 0 && (
                <div>
                  <h3 className="text-base font-medium mb-2 flex items-center">
                    <Box className="mr-2 h-4 w-4 text-gray-500" />
                    Variantes ({product.articles.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800">
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Couleur</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pointure</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code Barre</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date d'achat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {product.articles.map((article) => (
                          <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{article.couleur}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{article.pointure}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-mono text-xs">{article.code_bar}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">{formatDate(article.date_achat)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Médias et statistiques */}
          <div className="space-y-6">
            {/* Médias */}
            {product.creatives && product.creatives.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Médias</CardTitle>
                  <CardDescription>{product.creatives.length} fichiers associés</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {product.creatives.map((creative) => (
                      <div key={creative.id} className="relative rounded overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square flex items-center justify-center">
                        {creative.type_creative === 'photo' ? (
                          <div className="text-center text-gray-500 dark:text-gray-400">
                            <span>[Image]</span>
                            <p className="text-xs mt-1">{creative.url.split('/').pop()}</p>
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 dark:text-gray-400">
                            <span>[Vidéo]</span>
                            <p className="text-xs mt-1">{creative.url.split('/').pop()}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
                <CardDescription>Performances du produit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Ventes ce mois</span>
                      <span className="text-sm font-medium">24 unités</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Taux de conversion</span>
                      <span className="text-sm font-medium">8.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Retours</span>
                      <span className="text-sm font-medium">1.4%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Voir rapport complet
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductDetailPage; 