# Yoozak Backend API

## Vue d'ensemble
Le backend de **Yoozak** est une API REST développée avec Django et Django REST Framework. L'architecture est modulaire, composée de plusieurs applications Django qui gèrent différents aspects de la plateforme de e-commerce.

## Technologies utilisées
- **Django 5.1+**: Framework web Python
- **Django REST Framework**: Extension de Django pour créer des API REST
- **PostgreSQL**: Base de données relationnelle
- **JWT (JSON Web Tokens)**: Authentification sécurisée
- **Swagger/OpenAPI**: Documentation de l'API
- **Cors Headers**: Gestion des requêtes cross-origin

## Architecture du projet

### Structure générale
```
backend/
├── config/               # Configuration principale du projet
│   ├── settings.py       # Paramètres du projet
│   ├── urls.py           # Configuration des URLs principales
│   └── ...
├── products/             # Application pour la gestion des produits
├── clients/              # Application pour la gestion des clients
├── commandes/            # Application pour la gestion des commandes
├── static/               # Fichiers statiques
├── media/                # Fichiers média (images produits, etc.)
├── requirements.txt      # Dépendances du projet
└── manage.py             # Script de gestion Django
```

### Applications

#### Products
L'application **Products** gère le catalogue de produits, les catégories, et les médias associés.
[Documentation détaillée](./products/README.md)

#### Clients
L'application **Clients** gère les utilisateurs, leurs profils, favoris et avis.
[Documentation détaillée](./clients/README.md)

#### Commandes
L'application **Commandes** gère les paniers, commandes, états de commande, remises et retours.
[Documentation détaillée](./commandes/README.md)

## API REST

### Points d'entrée principaux
- `/api/products/...` - API pour les produits
- `/api/clients/...` - API pour les clients
- `/api/commandes/...` - API pour les commandes
- `/api/token/...` - Endpoints d'authentification JWT

### Documentation
Une documentation interactive est disponible via Swagger:
- `/swagger/` - Interface Swagger
- `/redoc/` - Interface ReDoc

### Documentation API pour les tests
La documentation détaillée pour tester chaque API est disponible dans le dossier `docs/api/`:
- [`API_TESTING.md`](../docs/api/API_TESTING.md) - Guide d'authentification et utilisation des tokens JWT
- [`API_PRODUCTS.md`](../docs/api/API_PRODUCTS.md) - Documentation des endpoints pour les produits
- [`API_CLIENTS.md`](../docs/api/API_CLIENTS.md) - Documentation des endpoints pour les clients
- [`API_COMMANDES.md`](../docs/api/API_COMMANDES.md) - Documentation des endpoints pour les commandes
- [`TESTING_DRF.md`](../docs/api/TESTING_DRF.md) - Guide pour tester via l'interface Django REST Framework

### Test des API

#### Lancer le serveur de développement
```powershell
cd backend
python manage.py runserver
```

#### Obtenir un token JWT (PowerShell)
```powershell
$body = @{username='admin'; password='admin'} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/token/" -Method Post -Body $body -ContentType "application/json"
$token = $response.access
```

#### Utiliser le token pour accéder aux API sécurisées (PowerShell)
```powershell
$headers = @{Authorization = "Bearer $token"}

# Tester l'API des produits
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/products/produits/" -Method Get -Headers $headers

# Tester l'API des clients
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/clients/clients/" -Method Get -Headers $headers

# Tester l'API des commandes
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/commandes/commandes/" -Method Get -Headers $headers
```

#### Tester avec Postman
1. **Obtenir un token JWT**:
   - Créer une requête POST vers `http://127.0.0.1:8000/api/token/`
   - Dans l'onglet "Body", sélectionner "raw" et "JSON"
   - Entrer le corps : `{"username": "admin", "password": "admin"}`
   - Envoyer la requête et récupérer le token

2. **Utiliser le token**:
   - Créer une requête GET vers l'endpoint souhaité (par exemple `http://127.0.0.1:8000/api/clients/clients/`)
   - Dans l'onglet "Authorization", sélectionner "Bearer Token" et coller le token
   - Envoyer la requête

## Interface d'administration

Le projet dispose d'une interface d'administration Django améliorée accessible à l'URL `/admin/`.

### Fonctionnalités spéciales

#### Paniers
- Aperçu du prix total
- Conversion des paniers en commandes en un clic
- Filtres et recherche améliorés

#### Commandes
- Visualisation des lignes de commande avec calcul de totaux
- Gestion des états de commande
- Suivi des retours et remises

#### Produits
- Gestion des relations entre produits, catégories et catalogues
- Aperçu des médias associés (Creative)
- Navigation facilitée entre les entités liées

#### Codes Promo
- Indication visuelle du statut (actif, expiré, etc.)
- Actions groupées pour activer/désactiver
- Calcul du montant économisé pour les remises

### Accès
- URL: `http://127.0.0.1:8000/admin/`
- Utilisateur: `admin`
- Mot de passe: `admin` (ou celui défini lors de la création)

## Authentification

Le projet utilise l'authentification JWT (JSON Web Tokens):

### Endpoints d'authentification
- `/api/token/` - Obtenir un token JWT
- `/api/token/refresh/` - Rafraîchir un token JWT
- `/api/token/verify/` - Vérifier un token JWT

### Configuration
La configuration JWT est définie dans `settings.py`:
- Durée de vie du token d'accès: 60 minutes
- Durée de vie du token de rafraîchissement: 1 jour

## Configuration et installation

### Prérequis
- Python 3.9+
- PostgreSQL 12+
- Virtualenv (recommandé)

### Variables d'environnement
Créez un fichier `.env` à la racine du projet avec les variables suivantes:
```
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=yoozak
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```

### Installation

1. Cloner le dépôt
```bash
git clone https://github.com/your-username/yoozak.git
cd yoozak/backend
```

2. Créer et activer un environnement virtuel
```bash
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
```

3. Installer les dépendances
```bash
pip install -r requirements.txt
```

4. Configurer la base de données
```bash
python manage.py migrate
```

5. Créer un superutilisateur
```bash
python manage.py createsuperuser
```

6. Lancer le serveur de développement
```bash
python manage.py runserver
```

## Modèle de permissions

- **Administrateurs**: Accès complet à toutes les ressources
- **Clients authentifiés**: Accès à leurs propres données et aux opérations autorisées
- **Utilisateurs anonymes**: Accès limité aux données publiques (produits, etc.)

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add some amazing feature'`)
4. Push la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request 