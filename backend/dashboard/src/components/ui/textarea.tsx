// ce fichier gere le composant textarea
// le composant textarea est un composant qui permet de gerer les données dans les components
// car on a besoin de gerer les données dans les components pour creer un composant textarea

import * as React from "react"
import { cn } from "@/lib/utils"

// creation de l'interface TextareaProps
// on utilise React.TextareaHTMLAttributes pour hériter de la classe React.TextareaHTMLAttributes

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// creation du composant textarea
// on utilise React.forwardRef pour creer le composant textarea
// on utilise TextareaProps pour hériter de la classe TextareaProps

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea } 