// ce fichier gere le composant statsCard
// le composant statsCard est un composant qui permet de gerer les données dans les components
// car on a besoin de gerer les données dans les components

"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./button";


// creation de l'interface StatsCardProps
// on utilise ReactNode pour hériter de la classe ReactNode
// on utilise icon pour gerer l'icone du composant statsCard
// on utilise title pour gerer le titre du composant statsCard
// on utilise value pour gerer la valeur du composant statsCard
// on utilise trend pour gerer la tendance du composant statsCard
// on utilise trendValue pour gerer la valeur de la tendance du composant statsCard
interface StatsCardProps {
  icon?: ReactNode;
  title: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  trendLabel?: string;
  className?: string;
  iconClassName?: string;
  valueClassName?: string;
  titleClassName?: string;
  children?: ReactNode;
  actions?: {
    icon: ReactNode;
    label?: string;
    onClick: () => void;
  }[];
}

// creation du composant statsCard
// on utilise icon pour gerer l'icone du composant statsCard
// on utilise title pour gerer le titre du composant statsCard
// on utilise value pour gerer la valeur du composant statsCard
// on utilise trend pour gerer la tendance du composant statsCard
// on utilise trendValue pour gerer la valeur de la tendance du composant statsCard

export default function StatsCard({
  icon,
  title,
  value,
  trend,
  trendValue,
  trendLabel,
  className,
  iconClassName,
  valueClassName,
  titleClassName,
  children,
  actions
}: StatsCardProps) {
  const trendColor = trend === "up" 
    ? "text-success-500 dark:text-success-400" 
    : trend === "down" 
      ? "text-danger-500 dark:text-danger-400" 
      : "text-gray-500 dark:text-gray-400";
  
  const trendIcon = trend === "up" 
    ? (
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ) 
    : trend === "down" 
      ? (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) 
      : null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900",
        className
      )}
    >
      <div className="p-5">
        <div className="flex items-center justify-between">
          {icon && (
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400",
              iconClassName
            )}>
              {icon}
            </div>
          )}
          
          {actions && actions.length > 0 && (
            <div className="flex space-x-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={action.onClick}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                  leftIcon={action.icon}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <motion.p 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={cn("text-sm font-medium text-gray-500 dark:text-gray-400", titleClassName)}
          >
            {title}
          </motion.p>
          
          <motion.h3 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={cn("mt-1 text-2xl font-semibold text-gray-900 dark:text-white", valueClassName)}
          >
            {value}
          </motion.h3>
          
          {(trend || trendValue) && (
            <div className="mt-2 flex items-center">
              {trend && trendIcon && (
                <span className={cn("flex items-center text-xs font-medium", trendColor)}>
                  {trendIcon}
                  {trendValue && <span className="ml-1">{trendValue}</span>}
                </span>
              )}
              
              {trendLabel && (
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
        
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
} 