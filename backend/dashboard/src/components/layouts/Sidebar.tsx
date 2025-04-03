"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { HomeIcon, ShoppingBagIcon, UserIcon, WrenchScrewdriverIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, ShoppingCartIcon, UsersIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface SubItem {
  label: string;
  href: string;
  icon?: any; // Icônes optionnelles pour les sous-éléments
  isActive?: boolean;
}

interface SidebarItemProps {
  icon: any; // Accepte tout type d'icône
  label: string;
  href: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  hasSubItems?: boolean;
  subItems?: SubItem[];
  onMobileClick?: () => void;
  notificationCount?: number;
  isMobile?: boolean;
}

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
  isVisible?: boolean;
  isMobileOpen?: boolean;
  onMobileItemClick?: () => void;
  isTablet?: boolean;
  isCollapsed?: boolean;
  isMobile?: boolean;
}

export default function Sidebar({ 
  onToggle, 
  isVisible = true, 
  isMobileOpen = false, 
  onMobileItemClick,
  isTablet = false,
  isCollapsed: propIsCollapsed
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(propIsCollapsed || false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const isTabletMedia = useMediaQuery('(max-width: 1024px)');
  const isMobileMedia = useMediaQuery('(max-width: 768px)');

  // Fermeture du menu mobile lors d'un clic sur un élément
  const handleMobileClose = () => {
    if (onMobileItemClick) {
        onMobileItemClick();
    }
  };

  // Éviter l'hydratation incorrecte et détecter les écrans mobiles
  useEffect(() => {
    setIsMounted(true);
    
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      
      if (mobile || isTablet) {
        // Sur mobile/tablette, forcer l'état en fonction de isMobileOpen
        setIsCollapsed(!isMobileOpen);
        if (onToggle) onToggle(!isMobileOpen);
      }
    };
    
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [isCollapsed, onToggle, isMobileOpen, isTablet]);

  // Réagir aux changements de isMobileOpen
  useEffect(() => {
    if (isMobile || isTablet) {
      setIsCollapsed(!isMobileOpen);
      if (onToggle) onToggle(!isMobileOpen);
    }
  }, [isMobileOpen, isMobile, isTablet, onToggle]);

  // Synchroniser avec la prop isCollapsed venant du parent
  useEffect(() => {
    if (propIsCollapsed !== undefined && propIsCollapsed !== isCollapsed) {
      setIsCollapsed(propIsCollapsed);
    }
  }, [propIsCollapsed, isCollapsed]);

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    // Notifier le composant parent du changement
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  const sidebarItems = [
    {
      icon: <HomeIcon className="w-5 h-5 text-current" />,
      label: "Tableau de bord",
      href: "/dashboard",
    },
    {
      icon: <ShoppingBagIcon className="w-5 h-5 text-current" />,
      label: "Produits",
      href: "/products",
      subItems: [
        { label: "Articles", href: "/products" },
        { label: "Catalogues", href: "/products/catalogues" },
        { label: "Catégories", href: "/products/categories" },
        { label: "Creatives", href: "/products/creatives" },
        { label: "Produits - Catalogues", href: "/products/produits-catalogues" },
        { label: "Produits - Catégories", href: "/products/produits-categories" },
        { label: "Promotions", href: "/products/promotions" },
        { label: "Sous-catégories", href: "/products/sous-categories" },
      ],
    },
    {
      icon: <ShoppingCartIcon className="w-5 h-5 text-current" />,
      label: "Commandes",
      href: "/commandes",
      subItems: [
        { label: "Codes promo", href: "/commandes/codes-promo" },
        { label: "Commandes", href: "/commandes" },
        { label: "Lignes de commande", href: "/commandes/lignes-commande" },
        { label: "Paniers", href: "/commandes/paniers" },
        { label: "Remises", href: "/commandes/remises" },
        { label: "Retours", href: "/commandes/retours" },
        { label: "États de commande", href: "/commandes/etats-commande" },
      ],
    },
    {
      icon: <UsersIcon className="w-5 h-5 text-current" />,
      label: "Clients",
      href: "/clients",
      subItems: [
        { label: "Clients", href: "/clients" },
        { label: "Avis", href: "/clients/avis" },
        { label: "Favoris", href: "/clients/favoris" },
      ],
    },
    {
      icon: <WrenchScrewdriverIcon className="w-5 h-5 text-current" />,
      label: "Rapports",
      href: "/rapports",
      subItems: [
        { label: "Ventes", href: "/rapports/ventes" },
        { label: "Produits", href: "/rapports/produits" },
        { label: "Clients", href: "/rapports/clients" },
      ],
    },
    {
      icon: <CalendarIcon className="w-5 h-5 text-current" />,
      label: "Planning",
      href: "/planning",
    },
    {
      icon: <UserIcon className="w-5 h-5 text-current" />,
      label: "Utilisateurs",
      href: "/users",
    },
    {
      icon: <UserIcon className="w-5 h-5 text-current" />,
      label: "Mon Profil",
      href: "/profile",
    },
    {
      icon: <Cog6ToothIcon className="w-5 h-5 text-current" />,
      label: "Paramètres",
      href: "/settings",
    },
  ];

  if (!isMounted) return null;
  
  // Ne pas afficher si isVisible est false
  if (!isVisible) return null;

  return (
    <aside
      className={`${
        isMobile || isTablet
          ? 'fixed left-0 top-0 z-50 h-full w-screen'
          : 'relative h-full'
      } bg-white shadow-md transition-all duration-300 dark:bg-gray-800 ${
        isVisible ? 'block' : 'hidden'
      } ${!isMobile && !isTablet && isCollapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="flex h-full w-full flex-col overflow-y-auto bg-white px-3 py-5 dark:bg-gray-800">
        {/* Logo */}
        <div className={`mb-6 flex ${isCollapsed && !isMobile && !isTablet ? 'justify-center' : 'px-3'}`}>
          <Link href="/dashboard" className="flex items-center">
            {isCollapsed && !isMobile && !isTablet ? (
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                Y
              </span>
            ) : (
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                Yoozak
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-2">
          {!isCollapsed && (
            <div className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Menu Principal
            </div>
          )}
          {sidebarItems.map((item, idx) => (
            <SidebarItem
              key={idx}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isCollapsed={isCollapsed && !isMobile && !isTablet}
              subItems={item.subItems}
              onMobileClick={handleMobileClose}
            />
          ))}
        </div>

        {/* Logout */}
        <div className="mt-6 px-3">
          <button 
            className={`flex w-full items-center ${!isCollapsed || isMobile || isTablet ? 'gap-3' : 'justify-center'} rounded-lg bg-gray-100 px-3 py-2.5 text-red-600 hover:bg-red-50 dark:bg-gray-700 dark:text-red-400 dark:hover:bg-red-900/20 transition duration-150 ease-in-out`}
            onClick={logout}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            {(!isCollapsed || isMobile || isTablet) && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  href,
  label,
  isActive: isActiveProp = false,
  isCollapsed = false,
  hasSubItems: hasSubItemsProp = false,
  subItems = [],
  onMobileClick,
  notificationCount,
  isMobile = false
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsedLocal, setIsCollapsedLocal] = useState(true);
  const itemHasSubItems = subItems && subItems.length > 0;
  
  // Vérifier si l'élément ou un sous-élément est actif
  const isItemActive = pathname === href;
  const isSubItemActive = itemHasSubItems && subItems.some(item => pathname === item.href);
  const itemIsActive = isActiveProp || isItemActive || isSubItemActive;
  
  // Marquer comme actif si un sous-élément est actif
  useEffect(() => {
    if (isSubItemActive) {
      setIsCollapsedLocal(false);
    }
  }, [pathname, isSubItemActive]);
  
  // Optimiser les actions tactiles
  const handleSubMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCollapsedLocal(!isCollapsedLocal);
  };
  
  // Gérer le clic sur un élément du menu mobile
  const handleClick = () => {
    if (onMobileClick) {
      onMobileClick();
    }
  };

  return (
    <div className="mb-1">
      <Link
        href={href}
        onClick={handleClick}
        className={cn(
          "group flex items-center justify-between rounded-md p-2 text-sm font-medium transition-colors",
          "hover:bg-primary-50 hover:text-primary-800 dark:hover:bg-gray-800 dark:hover:text-gray-100",
          "touch-optimized tap-feedback mobile-interactive", // Optimisation tactile améliorée
          itemIsActive 
            ? "bg-primary-100 text-primary-900 dark:bg-gray-800 dark:text-primary-400" 
            : "text-gray-600 dark:text-gray-300",
          // Zone de tap plus grande sur mobile
          isMobile && "p-3"
        )}
      >
        <div className="flex items-center">
          {icon && (
            <div className={cn(
              "mr-2 flex h-5 w-5 items-center justify-center rounded-md",
              itemIsActive ? "text-primary-700 dark:text-primary-400" : "text-gray-500 dark:text-gray-400",
              isMobile && "h-6 w-6" // Icônes plus grandes sur mobile
            )}>
              {icon}
            </div>
          )}
          {!isCollapsed && (
            <span className={cn(
              "truncate transition-opacity",
              isMobile && "text-base mobile-text" // Texte plus grand sur mobile
            )}>
              {label}
            </span>
          )}
        </div>

        {/* Indicateur de notification (si présent) */}
        {notificationCount && !isCollapsed && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs font-medium text-white">
            {notificationCount > 99 ? '99+' : notificationCount}
          </span>
        )}

        {/* Chevron pour les éléments avec sous-menus */}
        {itemHasSubItems && !isCollapsed && (
          <button
            onClick={handleSubMenuToggle}
            className={cn(
              "ml-auto flex h-6 w-6 items-center justify-center rounded-md",
              "text-gray-400 hover:bg-gray-100 hover:text-gray-600",
              "dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300",
              "transition-transform duration-200 ease-in-out",
              "touch-optimized tap-feedback mobile-interactive", // Optimisation tactile améliorée
              !isCollapsedLocal && "rotate-180"
            )}
            aria-label={isCollapsedLocal ? "Ouvrir le sous-menu" : "Fermer le sous-menu"}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </Link>

      {/* Sous-menu avec animation fluide */}
      {itemHasSubItems && !isCollapsed && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isCollapsedLocal ? "max-h-0" : "max-h-96"
          )}
        >
          <ul className="pl-4 pt-1 mobile-spaced">
            {subItems.map((item, index) => (
              <li key={index} className="mt-1">
                <Link
                  href={item.href}
                  onClick={handleClick}
                  className={cn(
                    "flex items-center rounded-md p-2 text-sm transition-colors",
                    "hover:bg-primary-50 hover:text-primary-800",
                    "dark:hover:bg-gray-800 dark:hover:text-gray-100",
                    "touch-optimized tap-feedback mobile-interactive", // Optimisation tactile améliorée
                    pathname === item.href
                      ? "bg-primary-50 text-primary-800 dark:bg-gray-800 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-400",
                    // Zone de tap plus grande sur mobile
                    isMobile && "p-3 text-base"
                  )}
                >
                  {item.icon ? (
                    <div className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center",
                      isMobile && "h-5 w-5" // Icônes plus grandes sur mobile
                    )}>
                      {item.icon}
                    </div>
                  ) : (
                    <div className="mr-2 h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-600" />
                  )}
                  <span className={cn("truncate", isMobile && "mobile-text")}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}; 