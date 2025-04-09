// ce fichier gere le composant badge
// le composant badge est represente par un petit rectangle avec un texte
// exemple : les badges dans les pages de gestion des utilisateurs, des produits, des articles, etc.

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"


// creation des variants du composant badge 
// on utilise cva pour creer les variants du composant badge 
// on utilise cn pour gerer les classes css
// on utilise variant pour gerer les variants du composant badge 
// on utilise defaultVariants pour gerer les variants par defaut du composant badge 

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)


// le export interface BadgeProps permet de gerer les props du composant badge
// on utilise extends pour gerer les props du composant badge
// on utilise React.HTMLAttributes<HTMLDivElement> pour gerer les props du composant badge
// on utilise VariantProps pour gerer les variants du composant badge
// on utilise badgeVariants pour gerer les variants du composant badge

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants } 