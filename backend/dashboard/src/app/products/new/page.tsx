"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Save, Trash2, X, Plus, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

const categories = ["Baskets", "Escarpins", "Bottines", "Sandales", "Mocassins", "Ballerines"];
const origines = ["Vietnam", "Chine", "Italie", "Portugal", "Espagne", "France", "Maroc"];
const pointures = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];
const couleurs = ["Noir", "Blanc", "Rouge", "Bleu", "Vert", "Marron", "Beige", "Gris", "Rose"];

const NewProductPage = () => {
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  // État pour le formulaire
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'dateCreation'>>({
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
  }, []);

  // Gestionnaires de changement pour les champs de base
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'prix' || name === 'stock' ? parseFloat(value) : value
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
    // Vérifier si le nom est vide
    if (!name) {
      return `NEW-${color.substring(0, 3).toUpperCase()}-${size}`;
    }
    
    const prefix = name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').substring(0, 3);
    const colorCode = color.substring(0, 3).toUpperCase();
    return `${prefix}-${colorCode}-${size}`;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation de base
    if (!formData.nom) {
      setErrorMessage("Le nom du produit est requis.");
      return;
    }
    
    if (formData.prix <= 0) {
      setErrorMessage("Le prix doit être supérieur à 0.");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simuler un délai d'enregistrement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dans un cas réel, appel API ici
      console.log("Données envoyées:", {
        ...formData,
        id: Math.floor(Math.random() * 1000) + 10, // Simuler un nouvel ID
        dateCreation: new Date().toISOString().split('T')[0]
      });
      
      // Redirection après création
      router.push('/products');
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      setErrorMessage("Une erreur est survenue lors de la création du produit.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => router.push('/products')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              Nouveau produit
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                  Création...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Créer le produit
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
                    Nom du produit <span className="text-red-500">*</span>
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
                    Prix (€) <span className="text-red-500">*</span>
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
                    Catégorie <span className="text-red-500">*</span>
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
                    Stock initial <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    required
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
              {formData.creatives && formData.creatives.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {formData.creatives.map((creative) => (
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
              ) : (
                <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-md mb-4">
                  <p className="text-gray-500 dark:text-gray-400">Aucun média ajouté</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Ajoutez des photos ou vidéos de votre produit</p>
                </div>
              )}
              
              <Button type="button" variant="outline" className="w-full" onClick={() => {
                // Dans un cas réel, cette fonction ouvrirait un sélecteur de fichiers
                // Simulation d'un ajout de média
                const newId = Math.max(0, ...(formData.creatives?.map(c => c.id) || [])) + 1;
                
                setFormData(prev => ({
                  ...prev,
                  creatives: [
                    ...(prev.creatives || []),
                    {
                      id: newId,
                      type_creative: "photo",
                      url: `/products/new-image-${newId}.jpg`
                    }
                  ]
                }));
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
              {formData.articles && formData.articles.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Couleur</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pointure</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code Barre</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {formData.articles.map((article) => (
                        <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{article.couleur}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{article.pointure}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-mono text-xs">{article.code_bar}</td>
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
              ) : (
                <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                  <p className="text-gray-500 dark:text-gray-400">Aucune variante ajoutée</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Utilisez le formulaire ci-dessous pour ajouter des variantes</p>
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
                        Couleur <span className="text-red-500">*</span>
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
                        Pointure <span className="text-red-500">*</span>
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

export default NewProductPage; 