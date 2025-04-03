"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ThemeToggle({ className, size = "md" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Une fois monté, on peut accéder au thème
  useEffect(() => {
    setMounted(true);
  }, []);

  // Définir les tailles en fonction du prop size
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  // Gérer le changement de thème
  const toggleTheme = () => {
    console.log("Changement de thème. Actuel:", theme);
    setTheme(theme === "dark" ? "light" : "dark");
    
    // Ajouter une classe pour l'animation
    if (typeof document !== 'undefined') {
      document.body.classList.add('theme-transition');
      setTimeout(() => {
        document.body.classList.remove('theme-transition');
      }, 700); // Correspondre à la durée de l'animation
    }
  };

  // Afficher un placeholder pendant le chargement côté client
  if (!mounted) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full p-2 text-gray-400 bg-gray-100 dark:bg-gray-800 theme-toggle-btn",
          sizes[size],
          className
        )}
      >
        <div className={cn("animate-pulse bg-gray-300 dark:bg-gray-600 rounded-full", iconSizes[size])}></div>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center justify-center rounded-full bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-600 theme-toggle-btn",
        sizes[size],
        className
      )}
      aria-label={theme === "dark" ? "Passer au mode clair" : "Passer au mode sombre"}
    >
      {theme === "dark" ? (
        <Sun className={iconSizes[size]} />
      ) : (
        <Moon className={iconSizes[size]} />
      )}
    </button>
  );
} 