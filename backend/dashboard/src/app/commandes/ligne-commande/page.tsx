"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Eye, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LigneCommande {
  id: number;
  commandeId: number;
  commandeReference: string;
  produitId: number;
  produitNom: string;
  quantite: number;
  prixUnitaire: number;
  sousTotal: number;
  remise: number | null;
  tva: number;
  statut: 'livrée' | 'en préparation' | 'annulée';
  date: string;
}

// Données fictives pour les lignes de commande
const lignesCommandeData: LigneCommande[] = [
  {
    id: 1,
    commandeId: 1001,
    commandeReference: "CMD-1001",
    produitId: 101,
    produitNom: "Chaussures de running",
    quantite: 1,
    prixUnitaire: 89.99,
    sousTotal: 89.99,
    remise: null,
    tva: 20,
    statut: 'livrée',
    date: "2023-08-15"
  },
  {
    id: 2,
    commandeId: 1001,
    commandeReference: "CMD-1001",
    produitId: 102,
    produitNom: "Chaussettes techniques",
    quantite: 2,
    prixUnitaire: 12.50,
    sousTotal: 25.00,
    remise: 5,
    tva: 20,
    statut: 'livrée',
    date: "2023-08-15"
  },
  {
    id: 3,
    commandeId: 1002,
    commandeReference: "CMD-1002",
    produitId: 103,
    produitNom: "Baskets urbaines",
    quantite: 1,
    prixUnitaire: 75.00,
    sousTotal: 75.00,
    remise: null,
    tva: 20,
    statut: 'en préparation',
    date: "2023-08-18"
  },
  {
    id: 4,
    commandeId: 1003,
    commandeReference: "CMD-1003",
    produitId: 104,
    produitNom: "Chaussures de randonnée",
    quantite: 1,
    prixUnitaire: 120.00,
    sousTotal: 120.00,
    remise: 10,
    tva: 20,
    statut: 'en préparation',
    date: "2023-08-20"
  },
  {
    id: 5,
    commandeId: 1003,
    commandeReference: "CMD-1003",
    produitId: 105,
    produitNom: "Semelles gel",
    quantite: 1,
    prixUnitaire: 18.50,
    sousTotal: 18.50,
    remise: null,
    tva: 20,
    statut: 'en préparation',
    date: "2023-08-20"
  },
  {
    id: 6,
    commandeId: 1004,
    commandeReference: "CMD-1004",
    produitId: 106,
    produitNom: "Chaussures de ville",
    quantite: 1,
    prixUnitaire: 95.00,
    sousTotal: 95.00,
    remise: null,
    tva: 20,
    statut: 'annulée',
    date: "2023-08-22"
  },
  {
    id: 7,
    commandeId: 1005,
    commandeReference: "CMD-1005",
    produitId: 107,
    produitNom: "Mocassins cuir",
    quantite: 1,
    prixUnitaire: 110.00,
    sousTotal: 110.00,
    remise: null,
    tva: 20,
    statut: 'en préparation',
    date: "2023-08-25"
  },
  {
    id: 8,
    commandeId: 1006,
    commandeReference: "CMD-1006",
    produitId: 108,
    produitNom: "Espadrilles",
    quantite: 2,
    prixUnitaire: 35.00,
    sousTotal: 70.00,
    remise: 5,
    tva: 20,
    statut: 'livrée',
    date: "2023-08-27"
  }
];

const LignesCommandePage = () => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lignesCommande, setLignesCommande] = useState<LigneCommande[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof LigneCommande>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    setMounted(true);
    // Simuler le chargement des données
    setTimeout(() => {
      setLignesCommande(lignesCommandeData);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filtrer les lignes de commande en fonction de la recherche
  const filteredLignesCommande = lignesCommande.filter((ligne) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      ligne.commandeReference.toLowerCase().includes(searchTerm) ||
      ligne.produitNom.toLowerCase().includes(searchTerm) ||
      ligne.statut.toLowerCase().includes(searchTerm)
    );
  });

  // Trier les lignes de commande
  const sortedLignesCommande = [...filteredLignesCommande].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });

  // Formater le prix en euros
  const formatPrix = (prix: number) => {
    return `${prix.toFixed(2)} €`;
  };

  // Gérer le changement de tri
  const handleSort = (field: keyof LigneCommande) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Badge de statut
  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'livrée':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-500">Livrée</Badge>;
      case 'en préparation':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-500">En préparation</Badge>;
      case 'annulée':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-500">Annulée</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800/30 dark:text-gray-400">{statut}</Badge>;
    }
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="text-gray-500 dark:text-gray-400">Chargement des lignes de commande...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Lignes de commande</h1>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Rechercher par référence, produit ou statut..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tableau des lignes de commande */}
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-800">
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('commandeReference')}
                  >
                    <div className="flex items-center gap-1">
                      Référence
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('produitNom')}
                  >
                    <div className="flex items-center gap-1">
                      Produit
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('quantite')}
                  >
                    <div className="flex items-center gap-1">
                      Qté
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('prixUnitaire')}
                  >
                    <div className="flex items-center gap-1">
                      Prix unitaire
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('sousTotal')}
                  >
                    <div className="flex items-center gap-1">
                      Sous-total
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('statut')}
                  >
                    <div className="flex items-center gap-1">
                      Statut
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedLignesCommande.length > 0 ? (
                  sortedLignesCommande.map((ligne) => (
                    <tr key={ligne.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-sm font-medium">{ligne.commandeReference}</td>
                      <td className="px-4 py-3 text-sm">{ligne.produitNom}</td>
                      <td className="px-4 py-3 text-sm">{ligne.quantite}</td>
                      <td className="px-4 py-3 text-sm">{formatPrix(ligne.prixUnitaire)}</td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {formatPrix(ligne.sousTotal)}
                        {ligne.remise && <span className="text-green-600 text-xs ml-2">(-{ligne.remise}%)</span>}
                      </td>
                      <td className="px-4 py-3 text-sm">{getStatusBadge(ligne.statut)}</td>
                      <td className="px-4 py-3 text-sm">{new Date(ligne.date).toLocaleDateString('fr-FR')}</td>
                      <td className="px-4 py-3 text-sm text-right">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      Aucune ligne de commande trouvée.
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

export default LignesCommandePage; 