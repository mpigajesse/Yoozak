"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  UserIcon, 
  WrenchScrewdriverIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon, 
  ShoppingCartIcon, 
  UsersIcon, 
  CalendarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
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
  badge?: string; // Ajout d'un badge pour identifier les pôles
  badgeColor?: string; // Couleur du badge (pour les pôles)
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
    // PÔLE PRODUCTS
    {
      icon: <ShoppingBagIcon className="w-5 h-5 text-current" />,
      label: "PRODUCTS",
      href: "/products",
      badge: "PÔLE",
      badgeColor: "bg-emerald-500",
      subItems: [
        { label: "Articles", href: "/products/articles" },
        { label: "Catalogues", href: "/products/catalogues" },
        { label: "Catégories", href: "/products/categories" },
        { label: "Sous-catégories", href: "/products/sous-categories" },
        { label: "Créatives", href: "/products/creatives" },
        { label: "Produits", href: "/products/produits" },
        { label: "Produits - Catalogues", href: "/products/produits-catalogues" },
        { label: "Produits - Catégories", href: "/products/produits-categories" },
        { label: "Promotions", href: "/products/promotions" },
      ],
    },
    // PÔLE COMMANDES
    {
      icon: <ShoppingCartIcon className="w-5 h-5 text-current" />,
      label: "COMMANDES",
      href: "/commandes",
      badge: "PÔLE",
      badgeColor: "bg-blue-500",
      subItems: [
        { label: "Commandes", href: "/commandes" },
        { label: "Paniers", href: "/commandes/paniers" },
        { label: "Lignes de commande", href: "/commandes/lignes-commande" },
        { label: "Remises", href: "/commandes/remises" },
        { label: "Codes promo", href: "/commandes/codes-promo" },
        { label: "Retours", href: "/commandes/retours" },
        { label: "États de commande", href: "/commandes/etats-commande" },
      ],
    },
    // PÔLE CLIENTS
    {
      icon: <UsersIcon className="w-5 h-5 text-current" />,
      label: "CLIENTS",
      href: "/clients",
      badge: "PÔLE",
      badgeColor: "bg-yellow-500",
      subItems: [
        { label: "Clients", href: "/clients" },
        { label: "Avis", href: "/clients/avis" },
        { label: "Favoris", href: "/clients/favoris" },
        { label: "CRM", href: "/clients/crm" },
      ],
    },
    // ORGANISATION & UTILISATEURS
    {
      icon: <BuildingOfficeIcon className="w-5 h-5 text-current" />,
      label: "Organisation",
      href: "/organisation",
      subItems: [
        { label: "Pôles", href: "/organisation/poles" },
        { label: "Services", href: "/organisation/services" },
        { label: "Équipes", href: "/organisation/teams" },
      ],
    },
    {
      icon: <UserGroupIcon className="w-5 h-5 text-current" />,
      label: "Utilisateurs",
      href: "/users",
      subItems: [
        { label: "Tous les utilisateurs", href: "/users" },
        { label: "Rôles & Permissions", href: "/users/roles" },
        { label: "Invitations", href: "/users/invitations" },
      ],
    },
    // OUTILS & ANALYSES
    {
      icon: <ChartBarIcon className="w-5 h-5 text-current" />,
      label: "Rapports & Analyses",
      href: "/rapports",
      subItems: [
        { label: "Ventes", href: "/rapports/ventes" },
        { label: "Produits", href: "/rapports/produits" },
        { label: "Clients", href: "/rapports/clients" },
        { label: "Performance par pôle", href: "/rapports/poles" },
      ],
    },
    {
      icon: <CalendarIcon className="w-5 h-5 text-current" />,
      label: "Planning",
      href: "/planning",
    },
    // PARAMÈTRES & PROFIL
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
      className={cn(
        "flex flex-col h-screen bg-sidebar text-sidebar-text border-r border-sidebar-border transition-all duration-300 ease-in-out z-20 fixed lg:relative",
        isCollapsed ? "w-16" : "w-64",
        isMobile || isTablet ? "left-0" : ""
      )}
    >
      {/* Logo et Bouton de toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center overflow-hidden">
          {!isCollapsed && (
            <h1 className="text-xl font-bold truncate text-sidebar-text">
              <Link href="/">Yoozak</Link>
            </h1>
          )}
          {isCollapsed && (
            <h1 className="text-xl font-bold truncate text-sidebar-text">
              <Link href="/">Y</Link>
            </h1>
          )}
        </div>
        
        {/* Bouton de toggle pour desktop uniquement */}
        {!isMobile && !isTablet && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-sidebar-text hover:bg-sidebar-hover"
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              {isCollapsed ? (
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        <ul className="space-y-1 px-2">
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              label={item.label}
              href={item.href}
              badge={item.badge}
              badgeColor={item.badgeColor}
              isActive={pathname === item.href || pathname?.startsWith(item.href + "/")}
              isCollapsed={isCollapsed}
              hasSubItems={item.subItems && item.subItems.length > 0}
              subItems={item.subItems?.map((subItem) => ({
                ...subItem,
                isActive: pathname === subItem.href || pathname?.startsWith(subItem.href + "/")
              }))}
              onMobileClick={handleMobileClose}
              isMobile={isMobile || isTablet}
            />
          ))}
        </ul>
      </nav>

      {/* Footer avec déconnexion */}
      <div className="p-4 border-t border-sidebar-border">
        <Button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 text-sidebar-text hover:text-white hover:bg-red-600 transition-colors"
          variant="ghost"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          {!isCollapsed && <span>Déconnexion</span>}
        </Button>
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
  isMobile = false,
  badge,
  badgeColor,
}) => {
  const pathname = usePathname();
  const hasSubItems = hasSubItemsProp || (subItems && subItems.length > 0);
  // Le sous-menu est ouvert si l'élément est actif ou si un de ses sous-éléments est actif
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(
    isActiveProp || 
    subItems.some(item => item.isActive || pathname === item.href || pathname?.startsWith(item.href + "/"))
  );
  
  // Déterminer si l'élément est actif
  const isActive = isActiveProp || 
    pathname === href || 
    pathname?.startsWith(href + "/") ||
    subItems.some(item => pathname === item.href || pathname?.startsWith(item.href + "/"));

  // Gérer le toggle du sous-menu
  const handleSubMenuToggle = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      setIsSubMenuOpen(!isSubMenuOpen);
    }
  };
  
  // Gérer le clic sur l'élément du menu
  const handleClick = () => {
    if (isMobile && onMobileClick) {
      onMobileClick();
    }
  };

  return (
    <li>
      <Link 
        href={hasSubItems ? "#" : href} 
        onClick={hasSubItems ? handleSubMenuToggle : handleClick}
        className={cn(
          "flex items-center px-3 py-2 rounded-md hover:bg-sidebar-hover transition-colors relative group",
          isActive ? "bg-sidebar-active text-sidebar-active-text" : "text-sidebar-text",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        <div className="flex items-center">
          <span className="mr-3">{icon}</span>
          {!isCollapsed && (
            <span className="truncate">
              {label}
            </span>
          )}
        </div>

        {/* Badge pour identifier les pôles */}
        {!isCollapsed && badge && (
          <span className={`px-1.5 py-0.5 text-xs rounded-full text-white font-medium ${badgeColor || 'bg-gray-500'} ml-2`}>
            {badge}
          </span>
        )}
        
        {/* Flèche pour les sous-menus */}
        {hasSubItems && !isCollapsed && (
          <ChevronDown 
            className={`w-4 h-4 transition-transform ${isSubMenuOpen ? 'transform rotate-180' : ''}`} 
          />
        )}
        
        {/* Indicateur de notification */}
        {notificationCount && notificationCount > 0 && (
          <span className={`absolute top-1 right-1 text-xs bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full ${isCollapsed ? '' : 'mr-6'}`}>
            {notificationCount}
          </span>
        )}
        
        {/* Tooltip pour mode collapsed */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 top-0 z-50 w-auto opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="bg-gray-900 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
              {label}
              {badge && (
                <span className={`ml-1 px-1 text-xs inline-flex items-center justify-center rounded-full text-white ${badgeColor || 'bg-gray-500'}`}>
                  {badge}
                </span>
              )}
            </div>
          </div>
        )}
      </Link>
      
      {/* Sous-menu */}
      {hasSubItems && isSubMenuOpen && !isCollapsed && (
        <ul className="mt-1 ml-6 space-y-1 border-l-2 border-sidebar-border pl-2">
          {subItems.map((subItem, index) => (
            <li key={index}>
              <Link
                href={subItem.href}
                onClick={handleClick}
                className={cn(
                  "flex items-center px-3 py-2 text-sm rounded-md hover:bg-sidebar-hover transition-colors",
                  subItem.isActive ||
                  pathname === subItem.href ||
                  pathname?.startsWith(subItem.href + "/")
                    ? "text-sidebar-active-text bg-sidebar-active"
                    : "text-sidebar-text"
                )}
              >
                {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                <span className="truncate">{subItem.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}; 