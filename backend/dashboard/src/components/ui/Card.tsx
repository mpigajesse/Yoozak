// ce fichier gere le composant card
// le composant card est un composant qui permet de gerer les données dans les components
// car on a besoin de gerer les données dans les components
// exemple : les cartes dans les pages de gestion des utilisateurs, des produits, des articles, etc.


"use client";

import * as React from "react"
import { cn } from "@/lib/utils"

// creation du composant card
// on utilise React.forwardRef pour creer le composant card
// on utilise cn pour gerer les classes css
// on utilise className pour gerer les classes css
// on utilise props pour gerer les props du composant card
// on utilise ref pour gerer le ref du composant card

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"


// creation du composant cardHeader
// on utilise React.forwardRef pour creer le composant cardHeader
// on utilise cn pour gerer les classes css
// on utilise className pour gerer les classes css
// on utilise props pour gerer les props du composant cardHeader
// on utilise ref pour gerer le ref du composant cardHeader

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"


// creation du composant cardTitle
// on utilise React.forwardRef pour creer le composant cardTitle
// on utilise cn pour gerer les classes css
// on utilise className pour gerer les classes css
// on utilise props pour gerer les props du composant cardTitle
// on utilise ref pour gerer le ref du composant cardTitle

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"


// creation du composant cardDescription
// on utilise React.forwardRef pour creer le composant cardDescription
// on utilise cn pour gerer les classes css
// on utilise className pour gerer les classes css
// on utilise props pour gerer les props du composant cardDescription
// on utilise ref pour gerer le ref du composant cardDescription

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"


// creation du composant cardContent
// on utilise React.forwardRef pour creer le composant cardContent
// on utilise cn pour gerer les classes css
// on utilise className pour gerer les classes css
// on utilise props pour gerer les props du composant cardContent
// on utilise ref pour gerer le ref du composant cardContent

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"


// creation du composant cardFooter
// on utilise React.forwardRef pour creer le composant cardFooter
// on utilise cn pour gerer les classes css
// on utilise className pour gerer les classes css
// on utilise props pour gerer les props du composant cardFooter
// on utilise ref pour gerer le ref du composant cardFooter

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } 