"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SettingsPage = () => {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Composant checkbox stylisé pour remplacer Switch
  const ToggleSwitch = ({ 
    id, 
    checked, 
    onChange 
  }: { 
    id: string, 
    checked: boolean, 
    onChange: (checked: boolean) => void 
  }) => (
    <div className="relative inline-flex h-6 w-11 items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        className="flex h-6 w-11 cursor-pointer items-center rounded-full bg-gray-300 p-1 transition-colors duration-300 ease-in-out peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20"
      >
        <span className="h-4 w-4 rounded-full bg-white transition-transform duration-300 ease-in-out peer-checked:translate-x-5" />
      </label>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 gap-2">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
                <CardDescription>
                  Gérez les paramètres généraux de votre compte et de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="language">Langue</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      La langue principale de l'interface
                    </p>
                  </div>
                  <div>
                    <select 
                      id="language" 
                      className="p-2 border rounded bg-background"
                      defaultValue="fr"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Le fuseau horaire pour toutes les dates affichées
                    </p>
                  </div>
                  <div>
                    <select 
                      id="timezone" 
                      className="p-2 border rounded bg-background"
                      defaultValue="Europe/Paris"
                    >
                      <option value="Europe/Paris">Paris (GMT+1)</option>
                      <option value="Europe/London">Londres (GMT+0)</option>
                      <option value="America/New_York">New York (GMT-5)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de notifications</CardTitle>
                <CardDescription>
                  Gérez comment et quand vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Notifications par email</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recevoir des notifications par email
                    </p>
                  </div>
                  <ToggleSwitch
                    id="email-notifications"
                    checked={emailNotifications}
                    onChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <Label htmlFor="push-notifications">Notifications push</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Recevoir des notifications push dans le navigateur
                    </p>
                  </div>
                  <ToggleSwitch
                    id="push-notifications"
                    checked={pushNotifications}
                    onChange={setPushNotifications}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode">Mode sombre</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Activer le thème sombre pour l'interface
                    </p>
                  </div>
                  <ToggleSwitch
                    id="dark-mode"
                    checked={isDarkMode}
                    onChange={setIsDarkMode}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>
                  Gérez vos paramètres de sécurité et de confidentialité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-4 text-gray-500 dark:text-gray-400">
                  Simulation : Cette section est pour les paramètres de sécurité.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage; 