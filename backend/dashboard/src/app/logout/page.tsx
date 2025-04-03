"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";

export default function LogoutPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [countdown, setCountdown] = useState(3);
  
  useEffect(() => {
    // Déconnexion immédiate
    logout();
    
    // Redirection après un délai
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [logout, router]);
  
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-100 dark:bg-navy-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-navy-800"
      >
        <div className="mb-6 flex justify-center">
          <Image 
            src="/logo.jpg" 
            alt="Yoozak Logo" 
            width={80} 
            height={80} 
            className="rounded-xl"
          />
        </div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 text-center text-2xl font-bold text-slate-800 dark:text-navy-50"
        >
          Déconnexion
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-center text-slate-600 dark:text-navy-200"
        >
          <p>Vous avez été déconnecté avec succès.</p>
          <p className="mt-2">
            Redirection vers la page de connexion dans <span className="font-bold text-indigo-600 dark:text-indigo-400">{countdown}</span> secondes...
          </p>
        </motion.div>
        
        <div className="mt-6">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-navy-600">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="absolute left-0 h-full bg-indigo-600 dark:bg-indigo-500"
            />
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/login")}
          className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"
        >
          Retourner à la connexion maintenant
        </motion.button>
      </motion.div>
    </div>
  );
} 