# Yoozak - Plateforme E-commerce

## Architecture de Gestion des Utilisateurs

### Vue d'ensemble

La plateforme Yoozak utilise une architecture avancée pour la gestion des utilisateurs, basée sur une hiérarchie organisationnelle par pôles, services et équipes. Cette structure permet une grande flexibilité dans la gestion des utilisateurs, des rôles et des permissions.

```
┌─────────────────────────────────────────────────────┐
│                      YOOZAK                         │
└─────────────┬─────────────────────┬─────────────────┘
              │                     │
    ┌─────────▼────────┐   ┌────────▼─────────┐
    │      PÔLES       │   │   UTILISATEURS   │
    └─────────┬────────┘   └────────┬─────────┘
              │                     │
    ┌─────────▼────────┐   ┌────────▼─────────┐
    │     SERVICES     │◄──┤      RÔLES       │
    └─────────┬────────┘   └──────────────────┘
              │
    ┌─────────▼────────┐
    │      ÉQUIPES     │
    └──────────────────┘
```

### Structure Organisationnelle

Yoozak organise ses utilisateurs en trois pôles principaux, chacun avec des services spécifiques :

#### 1. Pôle CLIENTS
Gestion de l'expérience client et des interactions :
- **Clients** : Gestion des profils clients
- **Avis** : Gestion des avis et feedbacks produits
- **CRM** : Relation client et communication

#### 2. Pôle COMMANDES
Traitement des commandes et logistique :
- **Commandes** : Traitement des commandes clients
- **Paniers** : Gestion des paniers d'achat
- **Livraisons** : Suivi des expéditions
- **Retours** : Gestion des retours et remboursements

#### 3. Pôle PRODUCTS
Gestion du catalogue et des produits :
- **Catalogues** : Organisation du catalogue
- **Catégories** : Classification des produits
- **Produits** : Gestion des fiches produits
- **Promotions** : Gestion des offres spéciales

### Modèles et Relations

La gestion des utilisateurs repose sur plusieurs modèles Django interconnectés :

- **User** : Modèle de base Django pour l'authentification
- **UserProfile** : Extension du profil utilisateur avec informations métier
- **Pole** : Entité représentant un pôle métier
- **Service** : Subdivision d'un pôle avec responsabilités spécifiques
- **Team** : Groupe de travail au sein d'un service
- **UserRole** : Attribution de rôles à un utilisateur dans le contexte d'un pôle/service

### Système de Rôles et Permissions

Yoozak utilise un système de rôles contextuels qui définit les permissions des utilisateurs selon leur position dans l'organisation :

- **SuperAdmin** : Accès complet à toutes les fonctionnalités
- **Directeur de Pôle** : Gestion complète d'un pôle spécifique
- **Responsable de Service** : Gestion limitée aux services sous sa responsabilité
- **Membre d'Équipe** : Accès restreint aux fonctionnalités nécessaires à son rôle

Les permissions sont appliquées dynamiquement en fonction du contexte utilisateur, permettant une expérience UI personnalisée.

## Dashboard de Gestion

Le dashboard Yoozak est une interface React (Next.js) qui permet de gérer l'ensemble de l'organisation et des utilisateurs.

### Fonctionnalités principales

1. **Gestion des utilisateurs**
   - Création et modification des profils utilisateurs
   - Attribution de rôles par pôle/service/équipe
   - Gestion des permissions et accès

2. **Gestion organisationnelle**
   - Configuration des pôles, services et équipes
   - Définition des responsables et hiérarchies
   - Visualisation de l'organigramme

3. **Interface adaptative**
   - Affichage dynamique selon les rôles de l'utilisateur
   - Navigation contextuelle par pôle et service
   - Tableaux de bord personnalisés par rôle

### Pages principales du Dashboard

- **/dashboard** : Vue générale
- **/users** : Gestion des utilisateurs
- **/users/[id]** : Détail d'un profil utilisateur
- **/organisation** : Vue organisationnelle
- **/organisation/poles** : Gestion des pôles
- **/organisation/services** : Gestion des services
- **/organisation/teams** : Gestion des équipes

## Technologies Utilisées

### Backend (Django)
- Django 5.1+ pour le modèle de données et l'API
- Django REST Framework pour les endpoints API
- JWT pour l'authentification sécurisée
- PostgreSQL pour le stockage persistent

### Frontend (React)
- Next.js 14+ pour le rendering et le routing
- React pour les composants UI
- Shadcn/UI pour les composants d'interface
- TailwindCSS pour le styling

## API et Endpoints

Le backend expose plusieurs endpoints REST pour la gestion des utilisateurs :

- **Authentication**
  - `/api/token/` : Obtenir un token JWT
  - `/api/token/refresh/` : Rafraîchir le token
  - `/api/token/verify/` : Vérifier la validité du token

- **Utilisateurs**
  - `/api/users/` : Liste et création d'utilisateurs
  - `/api/users/{id}/` : Détails, modification et suppression d'un utilisateur
  - `/api/users/current/` : Utilisateur actuellement connecté
  - `/api/users/{id}/roles/` : Rôles d'un utilisateur

- **Organisation**
  - `/api/poles/` : Gestion des pôles
  - `/api/services/` : Gestion des services
  - `/api/teams/` : Gestion des équipes

## Installation et Configuration

### Prérequis
- Python 3.9+
- Node.js 18+
- PostgreSQL 12+

### Installation du Backend
```bash
# Cloner le repository
git clone https://github.com/your-username/yoozak.git

# Configurer l'environnement virtuel
cd yoozak/backend
python -m venv env
source env/bin/activate  # Sur Windows : env\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Appliquer les migrations
python manage.py migrate

# Créer un super utilisateur
python manage.py createsuperuser

# Lancer le serveur
python manage.py runserver
```

### Installation du Frontend
```bash
# Naviguer vers le dossier frontend
cd yoozak/backend/dashboard

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## Utilisation du Dashboard

1. Connectez-vous avec vos identifiants admin
2. Commencez par configurer les pôles dans la section Organisation
3. Créez les services et équipes nécessaires
4. Ajoutez des utilisateurs et attribuez-leur des rôles
5. Configurez les permissions spécifiques si nécessaire

## Extensions Futures

- Intégration avec Active Directory/LDAP
- Support multi-organisations
- Authentification multi-facteurs
- Délégation temporaire de rôles
- Workflow d'approbation de permissions
- Organigramme dynamique interactif

## Support

Pour obtenir de l'aide ou signaler un problème, veuillez contacter l'équipe technique Yoozak :
- Email : support@yoozak.com
- Documentation : https://docs.yoozak.com