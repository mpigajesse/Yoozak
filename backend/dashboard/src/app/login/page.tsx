"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiUser, FiLock, FiEye, FiEyeOff, FiInfo } from "react-icons/fi";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);
  const { login, isAuthenticated, isLoading, error } = useAuthStore();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Journaliser le thème pour le débogage
  useEffect(() => {
    if (mounted) {
      console.log("Thème actuel (login page):", theme);
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginAttempted(true);
    
    if (!username.trim() || !password.trim()) {
      return;
    }
    
    console.log(`Tentative de connexion avec: ${username}`);
    try {
      const result = await login(username, password);
      console.log("Résultat de la connexion:", result);
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Variants pour les animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.5
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24,
        duration: 0.5
      } 
    }
  };
  
  const pulseVariant = {
    initial: { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)" },
    animate: {
      boxShadow: ["0 0 0 0 rgba(59, 130, 246, 0)", "0 0 0 8px rgba(59, 130, 246, 0)"],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

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

  // Attendre que le composant soit monté pour le rendu complet
  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-white dark:bg-gray-900 lg:flex-row transition-colors duration-300">
      {/* Côté gauche - Formulaire de connexion */}
      <div className="flex w-full items-center justify-center p-4 sm:p-6 md:p-8 lg:w-1/2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-6 sm:space-y-8"
        >
          <div className="text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mt-6 flex items-center justify-center lg:justify-start"
            >
              <div className="flex flex-col items-center lg:flex-row lg:space-x-3">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl transition-colors duration-300">
                    Connexion
                  </h1>
                  <p className="mt-2 text-sm text-slate-600 dark:text-navy-200 transition-colors duration-300">
                    Entrez vos identifiants pour accéder à votre compte
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <ThemeToggle className="absolute right-4 top-4 md:right-8 md:top-8" />

          <motion.div
            variants={itemVariants}
            className="mb-6 w-full max-w-[360px] rounded-lg bg-primary-50 p-4 border-l-4 border-primary-500 shadow-sm text-sm dark:bg-primary-900/20 dark:border-primary-600 animate-pulse-subtle transition-colors duration-300"
          >
            <div className="flex items-start">
              <FiInfo className="mr-3 h-5 w-5 mt-0.5 text-primary-600 dark:text-primary-400 transition-colors duration-300" />
              <span className="text-primary-800 dark:text-primary-300 font-medium transition-colors duration-300">
                <span className="font-semibold block mb-1">Accès limité</span>
                Pour le moment, seuls les administrateurs Django peuvent accéder au dashboard. La gestion des autres utilisateurs sera disponible prochainement.
              </span>
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 w-full max-w-[360px] rounded-lg bg-red-50 p-4 border-l-4 border-red-500 shadow-sm text-sm dark:bg-red-900/20 dark:border-red-700 transition-colors duration-300"
            >
              <div className="flex items-start">
                <svg className="mr-3 h-5 w-5 mt-0.5 text-red-600 dark:text-red-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-red-800 dark:text-red-300 font-medium transition-colors duration-300">{error}</span>
              </div>
            </motion.div>
          )}

          <motion.form
            variants={containerVariants}
            onSubmit={handleSubmit} 
            className="w-full max-w-[360px] space-y-5"
          >
            <motion.div variants={itemVariants}>
              <label 
                htmlFor="username" 
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300"
              >
                Nom d'utilisateur
                <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-500 dark:text-primary-400 transition-colors duration-300">
                  <FiUser size={18} />
                </span>
                <motion.input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-800 transition-all",
                    "placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:scale-[1.02]",
                    "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500",
                    isLoading && "cursor-not-allowed opacity-70"
                  )}
                  placeholder="admin"
                  disabled={isLoading}
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              {loginAttempted && !username.trim() && (
                <p className="mt-1 text-xs text-red-500 transition-colors duration-300">Le nom d'utilisateur est requis</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label 
                htmlFor="password" 
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300"
              >
                Mot de passe
                <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-500 dark:text-primary-400 transition-colors duration-300">
                  <FiLock size={18} />
                </span>
                <motion.div variants={itemVariants} className="relative">
                  <motion.input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    whileFocus={{ scale: 1.01 }}
                    className={cn(
                      "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 pr-12 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600 transition-all focus:scale-[1.02] dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-primary-500 dark:focus:ring-primary-500",
                      isLoading && "opacity-70 cursor-not-allowed"
                    )}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </motion.div>
                {loginAttempted && !password.trim() && (
                  <p className="mt-1 text-xs text-red-500 transition-colors duration-300">Le mot de passe est requis</p>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-5 w-5 cursor-pointer rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 transition-colors duration-300"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">Rester connecté</span>
              </label>
              <Button
                type="button"
                variant="ghost"
                color="info"
                size="sm"
                withMotion
                className="text-sm font-medium"
                onClick={() => router.push('/login/reset-password')}
              >
                Mot de passe oublié?
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                disabled={isLoading}
                variant="gradient"
                gradient="violet-blue"
                size="lg"
                fullWidth
                withMotion
                isLoading={isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-4 text-center">
              <Button 
                type="button"
                variant="outline"
                color="primary"
                size="md"
                withMotion
                className="w-full"
                onClick={() => router.push('/register')}
              >
                Créer un compte
              </Button>
            </motion.div>
          </motion.form>
          
          <motion.div 
            variants={itemVariants}
            className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300"
          >
            Besoin d'aide? 
            <a href="#" className="ml-1 font-medium text-primary-600 hover:underline dark:text-primary-400 transition-colors duration-300">
              Contactez l'administrateur
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Côté droit - Image/illustration */}
      <div className="hidden bg-gray-100 dark:bg-gray-800 lg:block lg:w-1/2 transition-colors duration-300">
        <div className="flex h-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8 text-gray-700 dark:text-gray-200 transition-colors duration-300">
          <div className="max-w-md text-center">
            <div className="mb-6 lg:mb-8 flex items-center justify-center">
              <Image 
                src="/images/logo/logo.jpg" 
                alt="Yoozak Logo" 
                width={280} 
                height={280} 
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Le composant Diagnostic pour afficher l'état du thème */}
      <ThemeDiagnostic />
    </div>
  );
} 