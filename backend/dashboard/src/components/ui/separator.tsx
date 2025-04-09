// ce fichier gere le composant separator
// le composant separator est un composant qui permet de gerer les données dans les components
// car on a besoin de gerer les données dans les components

// on utilise use client pour gerer le composant separator
// on utilise React pour gerer le composant separator
// on utilise SeparatorPrimitive pour gerer le composant separator
// on utilise cn pour gerer les classes css

// lobjectifs du seperator est de creer un separateur entre les composants 
// on utilise orientation pour gerer l'orientation du separateur

"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator } 