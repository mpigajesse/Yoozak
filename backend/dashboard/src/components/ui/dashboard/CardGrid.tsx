"use client";

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardGridProps {
  children: React.ReactNode;
  columns?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: 'small' | 'medium' | 'large';
  className?: string;
}

export function CardGrid({
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'medium',
  className,
}: CardGridProps) {
  // Classes pour les différentes configurations de grille
  const columnsClasses = {
    1: 'grid-cols-1',
    2: 'sm:grid-cols-1 md:grid-cols-2',
    3: 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    responsive: 'grid-responsive-cards',
  };

  // Classes pour les différentes tailles d'espacement
  const gapClasses = {
    small: 'gap-3',
    medium: 'gap-6',
    large: 'gap-8',
  };

  // Déterminer les classes de colonnes
  let columnsClass = '';
  if (typeof columns === 'number') {
    columnsClass = columnsClasses[columns as keyof typeof columnsClasses] || columnsClasses[4];
  } else {
    columnsClass = 'grid-cols-1';
    if (columns.sm) columnsClass += ` sm:grid-cols-${columns.sm}`;
    if (columns.md) columnsClass += ` md:grid-cols-${columns.md}`;
    if (columns.lg) columnsClass += ` lg:grid-cols-${columns.lg}`;
    if (columns.xl) columnsClass += ` xl:grid-cols-${columns.xl}`;
  }

  return (
    <div className={cn('grid', columnsClass, gapClasses[gap], className)}>
      {children}
    </div>
  );
}

// Composant pour les sections du tableau de bord
export interface DashboardSectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
  actions?: ReactNode;
}

export function DashboardSection({
  children,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  contentClassName,
  actions
}: DashboardSectionProps) {
  return (
    <section className={cn('section-spacing', className)}>
      {(title || description || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6">
          <div>
            {title && (
              <h2 className={cn('text-xl sm:text-2xl font-bold text-gray-800 dark:text-white', titleClassName)}>
                {title}
              </h2>
            )}
            {description && (
              <p className={cn('mt-1 text-sm text-gray-600 dark:text-gray-400', descriptionClassName)}>
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="mt-3 sm:mt-0">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className={contentClassName}>
        {children}
      </div>
    </section>
  );
} 