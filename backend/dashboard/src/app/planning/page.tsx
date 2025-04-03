"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'meeting' | 'task' | 'reminder';
}

const PlanningPage = () => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => {
      // Données fictives pour le planning
      setEvents([
        {
          id: '1',
          title: 'Réunion équipe marketing',
          date: '2023-04-05',
          time: '09:30',
          type: 'meeting'
        },
        {
          id: '2',
          title: 'Livraison nouvelle collection',
          date: '2023-04-07',
          type: 'task'
        },
        {
          id: '3',
          title: 'Mise à jour site web',
          date: '2023-04-10',
          time: '14:00',
          type: 'task'
        },
        {
          id: '4',
          title: 'Rappel: inventaire mensuel',
          date: '2023-04-15',
          type: 'reminder'
        }
      ]);
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
            <p className="text-gray-500 dark:text-gray-400">Chargement du planning...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Fonctions pour la navigation dans le calendrier
  const previousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Obtenir le nom du mois
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  // Générer les jours du mois actuel
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const dayEvents = events.filter(event => new Date(event.date).toDateString() === dayDate.toDateString());
      
      days.push({
        date: dayDate,
        events: dayEvents
      });
    }
    
    return days;
  };

  // Obtenir le nom du jour (lun, mar, etc.)
  const getDayName = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  };

  // Style en fonction du type d'événement
  const getEventStyle = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      case 'task':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      case 'reminder':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  const days = getDaysInMonth(currentDate);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Planning</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium capitalize">{getMonthName(currentDate)}</span>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {/* Jours vides avant le début du mois */}
          {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() || 7 }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square"></div>
          ))}
          
          {days.map((day, i) => (
            <Card 
              key={i} 
              className={`aspect-square overflow-hidden ${
                new Date().toDateString() === day.date.toDateString() 
                  ? 'ring-2 ring-primary' 
                  : ''
              }`}
            >
              <CardContent className="p-1 h-full flex flex-col">
                <div className="text-xs font-medium mb-1">
                  {day.date.getDate()}
                </div>
                <div className="flex-1 overflow-auto">
                  {day.events.map((event) => (
                    <div 
                      key={event.id} 
                      className={`text-xs px-1 py-0.5 mb-1 rounded truncate ${getEventStyle(event.type)}`}
                    >
                      {event.time && `${event.time} `}{event.title}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlanningPage; 