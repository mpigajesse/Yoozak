// le dossier components gere les composants

//il contient le dossier ui 
// le dossier ui gere les composants ui
// les composants ui sont des objets qui permettent de gerer les données dans les components
// car on a besoin de gerer les données dans les components

// ce fichier gere le composant DashboardCard
// le composant DashboardCard est un composant qui permet de gerer les données dans les components


"use client";

import React from 'react';
// importation de Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle ce sont des composants ui 
//permettant de gerer les données dans les components exemple : les cartes de dashboard comme les cartes de statistiques

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title?: string;
  description?: string;
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  href?: string;
}

export function DashboardCard({
  title,
  description,
  className,
  icon,
  children,
  footer,
  href
}: DashboardCardProps) {
  const CardComponent = (
    <Card className={cn("overflow-hidden", className)}>
      {(title || description || icon) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {icon && <div className="flex h-8 w-8 items-center justify-center">{icon}</div>}
        </CardHeader>
      )}
      <CardContent>
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="border-t px-6 py-4">
          {footer}
        </CardFooter>
      )}
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-transform hover:scale-[1.02]">
        {CardComponent}
      </Link>
    );
  }

  return CardComponent;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  href?: string;
}

export function StatCard({
  title,
  value,
  icon,
  footer,
  className,
  href
}: StatCardProps) {
  return (
    <DashboardCard
      icon={icon}
      className={cn("h-full", className)}
      href={href}
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      {footer && <div className="mt-4">{footer}</div>}
    </DashboardCard>
  );
} 