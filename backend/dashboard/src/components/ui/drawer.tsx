// ce fichier gere le composant drawer
// le composant drawer est un composant qui permet de gerer les données dans les components
// car on a besoin de gerer les données dans les components
// exemple : les tiroirs dans les pages de gestion des utilisateurs, des produits, des articles, etc.

// creation du composant drawer
import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

// creation de l'interface drawerProps
// on utilise React.HTMLAttributes<HTMLDivElement> pour creer l'interface drawerProps
// on utilise open pour gerer la visibilite du tiroir
// on utilise onOpenChange pour gerer la visibilite du tiroir
// on utilise onClose pour gerer la visibilite du tiroir
// on utilise side pour gerer la position du tiroir 

interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  side?: "left" | "right";
}

// creation du composant drawer
// on utilise React.forwardRef pour creer le composant drawer
const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  ({ className, children, open, onOpenChange, onClose, side = "left", ...props }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(open || false)

    React.useEffect(() => {
      if (open !== undefined) {
        setInternalOpen(open)
      }
    }, [open])

    const handleOpenChange = React.useCallback(
      (open: boolean) => {
        setInternalOpen(open)
        onOpenChange?.(open)
      },
      [onOpenChange]
    )

    // Gestion du verrouillage du défilement lorsque le tiroir est ouvert
    React.useEffect(() => {
      if (internalOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
      return () => {
        document.body.style.overflow = ''
      }
    }, [internalOpen])

    // Gestion de la touche Escape pour fermer le tiroir
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && internalOpen) {
          handleOpenChange(false)
          onClose?.()
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [internalOpen, handleOpenChange, onClose])

    if (!internalOpen) {
      return null
    }

    return (
      <div 
        className={cn("fixed inset-0 z-50 overflow-hidden")}
        {...props}
      >
        {/* Overlay pour fermer le tiroir avec effet de flou */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => {
            handleOpenChange(false)
            onClose?.()
          }}
        />
        
        {/* Conteneur du tiroir avec animation */}
        <div
          className={cn(
            "fixed inset-y-0 flex flex-col max-h-screen z-50 w-full max-w-xs bg-white shadow-xl transition transform duration-300 ease-in-out dark:bg-gray-900",
            side === "left" ? "left-0" : "right-0",
            className
          )}
          ref={ref}
        >
          {/* Bouton de fermeture */}
          <div className="absolute right-4 top-4">
            <button
              onClick={() => {
                handleOpenChange(false)
                onClose?.()
              }}
              className="rounded-full h-8 w-8 flex items-center justify-center bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </button>
          </div>
          
          {/* Contenu du tiroir avec défilement */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-6 touch-pan-y">
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Drawer.displayName = "Drawer"

export { Drawer } 