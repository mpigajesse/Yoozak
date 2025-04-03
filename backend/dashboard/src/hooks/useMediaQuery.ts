import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Vérifier si window est disponible (côté client seulement)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Définir l'état initial
    setMatches(mediaQuery.matches);

    // Fonction de callback pour les changements
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Ajouter un listener pour les changements de media query
    try {
      // Méthode moderne (standard)
      mediaQuery.addEventListener('change', handleChange);
      
      // Nettoyage lors du démontage
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    } catch (e) {
      // Fallback pour les anciens navigateurs qui n'ont pas addEventListener
      mediaQuery.addListener(handleChange);
      
      // Nettoyage lors du démontage
      return () => {
        mediaQuery.removeListener(handleChange);
      };
    }
  }, [query]);

  return matches;
} 