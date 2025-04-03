# Application Users

Cette application gère tous les aspects liés aux utilisateurs dans le système Yoozak.

## Structure de l'application

L'application est divisée en deux parties principales :

### 1. Fonctionnalités centrales (Django traditionnel)

Les fonctionnalités centrales sont implémentées dans les fichiers à la racine du dossier `users` :

- `views.py` : Contient les vues Django traditionnelles, utilisant des templates et des formulaires
- `models.py` : Contient les modèles de données liés aux utilisateurs
- `admin.py` : Configuration pour l'admin Django
- `urls.py` : Routes pour les vues centrales et inclusion des routes API

Ces fonctionnalités sont accessibles via des URLs standard, par exemple `/users/login/`, `/users/profile/`, etc.

### 2. API REST (sous-dossier `api`)

Le sous-dossier `api` contient toutes les fonctionnalités liées à l'API REST :

- `api.py` : Fonctions API pour l'authentification et la gestion des tokens
- `serializers.py` : Sérialiseurs pour convertir les modèles en JSON et vice-versa
- `views.py` : Vues API basées sur DRF (Django Rest Framework)
- `urls.py` : Routes pour les endpoints API

Ces fonctionnalités sont accessibles via le préfixe `/api/users/`, par exemple `/api/users/auth/login/`, `/api/users/profile/`, etc.

## Documentation

La documentation de l'application est disponible dans le dossier `docs` :

- `api.md` : Documentation complète des endpoints API backend, paramètres, et exemples de réponses
- `api_frontend.md` : Documentation des services API utilisés par le frontend (dashboard) pour communiquer avec le backend

## Utilisation

### Vues centrales

Les vues centrales sont destinées à être utilisées directement par les utilisateurs via un navigateur web.
Elles fournissent des interfaces utilisateur pour la connexion, l'affichage et la modification du profil.

### API REST

L'API REST est destinée à être utilisée par des applications frontend (comme le dashboard) ou par des services externes.
Elle fournit des endpoints pour l'authentification, la récupération et la modification des données utilisateur au format JSON.

### Frontend Dashboard

Le dashboard utilise un client API (implémenté dans `src/services/api.ts`) pour communiquer avec le backend.
Ce client est documenté dans `docs/api_frontend.md` et implémente tous les endpoints nécessaires pour l'authentification
et la gestion des profils utilisateurs. 