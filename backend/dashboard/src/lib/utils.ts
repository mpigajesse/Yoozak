import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine les classes avec clsx et tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extrait les initiales d'un nom complet
 * @param name Le nom complet dont on veut extraire les initiales
 * @returns Les initiales (maximum 2 caractères)
 */
export function getInitials(name: string): string {
  if (!name) return '';
  
  const names = name.trim().split(' ');
  
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

/**
 * Formate un prix avec le symbole de la devise
 * @param amount Le montant à formater
 * @param currency La devise (par défaut EUR)
 * @returns Le prix formaté avec le symbole de la devise
 */
export function formatPrice(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formate une date selon le format français
 * @param date La date à formater
 * @returns La date au format JJ/MM/AAAA
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('fr-FR').format(d);
}

/**
 * Tronque un texte à une longueur spécifique
 * @param text Le texte à tronquer
 * @param maxLength La longueur maximale
 * @returns Le texte tronqué avec "..." si nécessaire
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
} 