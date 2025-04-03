"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { CardGrid } from '@/components/ui/dashboard/CardGrid';
import { DashboardCard, StatCard } from '@/components/ui/dashboard/DashboardCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  ShoppingBagIcon,
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyEuroIcon,
  TruckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import apiService from '@/services/api';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
  date_joined: string;
  last_login: string;
}

const DashboardPage = () => {
  const [mounted, setMounted] = useState(false);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    const fetchRecentUsers = async () => {
      try {
        // Récupération des utilisateurs récents
        const response = await apiService.get('/api/users/');
        
        // Filtrer les utilisateurs avec last_login et trier par date de dernière connexion
        let users: User[] = [];
        if (Array.isArray(response)) {
          users = response;
        } else if (response.results && Array.isArray(response.results)) {
          users = response.results;
        }
        
        const sortedUsers = users
          .filter((user: User) => user.last_login)
          .sort((a: User, b: User) => new Date(b.last_login).getTime() - new Date(a.last_login).getTime())
          .slice(0, 5); // Prendre les 5 dernières connexions
        
        setRecentUsers(sortedUsers);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs récents:", error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    
    if (mounted) {
      fetchRecentUsers();
    }
  }, [mounted]);

  if (!mounted) return null;

  // Données fictives des statistiques
  const statsData = [
    {
      title: 'Ventes totales',
      value: '28 490 €',
      trend: '+12%',
      trendUp: true,
      icon: <CurrencyEuroIcon className="h-5 w-5" />,
      href: '/rapports/ventes',
    },
    {
      title: 'Nouveaux clients',
      value: '342',
      trend: '+8%',
      trendUp: true,
      icon: <UsersIcon className="h-5 w-5" />,
      href: '/clients',
    },
    {
      title: 'Produits vendus',
      value: '1 259',
      trend: '+24%',
      trendUp: true,
      icon: <ShoppingBagIcon className="h-5 w-5" />,
      href: '/products',
    },
    {
      title: 'Taux de retour',
      value: '1.8%',
      trend: '-0.6%',
      trendUp: false,
      icon: <TruckIcon className="h-5 w-5" />,
      href: '/commandes/retours',
    },
  ];

  // Données fictives pour le graphique de ventes mensuelles
  const monthlySalesData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Ventes 2023',
        data: [1500, 2200, 1800, 2400, 2600, 2300, 2900, 3100, 3400, 3700, 3500, 4200],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Ventes 2022',
        data: [1200, 1900, 1600, 2100, 2200, 2000, 2700, 2800, 3000, 3200, 3300, 3800],
        borderColor: 'rgb(150, 150, 150)',
        backgroundColor: 'rgba(150, 150, 150, 0.5)',
        tension: 0.3,
      },
    ],
  };

  // Données fictives pour le graphique des produits les plus vendus
  const topProductsData = {
    labels: ['Baskets Urban', 'Escarpins Élégance', 'Bottines Chelsea', 'Sandales Tropicales', 'Mocassins Business'],
    datasets: [
      {
        label: 'Unités vendues',
        data: [253, 182, 141, 92, 76],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Données fictives pour le graphique de segmentation des clients
  const customerSegmentationData = {
    labels: ['Nouveaux clients', 'Clients occasionnels', 'Clients réguliers', 'Clients fidèles'],
    datasets: [
      {
        label: 'Répartition des clients',
        data: [120, 198, 143, 98],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Options pour les graphiques
  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

    return (
      <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
            <p className="text-gray-500 dark:text-gray-400">Bienvenue dans l'administration Yoozak</p>
          </div>
          <div className="mt-4 flex gap-2 md:mt-0">
            <Link href="/products/new">
              <Button size="sm">
                <ShoppingBagIcon className="mr-2 h-4 w-4" />
                Ajouter un produit
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, i) => (
          <StatCard
              key={i}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              href={stat.href}
              footer={
                <span className={`flex items-center text-xs ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trendUp ? (
                    <ArrowUpIcon className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDownIcon className="mr-1 h-3 w-3" />
                  )}
                  {stat.trend} depuis le mois dernier
                </span>
              }
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Ventes mensuelles</CardTitle>
              <CardDescription>Évolution des ventes au cours de l'année</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line options={lineOptions} data={monthlySalesData} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segmentation clients</CardTitle>
              <CardDescription>Répartition des types de clients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Doughnut options={doughnutOptions} data={customerSegmentationData} />
              </div>
            </CardContent>
          </Card>
            </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Produits les plus vendus</CardTitle>
              <CardDescription>Top 5 des produits avec le plus d'unités vendues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar options={barOptions} data={topProductsData} />
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Dernières connexions</CardTitle>
                <CardDescription>Connexions récentes des utilisateurs</CardDescription>
              </div>
              <ClockIcon className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
              ) : recentUsers.length > 0 ? (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <span className="text-sm font-medium text-primary">
                            {getInitials(user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username)}
                          </span>
                  </div>
                        <div>
                          <Link href={`/users/${user.id}`} className="text-sm font-medium hover:underline">
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}`
                              : user.username}
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(user.last_login)}
                    </p>
                  </div>
                      </div>
                      <Link href={`/users/${user.id}`}>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Voir le profil</span>
                          <ArrowUpIcon className="h-4 w-4 rotate-45" />
                        </Button>
                      </Link>
                  </div>
              ))}
            </div>
              ) : (
                <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  Aucune connexion récente
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage; 
