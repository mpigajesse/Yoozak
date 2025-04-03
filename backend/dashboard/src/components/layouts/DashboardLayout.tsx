"use client";

import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import Header from './Header';
import Sidebar from './Sidebar';
import { Drawer } from "@/components/ui/drawer";
import { ToastContainer } from 'react-toastify';
import { useTheme } from "next-themes";
import ThemeToggle from "../ui/ThemeToggle";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const getUserInfo = useAuthStore((state) => state.getUserInfo);
  const { theme, setTheme } = useTheme();

  // Gérer la détection de la taille de l'écran
  useEffect(() => {
    setMounted(true);
    
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      const tablet = window.innerWidth >= 640 && window.innerWidth < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      // Fermer automatiquement le menu mobile sur les grands écrans
      if (!mobile && !tablet && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Gestionnaire de clic en dehors du menu pour le fermer sur mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && mainRef.current && !mainRef.current.contains(event.target as Node)) {
        // Vérifier si le clic n'est pas sur le bouton du menu mobile
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        if (!mobileMenuButton || !mobileMenuButton.contains(event.target as Node)) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Rediriger vers la page de connexion si non authentifié
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [isAuthenticated, router, mounted]);

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [pathname]);

  // Vérifier l'authentification et récupérer les informations de l'utilisateur
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    getUserInfo();
  }, [isAuthenticated, getUserInfo, router]);

  // Journaliser le thème pour le débogage
  useEffect(() => {
    if (mounted) {
      console.log("Thème actuel du dashboard:", theme);
    }
  }, [theme, mounted]);

  // Fonction pour gérer le toggle du menu (version unifiée)
  const handleMenuToggle = () => {
    console.log("Menu toggle clicked - avant:", isMobile, isTablet, isMobileMenuOpen);
    if (isMobile || isTablet) {
      // Sur mobile/tablette, on contrôle l'ouverture/fermeture du menu latéral
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      // Sur desktop, on contrôle la taille du menu (collapsed ou non)
      setIsCollapsed(!isCollapsed);
    }
    console.log("Menu toggle terminé - après:", isMobile, isTablet, !isMobileMenuOpen);
  };

  if (!mounted || !isAuthenticated) return null;

  // Le composant Diagnostic pour afficher l'état du thème
  const ThemeDiagnostic = () => {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 rounded-md bg-gray-100 p-2 shadow-md dark:bg-gray-800">
        <span className="text-xs text-gray-700 dark:text-gray-300">
          Thème: <span className="font-bold">{theme}</span>
        </span>
        <ThemeToggle size="sm" />
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-hidden overscroll-none">
      {/* Version mobile avec Drawer */}
      {(isMobile || isTablet) && (
        <Drawer
          open={isMobileMenuOpen}
          onOpenChange={setIsMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          className="w-4/5 max-w-[320px] will-change-transform"
        >
          <Sidebar 
            isCollapsed={false}
            onToggle={setIsCollapsed}
            isVisible={true}
            isMobileOpen={isMobileMenuOpen}
            onMobileItemClick={() => setIsMobileMenuOpen(false)}
            isTablet={isTablet}
            isMobile={isMobile}
          />
        </Drawer>
      )}

      {/* Version desktop avec sidebar fixe */}
      {!isMobile && !isTablet && (
        <div 
          className={cn(
            'transition-all duration-300 ease-in-out z-50 shadow-lg will-change-transform overflow-y-auto overscroll-none',
            'fixed left-0 top-0 h-full',
            isCollapsed ? 'w-20' : 'w-64'
          )}
        >
          <Sidebar 
            isCollapsed={isCollapsed}
            onToggle={setIsCollapsed}
            isVisible={true}
            isMobileOpen={false}
            isTablet={false}
            isMobile={false}
          />
        </div>
      )}
      
      {/* Main content - adapté pour tous les écrans avec optimisations de performance */}
      <div
        ref={mainRef}
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out overscroll-none",
          (!isMobile && !isTablet) && (isCollapsed ? "ml-20" : "ml-64"),
          "w-full" // Pour garantir que le contenu prend toute la largeur disponible
        )}
        style={{ 
          // Prévention des problèmes de performances avec les transitions CSS
          willChange: 'margin-left',
          backfaceVisibility: 'hidden'
        }}
      >
        {/* Header - toujours fixé en haut avec optimisations */}
        <div 
          ref={headerRef} 
          className="sticky top-0 z-30 w-full will-change-transform"
        >
          <Header 
            isCollapsed={isCollapsed} 
            onMenuToggle={handleMenuToggle}
            isMobileMenuOpen={isMobileMenuOpen}
            isMobile={isMobile || isTablet}
            id="mobile-menu-button"
          />
        </div>
        
        {/* Content area with scroll - adapté à tous types de contenu avec optimisations */}
        <main className="flex-1 overflow-y-auto overscroll-none transition-all duration-300 p-3 sm:p-4 md:p-6 lg:p-8 scroll-smooth">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay pour le menu mobile */}
      {isMobileMenuOpen && isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={handleMenuToggle}
          aria-hidden="true"
        ></div>
      )}
      
      {/* Diagnostic du thème */}
      <ThemeDiagnostic />

      <ToastContainer 
        position="bottom-right"
        theme={theme === 'dark' ? 'dark' : 'light'}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}; 