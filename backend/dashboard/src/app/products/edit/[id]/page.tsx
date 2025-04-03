"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Save, Trash2, X, Plus, FileText, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

// Types des données
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

// Données fictives des produits
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

const categories = ["Baskets", "Escarpins", "Bottines", "Sandales", "Mocassins", "Ballerines"];
const origines = ["Vietnam", "Chine", "Italie", "Portugal", "Espagne", "France", "Maroc"];
const pointures = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];
const couleurs = ["Noir", "Blanc", "Rouge", "Bleu", "Vert", "Marron", "Beige", "Gris", "Rose"];

const EditProductPage = () => {
  const params = useParams();
  const productId = Number(params.id);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  // État pour le formulaire
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'dateCreation'> & { id?: number, dateCreation?: string }>({
    nom: "",
    prix: 0,
    description: "",
    type_de_semelle: "",
    matieres_premieres: "",
    origine: "",
    categorie: "",
    stock: 0,
    status: 'active',
    articles: [],
    creatives: []
  });

  // État pour les variantes temporaires en cours d'édition
  const [newArticle, setNewArticle] = useState<Omit<Article, 'id' | 'date_achat'>>({
    couleur: "",
    pointure: "",
    code_bar: ""
  });

  useEffect(() => {
    setMounted(true);
    // Simuler le chargement des données
    setTimeout(() => {
      const foundProduct = productsData.find(p => p.id === productId);
      if (foundProduct) {
        setFormData({
          ...foundProduct
        });
      }
      setIsLoading(false);
    }, 500);
  }, [productId]);

  // Gestionnaires de changement pour les champs de base
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'prix' || name === 'stock' ? parseFloat(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gestion des articles (variantes)
  const handleArticleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewArticle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddArticle = () => {
    if (!newArticle.couleur || !newArticle.pointure) {
      setErrorMessage("La couleur et la pointure sont requises pour ajouter une variante.");
      return;
    }

    // Générer un code-barre si non spécifié
    const codeBar = newArticle.code_bar || generateCodeBar(formData.nom, newArticle.couleur, newArticle.pointure);

    const newId = Math.max(0, ...(formData.articles?.map(a => a.id) || [])) + 1;
    
    setFormData(prev => ({
      ...prev,
      articles: [
        ...(prev.articles || []),
        {
          id: newId,
          couleur: newArticle.couleur,
          pointure: newArticle.pointure,
          code_bar: codeBar,
          date_achat: new Date().toISOString().split('T')[0]
        }
      ]
    }));

    // Réinitialiser le formulaire d'ajout de variante
    setNewArticle({
      couleur: "",
      pointure: "",
      code_bar: ""
    });
    setErrorMessage(null);
  };

  const handleRemoveArticle = (id: number) => {
    setFormData(prev => ({
      ...prev,
      articles: prev.articles?.filter(a => a.id !== id) || []
    }));
  };

  // Génération d'un code-barre basé sur le nom du produit, la couleur et la pointure
  const generateCodeBar = (name: string, color: string, size: string): string => {
    const prefix = name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').substring(0, 3);
    const colorCode = color.substring(0, 3).toUpperCase();
    return `${prefix}-${colorCode}-${size}`;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Simuler un délai d'enregistrement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dans un cas réel, appel API ici
      console.log("Données envoyées:", formData);
      
      // Redirection après sauvegarde
      router.push(`/products/${productId}`);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      setErrorMessage("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsSaving(false);
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

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => router.push(`/products/${productId}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              Modifier le produit
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-md flex items-start">
            <X className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations principales */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Informations principales</CardTitle>
              <CardDescription>Détails essentiels du produit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="nom" className="block text-sm font-medium">
                    Nom du produit
                  </label>
                  <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Nom du produit"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="prix" className="block text-sm font-medium">
                    Prix (€)
                  </label>
                  <Input
                    id="prix"
                    name="prix"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.prix}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description détaillée du produit"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="categorie" className="block text-sm font-medium">
                    Catégorie
                  </label>
                  <select
                    id="categorie"
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="stock" className="block text-sm font-medium">
                    Stock disponible
                  </label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="origine" className="block text-sm font-medium">
                    Pays d'origine
                  </label>
                  <select
                    id="origine"
                    name="origine"
                    value={formData.origine}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Sélectionner un pays</option>
                    {origines.map((pays) => (
                      <option key={pays} value={pays}>{pays}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="status" className="block text-sm font-medium">
                    Statut
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="type_de_semelle" className="block text-sm font-medium">
                    Type de semelle
                  </label>
                  <Input
                    id="type_de_semelle"
                    name="type_de_semelle"
                    value={formData.type_de_semelle}
                    onChange={handleChange}
                    placeholder="Type de semelle"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="matieres_premieres" className="block text-sm font-medium">
                    Matières premières
                  </label>
                  <Input
                    id="matieres_premieres"
                    name="matieres_premieres"
                    value={formData.matieres_premieres}
                    onChange={handleChange}
                    placeholder="Matières premières"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Médias */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Médias</CardTitle>
              <CardDescription>Photos et vidéos du produit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {formData.creatives && formData.creatives.map((creative) => (
                  <div key={creative.id} className="relative rounded overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-square flex items-center justify-center group">
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
                    <button 
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          creatives: prev.creatives?.filter(c => c.id !== creative.id) || []
                        }));
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              <Button type="button" variant="outline" className="w-full" onClick={() => {
                // Dans un cas réel, cette fonction ouvrirait un sélecteur de fichiers
                alert("Fonctionnalité d'upload non implémentée dans cette démo");
              }}>
                <Upload className="mr-2 h-4 w-4" />
                Ajouter des médias
              </Button>
            </CardContent>
          </Card>

          {/* Variantes */}
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle>Variantes</CardTitle>
              <CardDescription>Différentes versions du produit (couleur, taille, etc.)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tableau des variantes existantes */}
              {formData.articles && formData.articles.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Couleur</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pointure</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code Barre</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date d'ajout</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {formData.articles.map((article) => (
                        <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{article.couleur}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{article.pointure}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-mono text-xs">{article.code_bar}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{new Date(article.date_achat).toLocaleDateString()}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveArticle(article.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Formulaire d'ajout d'article */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ajouter une variante</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="couleur" className="block text-sm font-medium">
                        Couleur
                      </label>
                      <select
                        id="couleur"
                        name="couleur"
                        value={newArticle.couleur}
                        onChange={handleArticleInputChange}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Sélectionner une couleur</option>
                        {couleurs.map((couleur) => (
                          <option key={couleur} value={couleur}>{couleur}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="pointure" className="block text-sm font-medium">
                        Pointure
                      </label>
                      <select
                        id="pointure"
                        name="pointure"
                        value={newArticle.pointure}
                        onChange={handleArticleInputChange}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Sélectionner une pointure</option>
                        {pointures.map((pointure) => (
                          <option key={pointure} value={pointure}>{pointure}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="code_bar" className="block text-sm font-medium">
                        Code barre (optionnel)
                      </label>
                      <Input
                        id="code_bar"
                        name="code_bar"
                        value={newArticle.code_bar}
                        onChange={handleArticleInputChange}
                        placeholder="Généré automatiquement si vide"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={handleAddArticle}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter cette variante
                  </Button>
                </CardFooter>
              </Card>
            </CardContent>
          </Card>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default EditProductPage; 