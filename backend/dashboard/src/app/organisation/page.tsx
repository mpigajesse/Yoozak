"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  UsersIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
    }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      delay: 0.1,
    }
  }
};

const organisationSections = [
  {
    title: 'Pôles',
    description: 'Gérez les pôles principaux de votre organisation',
    icon: <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />,
    color: 'bg-blue-50 border-blue-200',
    link: '/organisation/poles',
    stats: {
      count: 3,
      items: ['PRODUCTS', 'COMMANDES', 'CLIENTS']
    }
  },
  {
    title: 'Services',
    description: 'Gérez les services au sein de chaque pôle',
    icon: <UserGroupIcon className="h-8 w-8 text-emerald-600" />,
    color: 'bg-emerald-50 border-emerald-200',
    link: '/organisation/services',
    stats: {
      count: 7,
      items: ['Catalogues', 'Inventaire', 'Facturation', 'Livraison', 'Support Client']
    }
  },
  {
    title: 'Équipes',
    description: 'Gérez les équipes opérationnelles dans chaque service',
    icon: <UsersIcon className="h-8 w-8 text-amber-600" />,
    color: 'bg-amber-50 border-amber-200',
    link: '/organisation/teams',
    stats: {
      count: 12,
      items: ['Équipe Catalogue France', 'Équipe Support Niveau 1', 'Équipe Logistique']
    }
  },
];

const OrganisationPage = () => {
  const router = useRouter();
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-800">Organisation</h1>
            <p className="text-gray-600 mt-2">
              Gérez la structure organisationnelle de Yoozak par pôles, services et équipes
            </p>
          </motion.div>
        </header>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {organisationSections.map((section, index) => (
            <motion.div key={section.title} variants={childVariants}>
              <Card className={`h-full border ${section.color}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    {section.icon}
                    <span className="text-sm font-medium text-gray-500 bg-white px-2 py-1 rounded-full border">
                      {section.stats.count}
                    </span>
                  </div>
                  <CardTitle className="mt-4">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {section.stats.items.slice(0, 3).map((item, i) => (
                      <span 
                        key={i} 
                        className="text-xs font-medium bg-white px-2 py-1 rounded-full border"
                      >
                        {item}
                      </span>
                    ))}
                    {section.stats.items.length > 3 && (
                      <span className="text-xs font-medium bg-white px-2 py-1 rounded-full border">
                        +{section.stats.items.length - 3}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    onClick={() => router.push(section.link)}
                    className="w-full justify-between hover:bg-white/50"
                  >
                    Gérer {section.title.toLowerCase()}
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ChartBarIcon className="h-6 w-6 text-gray-600" />
                <CardTitle>Structure Hiérarchique</CardTitle>
              </div>
              <CardDescription>
                Visualisation de la structure organisationnelle de Yoozak
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-white border border-blue-200 rounded-lg mb-4 text-center">
                    <h3 className="font-semibold">Direction Générale</h3>
                  </div>

                  <div className="w-px h-8 bg-gray-300"></div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {/* Pôles */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                      <h3 className="font-semibold text-blue-700">PRODUCTS</h3>
                      <div className="w-full h-px bg-gray-300 my-3"></div>
                      <div className="space-y-2">
                        <div className="p-2 bg-white border border-gray-200 rounded-md text-sm">
                          Catalogues
                        </div>
                        <div className="p-2 bg-white border border-gray-200 rounded-md text-sm">
                          Inventaire
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                      <h3 className="font-semibold text-yellow-700">CLIENTS</h3>
                      <div className="w-full h-px bg-gray-300 my-3"></div>
                      <div className="space-y-2">
                        <div className="p-2 bg-white border border-gray-200 rounded-md text-sm">
                          Support Client
                        </div>
                        <div className="p-2 bg-white border border-gray-200 rounded-md text-sm">
                          Marketing
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                      <h3 className="font-semibold text-emerald-700">COMMANDES</h3>
                      <div className="w-full h-px bg-gray-300 my-3"></div>
                      <div className="space-y-2">
                        <div className="p-2 bg-white border border-gray-200 rounded-md text-sm">
                          Facturation
                        </div>
                        <div className="p-2 bg-white border border-gray-200 rounded-md text-sm">
                          Livraison
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push('/organisation/diagram')}>
                Voir le diagramme complet
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Statistiques d'Organisation</CardTitle>
              <CardDescription>
                Aperçu des statistiques d'organisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total des Pôles</p>
                  <h3 className="text-2xl font-bold">3</h3>
                  <div className="text-sm text-gray-500 mt-2">
                    <span className="text-green-500">100%</span> d'utilisation
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total des Services</p>
                  <h3 className="text-2xl font-bold">7</h3>
                  <div className="text-sm text-gray-500 mt-2">
                    <span className="text-green-500">+2</span> ce mois-ci
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total des Équipes</p>
                  <h3 className="text-2xl font-bold">12</h3>
                  <div className="text-sm text-gray-500 mt-2">
                    <span className="text-green-500">+3</span> ce trimestre
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default OrganisationPage; 