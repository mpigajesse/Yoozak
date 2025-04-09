
// ce fichier gere le composant button
// le composant button est un composant qui permet de gerer les données dans les components
// car on a besoin de gerer les données dans les components
// exemple : les boutons dans les pages de gestion des utilisateurs, des produits, des articles, etc. 

"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { Slot } from "@radix-ui/react-slot";

// Palette de couleurs pour les boutons
const buttonColors = {
  // Couleurs primaires
  primary: {
    base: "bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover focus:ring-btn-primary-focus/50 dark:bg-primary-600 dark:text-white dark:hover:bg-primary-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-btn-primary text-btn-primary hover:bg-primary-50 focus:ring-btn-primary-focus/30 dark:border-primary-400 dark:text-primary-300 dark:hover:bg-primary-900/20",
    ghost: "text-btn-primary hover:bg-primary-50 focus:ring-btn-primary-focus/30 dark:text-primary-300 dark:hover:bg-primary-900/20",
  },
  // Couleurs secondaires
  secondary: {
    base: "bg-btn-secondary text-btn-secondary-text hover:bg-btn-secondary-hover focus:ring-btn-secondary-focus/50 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 shadow-sm",
    outline: "border-2 border-btn-secondary text-btn-secondary hover:bg-gray-100 focus:ring-btn-secondary-focus/30 dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-800/50",
    ghost: "text-btn-secondary hover:bg-gray-100 focus:ring-btn-secondary-focus/30 dark:text-gray-300 dark:hover:bg-gray-800/50",
  },
  // Couleurs de succès
  success: {
    base: "bg-btn-success text-btn-success-text hover:bg-btn-success-hover focus:ring-btn-success-focus/50 dark:bg-green-600 dark:text-white dark:hover:bg-green-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-btn-success text-btn-success hover:bg-green-50 focus:ring-btn-success-focus/30 dark:border-green-500 dark:text-green-300 dark:hover:bg-green-900/20",
    ghost: "text-btn-success hover:bg-green-50 focus:ring-btn-success-focus/30 dark:text-green-400 dark:hover:bg-green-900/20",
  },
  // Couleurs d'alerte
  warning: {
    base: "bg-btn-warning text-btn-warning-text hover:bg-btn-warning-hover focus:ring-btn-warning-focus/50 dark:bg-amber-600 dark:text-white dark:hover:bg-amber-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-btn-warning text-btn-warning hover:bg-amber-50 focus:ring-btn-warning-focus/30 dark:border-amber-500 dark:text-amber-300 dark:hover:bg-amber-900/20",
    ghost: "text-btn-warning hover:bg-amber-50 focus:ring-btn-warning-focus/30 dark:text-amber-400 dark:hover:bg-amber-900/20",
  },
  // Couleurs de danger
  danger: {
    base: "bg-btn-danger text-btn-danger-text hover:bg-btn-danger-hover focus:ring-btn-danger-focus/50 dark:bg-red-600 dark:text-white dark:hover:bg-red-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-btn-danger text-btn-danger hover:bg-red-50 focus:ring-btn-danger-focus/30 dark:border-red-500 dark:text-red-300 dark:hover:bg-red-900/20",
    ghost: "text-btn-danger hover:bg-red-50 focus:ring-btn-danger-focus/30 dark:text-red-400 dark:hover:bg-red-900/20",
  },
  // Couleurs d'info
  info: {
    base: "bg-btn-info text-btn-info-text hover:bg-btn-info-hover focus:ring-btn-info-focus/50 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-btn-info text-btn-info hover:bg-blue-50 focus:ring-btn-info-focus/30 dark:border-blue-500 dark:text-blue-300 dark:hover:bg-blue-900/20",
    ghost: "text-btn-info hover:bg-blue-50 focus:ring-btn-info-focus/30 dark:text-blue-300 dark:hover:bg-blue-900/20",
  },
  // Couleurs pour créer/ajouter
  create: {
    base: "bg-btn-create text-btn-create-text hover:bg-btn-create-hover focus:ring-btn-create-focus/50 dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-btn-create text-btn-create hover:bg-emerald-50 focus:ring-btn-create-focus/30 dark:border-emerald-500 dark:text-emerald-300 dark:hover:bg-emerald-900/20",
    ghost: "text-btn-create hover:bg-emerald-50 focus:ring-btn-create-focus/30 dark:text-emerald-400 dark:hover:bg-emerald-900/20",
  },
  // Couleurs pour modifier/éditer
  edit: {
    base: "bg-btn-edit text-btn-edit-text hover:bg-btn-edit-hover focus:ring-btn-edit-focus/50 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-btn-edit text-btn-edit hover:bg-indigo-50 focus:ring-btn-edit-focus/30 dark:border-indigo-500 dark:text-indigo-300 dark:hover:bg-indigo-900/20",
    ghost: "text-btn-edit hover:bg-indigo-50 focus:ring-btn-edit-focus/30 dark:text-indigo-300 dark:hover:bg-indigo-900/20",
  },
  // Couleurs pour annuler
  cancel: {
    base: "bg-btn-cancel text-btn-cancel-text hover:bg-btn-cancel-hover focus:ring-btn-cancel-focus/50 dark:bg-gray-500 dark:text-white dark:hover:bg-gray-600 shadow-md hover:shadow-lg",
    outline: "border-2 border-btn-cancel text-btn-cancel hover:bg-gray-50 focus:ring-btn-cancel-focus/30 dark:border-gray-400 dark:text-gray-300 dark:hover:bg-gray-800/30",
    ghost: "text-btn-cancel hover:bg-gray-100 focus:ring-btn-cancel-focus/30 dark:text-gray-400 dark:hover:bg-gray-800/30",
  },
  // Couleurs pour sauvegarder
  save: {
    base: "bg-btn-save text-btn-save-text hover:bg-btn-save-hover focus:ring-btn-save-focus/50 dark:bg-teal-600 dark:text-white dark:hover:bg-teal-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-btn-save text-btn-save hover:bg-teal-50 focus:ring-btn-save-focus/30 dark:border-teal-500 dark:text-teal-300 dark:hover:bg-teal-900/20",
    ghost: "text-btn-save hover:bg-teal-50 focus:ring-btn-save-focus/30 dark:text-teal-300 dark:hover:bg-teal-900/20",
  },
};

// Définition des dégradés
const gradientStyles = {
  "default": "from-btn-primary to-primary-500 hover:from-btn-primary-hover hover:to-primary-600 dark:from-primary-500 dark:to-primary-400 dark:hover:from-primary-600 dark:hover:to-primary-500 focus:ring-btn-primary-focus/30",
  "violet-blue": "from-violet-600 to-blue-500 hover:from-violet-700 hover:to-blue-600 dark:from-violet-500 dark:to-blue-400 dark:hover:from-violet-600 dark:hover:to-blue-500 focus:ring-blue-500/30",
  "blue-cyan": "from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 dark:from-blue-500 dark:to-cyan-400 dark:hover:from-blue-600 dark:hover:to-cyan-500 focus:ring-blue-500/30",
  "green-emerald": "from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 dark:from-green-500 dark:to-emerald-400 dark:hover:from-green-600 dark:hover:to-emerald-500 focus:ring-green-500/30",
  "orange-red": "from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 dark:from-orange-500 dark:to-red-400 dark:hover:from-orange-600 dark:hover:to-red-500 focus:ring-red-500/30",
  "purple-pink": "from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 dark:from-purple-500 dark:to-pink-400 dark:hover:from-purple-600 dark:hover:to-pink-500 focus:ring-pink-500/30",
  "indigo-purple": "from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 dark:from-indigo-500 dark:to-purple-400 dark:hover:from-indigo-600 dark:hover:to-purple-500 focus:ring-purple-500/30",
  "teal-cyan": "from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600 dark:from-teal-500 dark:to-cyan-400 dark:hover:from-teal-600 dark:hover:to-cyan-500 focus:ring-teal-500/30",
  "emerald-green": "from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 dark:from-emerald-500 dark:to-green-400 dark:hover:from-emerald-600 dark:hover:to-green-500 focus:ring-emerald-500/30",
};

export type ButtonVariant = 
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "gradient";

export type ButtonSize = "default" | "sm" | "lg" | "icon";
export type ButtonColor = keyof typeof buttonColors;
export type GradientType = keyof typeof gradientStyles;

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface BaseButtonProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  gradient?: GradientType;
  withMotion?: boolean;
  className?: string;
  asChild?: boolean;
}

type RegularButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement>;
type MotionButtonProps = BaseButtonProps & HTMLMotionProps<"button">;
type ButtonProps = RegularButtonProps | MotionButtonProps;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = "default",
    size = "default",
    color = "primary",
    fullWidth = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    gradient = "default",
    withMotion = false,
    className,
    disabled,
    asChild = false,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const baseStyles = "font-medium rounded-lg inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-offset-1";

    // Sélectionner le style basé sur variante et couleur
    const getVariantStyle = () => {
      if (variant === "outline") {
        return buttonColors[color]?.outline || buttonColors.primary.outline;
      } else if (variant === "ghost") {
        return buttonColors[color]?.ghost || buttonColors.primary.ghost;
      } else if (variant === "gradient") {
        return `bg-gradient-to-r text-white shadow-md hover:shadow-lg ${gradientStyles[gradient]}`;
      } else {
        // Pour primary, secondary, danger, success, warning, info
        return buttonColors[color]?.base || buttonColors.primary.base;
      }
    };

    // Styles selon la taille
    const sizeStyles = {
      default: "text-sm px-4 py-2.5",
      sm: "text-xs px-2.5 py-1.5",
      lg: "text-base px-6 py-3",
      icon: "h-10 w-10",
    };

    // Style pour la largeur
    const widthStyles = fullWidth ? "w-full" : "";

    const buttonClassNames = cn(
      baseStyles,
      getVariantStyle(),
      sizeStyles[size],
      widthStyles,
      "disabled:opacity-50 disabled:cursor-not-allowed",
      className
    );

    // Animations pour Framer Motion
    const motionProps = {
      whileHover: { scale: 1.02, transition: { duration: 0.2 } },
      whileTap: { scale: 0.98 },
    };

    if (withMotion) {
      return (
        <motion.button
          disabled={disabled || isLoading}
          className={buttonClassNames}
          {...motionProps}
          {...(props as HTMLMotionProps<"button">)}
        >
          {isLoading ? (
            <>
              <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Chargement...
            </>
          ) : (
            <>
              {leftIcon && <span className={cn("mr-2", !children && "mr-0")}>{leftIcon}</span>}
              {children}
              {rightIcon && <span className={cn("ml-2", !children && "ml-0")}>{rightIcon}</span>}
            </>
          )}
        </motion.button>
      );
    }

    return (
      <Comp
        disabled={disabled || isLoading}
        className={buttonClassNames}
        ref={ref}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {isLoading ? (
          <>
            <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Chargement...
          </>
        ) : (
          <>
            {leftIcon && <span className={cn("mr-2", !children && "mr-0")}>{leftIcon}</span>}
            {children}
            {rightIcon && <span className={cn("ml-2", !children && "ml-0")}>{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
)
Button.displayName = "Button"

export { Button, buttonColors, gradientStyles, buttonVariants }; 