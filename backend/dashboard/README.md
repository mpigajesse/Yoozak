# Dashboard Administrateur Yoozak

Ce dashboard est conçu pour administrer la plateforme e-commerce Yoozak. Il offre une interface moderne, intuitive et réactive permettant de gérer tous les aspects de l'application.

## Technologies utilisées

- **Next.js** - Framework React pour le rendu côté serveur et les applications web modernes
- **React** - Bibliothèque JavaScript pour créer des interfaces utilisateur
- **TypeScript** - Typage statique pour JavaScript
- **Tailwind CSS** - Framework CSS utilitaire pour un design rapide et responsive
- **Zustand** - Bibliothèque de gestion d'état légère
- **SWR** - Stratégie de récupération de données avec mise en cache
- **Axios** - Client HTTP pour les requêtes API
- **Chart.js** - Bibliothèque de graphiques HTML5
- **React Hook Form** - Gestion de formulaires performante

## Structure du projet

```
dashboard/
├── public/              # Fichiers statiques
├── src/
│   ├── components/      # Composants réutilisables
│   │   ├── ui/          # Composants d'interface de base
│   │   ├── layouts/     # Composants de mise en page
│   │   ├── forms/       # Composants de formulaires
│   │   ├── tables/      # Composants de tableaux
│   │   ├── charts/      # Composants de graphiques
│   │   └── modals/      # Fenêtres modales
│   ├── hooks/           # Hooks personnalisés
│   ├── contexts/        # Contextes React
│   ├── lib/             # Fonctions utilitaires et configuration
│   ├── store/           # Magasins Zustand
│   ├── types/           # Définitions de types TypeScript
│   ├── services/        # Services d'appels API
│   └── app/             # Structure Next.js App Router
│       ├── layout.tsx   # Layout principal
│       ├── page.tsx     # Page d'accueil
│       ├── login/       # Pages d'authentification
│       ├── dashboard/   # Pages du tableau de bord
│       ├── products/    # Gestion des produits
│       ├── clients/     # Gestion des clients
│       ├── commandes/   # Gestion des commandes
│       ├── users/       # Gestion des utilisateurs
│       └── settings/    # Paramètres
├── tailwind.config.js   # Configuration Tailwind CSS
├── next.config.js       # Configuration Next.js
└── tsconfig.json        # Configuration TypeScript
```

## Fonctionnalités

- **Authentification sécurisée** - Gestion des sessions avec JWT
- **Tableau de bord** - Vue d'ensemble des métriques clés
- **Gestion des produits** - CRUD complet pour les produits, catégories, etc.
- **Gestion des clients** - Informations clients et statistiques
- **Gestion des commandes** - Suivi et gestion des commandes
- **Rapports et analyses** - Graphiques et tableaux analytiques
- **Thème clair/sombre** - Support de plusieurs thèmes
- **Interface responsive** - Compatible mobile et tablette

## Installation

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev

# Génération de la build de production
npm run build

# Démarrage du serveur de production
npm start
```

## Connexion API

Le dashboard se connecte à l'API Django REST Framework du backend Yoozak. La configuration de connexion se trouve dans le fichier `.env.local`.

## Contribution

Pour contribuer au projet, veuillez suivre les conventions de code et créer des pull requests pour toute nouvelle fonctionnalité ou correction de bug. 