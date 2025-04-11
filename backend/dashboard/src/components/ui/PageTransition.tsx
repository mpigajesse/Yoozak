// ce fichier gere le composant pageTransition
// le composant pageTransition est un composant qui permet de gerer les données dans les components
// car on a besoin de gerer les données dans les components

"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// creation de l'interface PageTransitionProps
// on utilise ReactNode pour hériter de la classe ReactNode
// on utilise className pour gerer les classes css
// on utilise children pour gerer les enfants du composant pageTransition

type PageTransitionProps = {
  children: ReactNode;
  className?: string;
};

// creation des variants du composant pageTransition
// on utilise hidden pour gerer le composant pageTransition lorsqu'il est caché
// on utilise enter pour gerer le composant pageTransition lorsqu'il est visible
// on utilise exit pour gerer le composant pageTransition lorsqu'il est caché

export const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// creation du composant pageTransition
// on utilise motion.div pour gerer le composant pageTransition
// on utilise initial pour gerer le composant pageTransition lorsqu'il est caché
// on utilise animate pour gerer le composant pageTransition lorsqu'il est visible
// on utilise exit pour gerer le composant pageTransition lorsqu'il est caché

export default function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
} 