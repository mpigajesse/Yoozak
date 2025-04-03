"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Edit, Trash2, Plus, ArrowUp, ArrowDown, RotateCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EtatCommande {
  id: number;
  nom: string;
  code: string;
  description: string;
  couleur: string;
  ordre: number;
  estActif: boolean;
  nombreCommandes: number;
}

// Données fictives
const etatsCommandeData: EtatCommande[] = [
  {
    id: 1,
    nom: "En attente de paiement",
    code: "PENDING_PAYMENT",
    description: "La commande a été créée mais le paiement n'a pas encore été validé",
    couleur: "gray",
    ordre: 1,
    estActif: true,
    nombreCommandes: 24
  },
  {
    id: 2,
    nom: "Paiement validé",
    code: "PAYMENT_ACCEPTED",
    description: "Le paiement a été accepté, commande prête à être traitée",
    couleur: "green",
    ordre: 2,
    estActif: true,
    nombreCommandes: 18
  },
  {
    id: 3,
    nom: "En préparation",
    code: "PROCESSING",
    description: "La commande est en cours de préparation dans l'entrepôt",
    couleur: "blue",
    ordre: 3,
    estActif: true,
    nombreCommandes: 32
  },
  {
    id: 4,
    nom: "Expédiée",
    code: "SHIPPED",
    description: "La commande a été expédiée au client",
    couleur: "purple",
    ordre: 4,
    estActif: true,
    nombreCommandes: 15
  },
  {
    id: 5,
    nom: "Livrée",
    code: "DELIVERED",
    description: "La commande a été livrée au client",
    couleur: "indigo",
    ordre: 5,
    estActif: true,
    nombreCommandes: 47
  },
  {
    id: 6,
    nom: "Annulée",
    code: "CANCELED",
    description: "La commande a été annulée",
    couleur: "red",
    ordre: 6,
    estActif: true,
    nombreCommandes: 9
  },
  {
    id: 7,
    nom: "Remboursée",
    code: "REFUNDED",
    description: "La commande a été remboursée entièrement",
    couleur: "amber",
    ordre: 7,
    estActif: true,
    nombreCommandes: 5
  },
  {
    id: 8,
    nom: "En litige",
    code: "DISPUTED",
    description: "Un litige a été ouvert pour cette commande",
    couleur: "orange",
    ordre: 8,
    estActif: true,
    nombreCommandes: 3
  }
];

const EtatsCommandePage = () => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [etatsCommande, setEtatsCommande] = useState<EtatCommande[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    // Simuler le chargement des données
    setTimeout(() => {
      // Trier par ordre
      setEtatsCommande([...etatsCommandeData].sort((a, b) => a.ordre - b.ordre));
      setIsLoading(false);
    }, 500);
  }, []);

  // Filtrer les états de commande
  const etatsCommandeFiltres = etatsCommande.filter(etat => 
    etat.nom.toLowerCase().includes(searchQuery.toLowerCase()) || 
    etat.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    etat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Déplacer un état de commande (changer l'ordre)
  const handleMove = (id: number, direction: 'up' | 'down') => {
    const index = etatsCommande.findIndex(etat => etat.id === id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const newEtatsCommande = [...etatsCommande];
      // Échanger les positions
      [newEtatsCommande[index - 1], newEtatsCommande[index]] = [newEtatsCommande[index], newEtatsCommande[index - 1]];
      // Mettre à jour l'ordre
      newEtatsCommande[index - 1].ordre = index;
      newEtatsCommande[index].ordre = index + 1;
      setEtatsCommande(newEtatsCommande);
    }

    if (direction === 'down' && index < etatsCommande.length - 1) {
      const newEtatsCommande = [...etatsCommande];
      // Échanger les positions
      [newEtatsCommande[index], newEtatsCommande[index + 1]] = [newEtatsCommande[index + 1], newEtatsCommande[index]];
      // Mettre à jour l'ordre
      newEtatsCommande[index].ordre = index + 1;
      newEtatsCommande[index + 1].ordre = index + 2;
      setEtatsCommande(newEtatsCommande);
    }
  };

  // Supprimer un état de commande
  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet état de commande ?")) {
      setEtatsCommande(prev => prev.filter(etat => etat.id !== id));
    }
  };

  // Obtenir la couleur de badge pour un état
  const getBadgeColor = (couleur: string) => {
    const colors: Record<string, string> = {
      gray: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300",
      green: "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400",
      blue: "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400",
      purple: "bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-400",
      indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-800/20 dark:text-indigo-400",
      red: "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400",
      amber: "bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400",
      orange: "bg-orange-100 text-orange-800 dark:bg-orange-800/20 dark:text-orange-400"
    };
    
    return colors[couleur] || colors.gray;
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="text-gray-500 dark:text-gray-400">Chargement des états de commande...</p>
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
          <h1 className="text-2xl font-bold tracking-tight">États de commande</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel état
          </Button>
        </div>

        {/* Barre de recherche */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Rechercher un état de commande..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Liste des états de commande */}
        <div className="grid gap-4">
          {etatsCommandeFiltres.length > 0 ? (
            etatsCommandeFiltres.map((etat, index) => (
              <Card key={etat.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 flex items-center">
                    <div className="flex items-center space-x-3 flex-grow">
                      {/* Indicateur d'ordre */}
                      <div className="text-center text-xl font-bold h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        {etat.ordre}
                      </div>
                      
                      {/* Nom et description */}
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{etat.nom}</h3>
                          <Badge className={getBadgeColor(etat.couleur)}>
                            {etat.nombreCommandes} commandes
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">{etat.code}</code>
                          <span className="truncate">{etat.description}</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={index === 0}
                          onClick={() => handleMove(etat.id, 'up')}
                        >
                          <ArrowUp className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={index === etatsCommandeFiltres.length - 1}
                          onClick={() => handleMove(etat.id, 'down')}
                        >
                          <ArrowDown className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(etat.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-md">
              <RotateCw className="mx-auto h-8 w-8 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Aucun état de commande trouvé</p>
              <Button variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Créer un état
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EtatsCommandePage; 