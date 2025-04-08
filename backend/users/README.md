# Architecture de Gestion des Utilisateurs de Yoozak

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Structure des modèles](#structure-des-modèles)
3. [Structure organisationnelle de Yoozak](#structure-organisationnelle-de-yoozak)
4. [Système de rôles et permissions](#système-de-rôles-et-permissions)
5. [Relations entre entités](#relations-entre-entités)
6. [Flux d'authentification](#flux-dauthentification)
7. [APIs et endpoints](#apis-et-endpoints)
8. [Considérations de sécurité](#considérations-de-sécurité)
9. [Évolutivité](#évolutivité)

## Vue d'ensemble

L'architecture de gestion des utilisateurs de Yoozak est basée sur une extension du modèle User de Django, permettant une organisation hiérarchique par pôles, services et équipes. Cette structure offre une flexibilité maximale tout en maintenant la robustesse du système d'authentification Django, tout en s'adaptant aux spécificités d'une plateforme e-commerce.

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

## Structure des modèles

### Modèle User (Django)

Nous utilisons le modèle User natif de Django comme base, qui fournit:
- Authentification
- Gestion des mots de passe
- Permissions de base

### UserProfile
```
┌───────────────────────┐
│     UserProfile       │
├───────────────────────┤
│ user (OneToOne)       │
│ matricule             │
│ photo                 │
│ telephone             │
│ adresse               │
│ date_embauche         │
│ poste                 │
│ biographie            │
│ compétences           │
│ role_principal        │
│ est_actif             │
└───────────────────────┘
```

### Pole
```
┌───────────────────────┐
│         Pole          │
├───────────────────────┤
│ nom                   │
│ description           │
│ responsable (User)    │
│ date_creation         │
│ est_actif             │
└───────────────────────┘
```

### Service
```
┌───────────────────────┐
│       Service         │
├───────────────────────┤
│ nom                   │
│ description           │
│ pole (ForeignKey)     │
│ responsable (User)    │
│ membres (ManyToMany)  │
│ date_creation         │
│ est_actif             │
└───────────────────────┘
```

### Team (Optionnel)
```
┌───────────────────────┐
│         Team          │
├───────────────────────┤
│ nom                   │
│ description           │
│ service (ForeignKey)  │
│ responsable (User)    │
│ membres (ManyToMany)  │
│ date_creation         │
│ est_actif             │
└───────────────────────┘
```

### UserRole
```
┌───────────────────────┐
│       UserRole        │
├───────────────────────┤
│ user (ForeignKey)     │
│ pole (ForeignKey)     │
│ service (ForeignKey)  │
│ team (ForeignKey)     │
│ role                  │
│ date_attribution      │
│ est_actif             │
└───────────────────────┘
```

## Structure organisationnelle de Yoozak

En tant que plateforme e-commerce, Yoozak organise ses pôles et services pour répondre aux besoins spécifiques de son activité. Voici la structure organisationnelle détaillée:

### 1. Pôle CLIENTS
```
┌───────────────────────────────────┐
│             CLIENTS               │
└───────────────┬───────────────────┘
                │
    ┌───────────┼───────────┬───────────────┐
    │           │           │               │
┌───▼───┐   ┌───▼───┐   ┌───▼───┐       ┌───▼───┐
│ Clients│   │ Avis  │   │Favoris│       │ CRM   │
└───────┘   └───────┘   └───────┘       └───────┘
```

**Services et responsabilités:**
- **Clients**: Gestion des profils clients, historique d'achat
- **Avis**: Gestion des avis et notations produits
- **Favoris**: Gestion des listes de favoris clients
- **CRM**: Relation client et communication

### 2. Pôle COMMANDES
```
┌───────────────────────────────────────────────────────────────┐
│                          COMMANDES                            │
└───────┬───────────┬───────────┬───────────┬─────────┬─────────┘
        │           │           │           │         │
    ┌───▼───┐   ┌───▼───┐   ┌───▼───┐   ┌───▼───┐ ┌───▼───┐
    │Commandes│  │Paniers│   │Remises│   │Retours│ │États  │
    └───────┘   └───────┘   └───────┘   └───────┘ └───────┘
                    │
            ┌───────▼───────┐
            │Lignes de      │
            │commande       │
            └───────────────┘
                    │
            ┌───────▼───────┐
            │Codes promo    │
            │               │
            └───────────────┘
```

**Services et responsabilités:**
- **Commandes**: Gestion des commandes clients
- **Paniers**: Gestion des paniers d'achat
- **Lignes de commande**: Détails des produits commandés
- **Remises**: Gestion des remises et promotions
- **Codes promo**: Création et gestion des codes promotionnels
- **Retours**: Gestion des retours et remboursements
- **États de commande**: Suivi des statuts de commande

### 3. Pôle PRODUCTS
```
┌───────────────────────────────────────────────────────────────────┐
│                            PRODUCTS                               │
└───────┬───────────┬───────────┬───────────┬─────────┬──────▼──────┘
        │           │           │           │         │         │
    ┌───▼───┐   ┌───▼───┐   ┌───▼───┐   ┌───▼───┐ ┌───▼───┐ ┌───▼───┐
    │Articles│  │Catalogues│ │Catégo-│   │Créatives│ │Produits│ │Promotions│
    └───────┘   └───────┘   │ries   │   └───────┘ └───────┘ └───────┘
                            └───────┘      
                                │                       │
                        ┌───────▼───────┐       ┌───────▼───────┐
                        │Sous-catégories│       │Produits-      │
                        │               │       │Catalogues     │
                        └───────────────┘       └───────────────┘
                                                        │
                                                ┌───────▼───────┐
                                                │Produits-      │
                                                │Catégories     │
                                                └───────────────┘
```

**Services et responsabilités:**
- **Articles**: Gestion des articles individuels
- **Catalogues**: Gestion des catalogues de produits
- **Catégories**: Classification des produits
- **Sous-catégories**: Sous-classification des produits
- **Créatives**: Ressources visuelles et marketing pour les produits
- **Produits**: Base de données principale des produits
- **Produits-Catalogues**: Association entre produits et catalogues
- **Produits-Catégories**: Association entre produits et catégories
- **Promotions**: Gestion des promotions spéciales

## Système de rôles et permissions

### Rôles globaux
- **SuperAdmin**: Accès complet à toutes les fonctionnalités
- **Admin**: Gestion administrative avec restrictions spécifiques
- **Manager**: Gestion des équipes et fonctionnalités métier
- **Employee**: Accès standard aux fonctionnalités utilisateur
- **External**: Partenaires ou clients avec accès limité

### Rôles contextuels par pôle
**Pôle CLIENTS:**
- **DirecteurClients**: Supervision de tous les services clients
- **ResponsableCRM**: Gestion de la relation client
- **GestionnaireAvis**: Modération et analyse des avis

**Pôle COMMANDES:**
- **DirecteurCommandes**: Supervision du processus de commande
- **ResponsableLogistique**: Gestion des expéditions et retours
- **GestionnairePromo**: Administration des codes promo

**Pôle PRODUCTS:**
- **DirecteurProduits**: Supervision du catalogue produit
- **ResponsableCatalogue**: Gestion des catalogues
- **GestionnairePromotion**: Administration des offres spéciales

### Matrice de permissions (exemple pour le pôle PRODUCTS)
```
┌─────────────────┬───────────┬───────────────┬────────────────┬────────────────┐
│ Fonctionnalité  │SuperAdmin │DirecteurProduits│ResponsableCatalogue│GestionnairePromotion│
├─────────────────┼───────────┼───────────────┼────────────────┼────────────────┤
│ Products/Create │     ✓     │       ✓       │        ✓       │        -       │
│ Products/Edit   │     ✓     │       ✓       │        ✓       │        -       │
│ Products/Delete │     ✓     │       ✓       │        -       │        -       │
│ Catalogues/Manage│    ✓     │       ✓       │        ✓       │        -       │
│ Catégories/Manage│    ✓     │       ✓       │        ✓       │        -       │
│ Promotions/Manage│    ✓     │       ✓       │        -       │        ✓       │
└─────────────────┴───────────┴───────────────┴────────────────┴────────────────┘
```

## Relations entre entités

### Diagramme entité-relation
```
┌──────────┐       ┌────────────┐       ┌─────────┐
│   User   │◄─────►│UserProfile │       │  Pole   │
└────┬─────┘       └──────▲─────┘       └────┬────┘
     │                    │                   │
     │                    │                   │
     │                    │                   │
     │                    │                   │
     │                    │              ┌────▼────┐
     │                    │              │ Service │
     └───────────────────┐│              └────┬────┘
                         ││                   │
                    ┌────▼▼───┐          ┌────▼────┐
                    │ UserRole│◄─────────│  Team   │
                    └─────────┘          └─────────┘
```

## Flux d'authentification

### Processus de connexion
1. L'utilisateur entre ses identifiants (email/username + mot de passe)
2. Django authentifie l'utilisateur
3. Le système récupère le profil et les rôles associés
4. Un token JWT est généré avec les claims appropriés
5. L'UI s'adapte selon les permissions de l'utilisateur

### Structure du token JWT
```json
{
  "sub": "user_id",
  "name": "Full Name",
  "email": "user@yoozak.com",
  "roles": ["Manager", "DirecteurProduits"],
  "pole_id": 2,
  "service_ids": [3, 5],
  "team_ids": [7],
  "exp": 1678765432,
  "iat": 1678754321
}
```

## APIs et endpoints

### Authentification
- `POST /api/auth/login/` - Connexion utilisateur
- `POST /api/auth/refresh/` - Rafraîchir le token JWT
- `POST /api/auth/logout/` - Déconnexion
- `POST /api/auth/password-reset/` - Réinitialisation du mot de passe

### Utilisateurs
- `GET /api/users/` - Liste des utilisateurs (avec filtres)
- `POST /api/users/` - Créer un utilisateur
- `GET /api/users/{id}/` - Détails d'un utilisateur
- `PUT /api/users/{id}/` - Modifier un utilisateur
- `DELETE /api/users/{id}/` - Supprimer un utilisateur

### Pôles et Services
- `GET /api/poles/` - Liste des pôles
- `POST /api/poles/` - Créer un pôle
- `GET /api/poles/{id}/services/` - Services d'un pôle
- `GET /api/services/{pole_id}/` - Liste des services d'un pôle
- `GET /api/services/{service_id}/users/` - Utilisateurs d'un service

### Endpoints spécifiques par pôle

**Pôle CLIENTS:**
- `GET /api/clients/` - Liste des clients
- `GET /api/avis/` - Liste des avis
- `GET /api/favoris/` - Liste des favoris

**Pôle COMMANDES:**
- `GET /api/commandes/` - Liste des commandes
- `GET /api/paniers/` - Liste des paniers
- `GET /api/lignes-commande/` - Liste des lignes de commande
- `GET /api/codes-promo/` - Liste des codes promo

**Pôle PRODUCTS:**
- `GET /api/produits/` - Liste des produits
- `GET /api/catalogues/` - Liste des catalogues
- `GET /api/categories/` - Liste des catégories
- `GET /api/promotions/` - Liste des promotions

## Considérations de sécurité

### Protection des données
- Hachage des mots de passe (assuré par Django)
- Cryptage des données sensibles
- Validation des entrées utilisateur

### Sécurité des API
- Authentification JWT avec expiration
- Limitation de débit (rate limiting)
- Validation des permissions à chaque requête
- Journalisation des actions sensibles

### Conformité RGPD
- Consentement utilisateur
- Portabilité des données
- Droit à l'oubli

## Évolutivité

### Extensions futures
- Support multi-organisations
- Système de délégation temporaire
- Intégration avec l'annuaire d'entreprise
- Authentification multi-facteurs
- Organigramme dynamique

### Intégrations
- Single Sign-On (SSO)
- LDAP/Active Directory
- Systèmes de messagerie d'entreprise
- Outils RH 