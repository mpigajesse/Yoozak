"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Edit, Trash2, Plus, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PromoCode {
  id: number;
  code: string;
  type: 'pourcentage' | 'montant';
  valeur: number;
  dateDebut: string;
  dateFin: string;
  limiteUtilisations: number | null;
  utilisations: number;
  actif: boolean;
}

// Données fictives
const promoCodesData: PromoCode[] = [
  {
    id: 1,
    code: "SUMMER2023",
    type: "pourcentage",
    valeur: 15,
    dateDebut: "2023-06-01",
    dateFin: "2023-08-31",
    limiteUtilisations: 500,
    utilisations: 342,
    actif: true
  },
  {
    id: 2,
    code: "BIENVENUE10",
    type: "pourcentage",
    valeur: 10,
    dateDebut: "2023-01-01",
    dateFin: "2023-12-31",
    limiteUtilisations: null,
    utilisations: 1254,
    actif: true
  },
  {
    id: 3,
    code: "FREESHIP",
    type: "montant",
    valeur: 4.99,
    dateDebut: "2023-04-15",
    dateFin: "2023-10-15",
    limiteUtilisations: 1000,
    utilisations: 678,
    actif: true
  },
  {
    id: 4,
    code: "VIP20",
    type: "pourcentage",
    valeur: 20,
    dateDebut: "2023-03-01",
    dateFin: "2023-05-31",
    limiteUtilisations: 200,
    utilisations: 198,
    actif: false
  },
  {
    id: 5,
    code: "FLASH25",
    type: "pourcentage",
    valeur: 25,
    dateDebut: "2023-05-15",
    dateFin: "2023-05-17",
    limiteUtilisations: 300,
    utilisations: 287,
    actif: false
  },
  {
    id: 6,
    code: "SOLDES10",
    type: "montant",
    valeur: 10,
    dateDebut: "2023-07-01",
    dateFin: "2023-07-31",
    limiteUtilisations: null,
    utilisations: 125,
    actif: true
  }
];

const CodesPromoPage = () => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExpired, setShowExpired] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simuler le chargement des données
    setTimeout(() => {
      setPromoCodes(promoCodesData);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filtrer les codes promo
  const filteredPromoCodes = promoCodes.filter(code => {
    // Filtre par recherche
    const matchesSearch = code.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtre par date d'expiration
    const isExpired = new Date(code.dateFin) < new Date();
    
    return matchesSearch && (showExpired || !isExpired);
  });

  // Formatage des valeurs
  const formatValue = (code: PromoCode) => {
    if (code.type === 'pourcentage') {
      return `${code.valeur}%`;
    } else {
      return `${code.valeur.toFixed(2)} €`;
    }
  };

  // Vérifier si un code est expiré
  const isExpired = (date: string) => {
    return new Date(date) < new Date();
  };

  // Vérifier si un code est actif ou non
  const getStatusBadge = (code: PromoCode) => {
    if (!code.actif) {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800/30 dark:text-gray-400">Inactif</Badge>;
    }
    
    if (isExpired(code.dateFin)) {
      return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-500">Expiré</Badge>;
    }
    
    return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-500">Actif</Badge>;
  };

  // Supprimer un code promo
  const handleDeleteCode = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce code promo ?")) {
      setPromoCodes(prev => prev.filter(code => code.id !== id));
    }
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="text-gray-500 dark:text-gray-400">Chargement des codes promo...</p>
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
          <h1 className="text-2xl font-bold tracking-tight">Codes promo</h1>
          <Button>
            <Tag className="mr-2 h-4 w-4" />
            Nouveau code promo
          </Button>
        </div>

        {/* Filtres */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Rechercher un code promo..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showExpired}
                onChange={() => setShowExpired(!showExpired)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm">Afficher les codes expirés</span>
            </label>
          </div>
        </div>

        {/* Tableau des codes promo */}
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valeur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Période de validité</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Utilisations</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPromoCodes.length > 0 ? (
                  filteredPromoCodes.map((code) => (
                    <tr key={code.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-sm font-medium">{code.code}</td>
                      <td className="px-4 py-3 text-sm capitalize">
                        {code.type}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {formatValue(code)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-col">
                          <span className={isExpired(code.dateFin) ? "text-red-500 dark:text-red-400" : ""}>
                            {new Date(code.dateDebut).toLocaleDateString('fr-FR')} - {new Date(code.dateFin).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {code.utilisations} {code.limiteUtilisations ? `/ ${code.limiteUtilisations}` : ''}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {getStatusBadge(code)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteCode(code.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      Aucun code promo trouvé.
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

export default CodesPromoPage; 