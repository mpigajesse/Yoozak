//le dossier contextes gere les contextes
// les contextes sont des objets qui permettent de gerer les données dans les components

// ce fichier gere le thème du site
// car on a besoin de gerer le thème du site dans les components
// on gere le thème du site avec le thème du site

// 'utilisation de 'use client' pour que le thème du site soit accessible dans les components
//car le thème du site est un composant client 
"use client";

// importation de ThemeProvider comme NextThemesProvider
// car on a besoin de gerer le thème du site avec le thème du site
import { ThemeProvider as NextThemesProvider } from "next-themes";

// importation de ThemeProviderProps provenant de next-themes/dist/types
// car on a besoin de gerer les props du thème du site
import { type ThemeProviderProps } from "next-themes/dist/types";

// création du composant ThemeProvider
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
} 