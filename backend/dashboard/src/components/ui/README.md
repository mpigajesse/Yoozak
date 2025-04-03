# Composants UI pour le Dashboard Yoozak

Ce dossier contient des composants réutilisables pour l'interface utilisateur du dashboard administrateur Yoozak. Ces composants sont conçus pour être modulaires, accessibles et animés avec Framer Motion.

## Liste des composants

### 🎨 Composants de base

- **Button** : Bouton avec plusieurs variantes, tailles et animations.
- **Card** : Conteneur pour afficher des informations avec des sous-composants (Header, Content, Footer).
- **PageTransition** : Wrapper pour animer les transitions entre les pages.
- **StatsCard** : Cartes de statistiques animées pour le tableau de bord.

## Utilisation

### Button

```tsx
import Button from "@/components/ui/Button";
import { FiPlus } from "react-icons/fi";

// Bouton simple
<Button>Cliquez-moi</Button>

// Bouton avec variante
<Button variant="danger">Supprimer</Button>

// Bouton avec icône
<Button leftIcon={<FiPlus />}>Ajouter</Button>

// Bouton de chargement
<Button isLoading>Chargement</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";

<Card hoverEffect>
  <CardHeader>
    <CardTitle>Titre de la carte</CardTitle>
  </CardHeader>
  <CardContent>
    Contenu de la carte...
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### PageTransition

```tsx
import PageTransition from "@/components/ui/PageTransition";

export default function MaPage() {
  return (
    <PageTransition>
      <div>Contenu de la page</div>
    </PageTransition>
  );
}
```

### StatsCard

```tsx
import StatsCard from "@/components/ui/StatsCard";
import { FiUsers } from "react-icons/fi";

<StatsCard
  title="Utilisateurs"
  value="1,234"
  icon={<FiUsers size={24} />}
  trend="up"
  trendValue="12%"
  trendLabel="depuis le mois dernier"
/>
```

## Convention de style

Tous les composants utilisent :

- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **React Icons** pour les icônes
- La fonction utilitaire `cn()` pour fusionner les classes Tailwind

## Thèmes

Les composants sont compatibles avec le mode sombre/clair et utilisent les variables CSS définies dans `globals.css`. 