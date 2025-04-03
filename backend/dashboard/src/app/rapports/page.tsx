"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RapportsPage = () => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
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
            <p className="text-gray-500 dark:text-gray-400">Chargement des rapports...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Rapports</h1>
        
        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3 gap-2">
            <TabsTrigger value="sales">Ventes</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="customers">Clients</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ventes mensuelles</CardTitle>
                <CardDescription>Analyse des ventes sur les 6 derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 relative">
                  {/* Graphique en barres simplifié */}
                  <div className="absolute inset-0 flex items-end justify-between pt-10 pb-5">
                    <div className="flex flex-col items-center w-1/6">
                      <div className="bg-primary w-full max-w-[40px] rounded-t-sm" style={{ height: '120px' }}></div>
                      <span className="text-xs mt-2">Jan</span>
                    </div>
                    <div className="flex flex-col items-center w-1/6">
                      <div className="bg-primary w-full max-w-[40px] rounded-t-sm" style={{ height: '190px' }}></div>
                      <span className="text-xs mt-2">Fév</span>
                    </div>
                    <div className="flex flex-col items-center w-1/6">
                      <div className="bg-primary w-full max-w-[40px] rounded-t-sm" style={{ height: '160px' }}></div>
                      <span className="text-xs mt-2">Mar</span>
                    </div>
                    <div className="flex flex-col items-center w-1/6">
                      <div className="bg-primary w-full max-w-[40px] rounded-t-sm" style={{ height: '220px' }}></div>
                      <span className="text-xs mt-2">Avr</span>
                    </div>
                    <div className="flex flex-col items-center w-1/6">
                      <div className="bg-primary w-full max-w-[40px] rounded-t-sm" style={{ height: '250px' }}></div>
                      <span className="text-xs mt-2">Mai</span>
                    </div>
                    <div className="flex flex-col items-center w-1/6">
                      <div className="bg-primary w-full max-w-[40px] rounded-t-sm" style={{ height: '230px' }}></div>
                      <span className="text-xs mt-2">Juin</span>
                    </div>
                  </div>
                  {/* Axe Y */}
                  <div className="absolute left-0 top-0 bottom-5 flex flex-col justify-between items-end pr-2 text-xs text-gray-500">
                    <span>3000€</span>
                    <span>2500€</span>
                    <span>2000€</span>
                    <span>1500€</span>
                    <span>1000€</span>
                    <span>500€</span>
                    <span>0€</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des ventes par catégorie</CardTitle>
                <CardDescription>Pourcentage des ventes par type de produit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex flex-col items-center justify-center">
                  {/* Graphique circulaire simplifié */}
                  <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4">
                    <div className="absolute inset-0 bg-blue-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)' }}></div>
                    <div className="absolute inset-0 bg-green-500" style={{ clipPath: 'polygon(50% 50%, 100% 0, 50% 0, 0 0, 0 50%)' }}></div>
                    <div className="absolute inset-0 bg-yellow-500" style={{ clipPath: 'polygon(50% 50%, 0 50%, 0 0, 50% 0)' }}></div>
                    <div className="absolute inset-0 bg-red-500" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 25%)' }}></div>
                  </div>
                  {/* Légende */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">Chaussures de course (45%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Baskets décontractées (30%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm">Chaussures de ville (15%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm">Sandales (10%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des clients</CardTitle>
                <CardDescription>Nouveaux clients vs clients fidèles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 relative">
                  {/* Graphique linéaire simplifié */}
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 300" preserveAspectRatio="none">
                    {/* Grille */}
                    <g className="grid" stroke="rgba(128,128,128,0.1)">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <line key={`h-${i}`} x1="0" y1={i * 50 + 50} x2="600" y2={i * 50 + 50} />
                      ))}
                      {Array.from({ length: 6 }).map((_, i) => (
                        <line key={`v-${i}`} x1={i * 100 + 50} y1="0" x2={i * 100 + 50} y2="300" />
                      ))}
                    </g>
                    
                    {/* Ligne des nouveaux clients */}
                    <polyline
                      fill="none"
                      stroke="#8884d8"
                      strokeWidth="3"
                      points="50,200 150,180 250,160 350,120 450,100 550,140"
                    />
                    
                    {/* Ligne des clients fidèles */}
                    <polyline
                      fill="none"
                      stroke="#82ca9d"
                      strokeWidth="3"
                      points="50,220 150,210 250,200 350,180 450,170 550,160"
                    />
                  </svg>
                  
                  {/* Légende */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-6">
                    <div className="flex items-center">
                      <div className="w-3 h-0.5 bg-[#8884d8] mr-2"></div>
                      <span className="text-sm">Nouveaux clients</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-0.5 bg-[#82ca9d] mr-2"></div>
                      <span className="text-sm">Clients fidèles</span>
                    </div>
                  </div>
                  
                  {/* Mois sur l'axe X */}
                  <div className="absolute bottom-8 left-0 right-0 flex justify-between px-[50px]">
                    <span className="text-xs">Jan</span>
                    <span className="text-xs">Fév</span>
                    <span className="text-xs">Mar</span>
                    <span className="text-xs">Avr</span>
                    <span className="text-xs">Mai</span>
                    <span className="text-xs">Juin</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default RapportsPage; 