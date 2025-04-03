"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Bars3Icon as Menu, XMarkIcon as X, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, SunIcon, MoonIcon, BellIcon, UserIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  isCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onToggleClick?: (collapsed: boolean) => void;
  onMobileMenuClick?: () => void;
  isMobileMenuOpen?: boolean;
  isMobile?: boolean;
  id?: string;
  onMenuToggle?: () => void;
}

export default function Header({ 
  isCollapsed, 
  isMobileMenuOpen = false,
  isMobile = false,
  id,
  onMenuToggle
}: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Suivre les changements de thème
  useEffect(() => {
    if (mounted) {
      console.log("Thème actuel (suivi):", theme);
    }
  }, [theme, mounted]);

  // Mise à jour de la largeur de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      // Mise à jour si nécessaire
    };
    
    // Initialiser la largeur
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const toggleTheme = () => {
    console.log("Thème actuel:", theme);
    const newTheme = theme === "dark" ? "light" : "dark";
    console.log("Nouveau thème:", newTheme);
    setTheme(newTheme);
    
    // Ajouter une classe temporaire au body pour indiquer visuellement le changement de thème
    if (typeof document !== 'undefined') {
      document.body.classList.add('theme-transition');
      setTimeout(() => {
        document.body.classList.remove('theme-transition');
      }, 1000);
    }
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    router.push('/logout');
  };

  const handleMenuToggle = () => {
    console.log('Menu toggle clicked');
    onMenuToggle?.();
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const closeUserMenu = () => {
    setUserMenuOpen(false);
  };

  if (!mounted) return null;

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
      <div className="px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
        {/* Bouton de menu avec zone de tap plus large pour mobile */}
        <button
          id={id}
          onClick={handleMenuToggle}
          className={cn(
            "relative flex items-center justify-center rounded-md p-2 sm:p-2.5",
            "text-gray-700 hover:bg-gray-100 hover:text-gray-900", 
            "dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100",
            "transition-all duration-200 ease-in-out",
            "outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50",
            "touch-optimized tap-feedback mobile-interactive", // Optimisations tactiles
            // Couleur spéciale lorsque le menu est ouvert en mobile
            isMobile && isMobileMenuOpen && "bg-red-500 text-white hover:bg-red-600 hover:text-white",
            // Zone plus grande sur mobile
            isMobile ? "h-12 w-12" : "h-10 w-10"
          )}
          aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isMobileMenuOpen && isMobile ? (
            <X className={cn("h-6 w-6", isMobile && "h-7 w-7")} />
          ) : (
            <Menu className={cn("h-6 w-6", isMobile && "h-7 w-7")} />
          )}
        </button>

        {/* Logo section - optimisé pour le mobile */}
        <div className="flex items-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white mobile-text">Dashboard</span>
        </div>

        {/* Actions section - optimisé avec espacements pour éviter les erreurs de tap */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
          {/* Notifications button */}
          <button 
            className={cn(
              "relative rounded-full p-2 sm:p-2.5",
              "text-gray-600 hover:bg-gray-100 hover:text-gray-900", 
              "dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100",
              "transition-all duration-200 ease-in-out",
              "outline-none focus:ring-2 focus:ring-primary-500",
              "touch-optimized tap-feedback mobile-interactive", // Optimisations tactiles
              // Taille plus grande sur mobile
              isMobile ? "h-12 w-12" : "h-10 w-10"
            )}
            aria-label="Notifications"
          >
            <div className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-950" />
            <BellIcon className={cn("h-5 w-5", isMobile && "h-6 w-6")} />
          </button>

          {/* Menu déroulant de l'utilisateur */}
          <div className="relative ml-2 flex items-center">
            <button
              className={cn(
                "group flex h-9 items-center rounded-full border border-transparent p-0.5 text-gray-700 transition-colors dark:text-gray-200",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                userMenuOpen && "bg-gray-100 dark:bg-gray-800"
              )}
              onClick={toggleUserMenu}
            >
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-yoozak-100 text-yoozak-600 dark:bg-yoozak-900/30 dark:text-yoozak-400">
                {user?.firstName ? (
                  <span className="text-sm font-medium">
                    {user.firstName.charAt(0).toUpperCase()}
                    {user.lastName && user.lastName.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <span className="text-sm font-medium">
                    {user?.username?.charAt(0).toUpperCase() || "A"}
                  </span>
                )}
              </div>
            </button>

            {/* Menu déroulant */}
            {userMenuOpen && (
              <div
                className={cn(
                  "absolute right-0 top-full z-50 mt-1 w-48 origin-top-right rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800",
                  "transition-opacity duration-100",
                  "animate-in fade-in-50"
                )}
              >
                <div className="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
                  <div className="text-sm font-medium text-gray-800 dark:text-white">
                    {user?.username || "Utilisateur"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email || ""}
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/profile"
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={closeUserMenu}
                  >
                    <UserIcon className="mr-2 h-4 w-4" /> Mon profil
                  </Link>
                  <Link
                    href="/settings"
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={closeUserMenu}
                  >
                    <Cog6ToothIcon className="mr-2 h-4 w-4" /> Paramètres
                  </Link>
                </div>

                <div className="border-t border-gray-200 py-1 dark:border-gray-700">
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    onClick={handleLogout}
                  >
                    <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" /> Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}