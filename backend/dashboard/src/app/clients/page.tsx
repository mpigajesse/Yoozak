"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Search } from 'lucide-react';
import Link from 'next/link';

const ClientsPage = () => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Simuler le chargement des données
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="text-gray-500 dark:text-gray-400">Chargement des clients...</p>
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
          <h1 className="text-2xl font-bold tracking-tight">Gestion des clients</h1>
          <Link href="/clients/nouveau" passHref>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nouveau client
            </Button>
          </Link>
        </div>

        {/* Barre de recherche */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Rechercher un client..."
            className="pl-10"
          />
        </div>

        {/* Contenu de la page */}
        <div className="rounded-md border p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Simulation : Page de gestion des clients. Aucune donnée disponible pour le moment.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientsPage; 