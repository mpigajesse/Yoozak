// ce fichier gere le composant label
// le composant label est un composant qui permet de gerer les données dans les components
// car on a besoin de gerer les données dans les components

"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

// creation du composant label
// on utilise React.forwardRef pour creer le composant label
// on utilise cn pour gerer les classes css
// on utilise className pour gerer les classes css
// on utilise props pour gerer les props du composant label
// on utilise ref pour gerer le ref du composant label

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label } 