# Application Products

## Description
L'application **Products** gère le catalogue de chaussures de la boutique Yoozak. Elle permet de stocker et manipuler toutes les informations relatives aux produits, catégories, articles spécifiques et médias associés.

## Modèles de données

### Categories
Représente les catégories principales de produits.
- `nom`: Nom de la catégorie
- `description`: Description détaillée

### SousCategories
Représente les sous-catégories, liées à une catégorie parente.
- `nom`: Nom de la sous-catégorie
- `description`: Description détaillée
- `categorie`: Lien vers la catégorie parente

### Produit
Modèle central représentant un produit (modèle de chaussure).
- `nom`: Nom du modèle
- `prix`: Prix avec deux décimales
- `description`: Description détaillée
- `type_de_semelle`: Type de semelle utilisée
- `matieres_premieres`: Matériaux utilisés (stocké en JSON)
- `origine`: Pays/région d'origine
- `categories`: Relation many-to-many avec les catégories

### Article
Représente une déclinaison spécifique d'un produit (taille, couleur).
- `produit`: Lien vers le produit parent
- `couleur`: Couleur disponible
- `pointure`: Taille/pointure disponible
- `code_bar`: Code-barre unique
- `date_achat`: Date d'acquisition du stock

### Creative
Stocke les médias (images, vidéos) associés à un produit.
- `produit`: Lien vers le produit associé
- `type_creative`: Type de média (photo, vidéo, etc.)
- `url`: URL vers la ressource

### Promotion
Gère les offres promotionnelles sur les produits.
- `produit`: Lien vers le produit concerné
- `type_promo`: Type de promotion
- `reduction`: Montant de la réduction
- `date_debut`: Date de début de la promo
- `date_fin`: Date de fin de la promo

### Catalogue
Permet de regrouper des produits dans des collections.
- `nom`: Nom du catalogue
- `description`: Description du catalogue
- `date_creation`: Date de création
- `produits`: Relation many-to-many avec les produits

## API (sous `/api/products/`)

L'API Products suit l'architecture REST et utilise Django REST Framework.

### Endpoints principaux

- `/api/products/categories/` - Gestion des catégories
- `/api/products/sous-categories/` - Gestion des sous-catégories
- `/api/products/produits/` - Liste et détail des produits
- `/api/products/articles/` - Gestion des articles (déclinaisons)
- `/api/products/creatives/` - Gestion des médias
- `/api/products/promotions/` - Gestion des promotions
- `/api/products/catalogues/` - Gestion des catalogues

### Fonctionnalités

- Filtrage sur différents champs (ex: `/api/products/produits/?categories=1`)
- Recherche textuelle (ex: `/api/products/produits/?search=chaussure`)
- Tri des résultats (ex: `/api/products/produits/?ordering=prix`)
- Pagination automatique

### Permissions

- Lecture des produits: accessible à tous
- Création/modification/suppression: réservée aux administrateurs

## Structure des dossiers

```
products/
├── api/                    # Contient tout le code de l'API
│   ├── __init__.py
│   ├── serializers.py      # Sérialisation des données
│   ├── urls.py             # URLs de l'API
│   └── views.py            # Vues et logique de l'API
├── migrations/             # Migrations de base de données
├── __init__.py
├── admin.py                # Configuration de l'interface d'administration
├── apps.py                 # Configuration de l'application
├── models.py               # Modèles de données
├── tests.py                # Tests automatisés
├── urls.py                 # URLs principales redirigeant vers l'API
└── views.py                # Vues principales (vide car tout est dans l'API)
```

## Utilisation

### Installation
Les dépendances sont listées dans `backend/requirements.txt`.

### Base de données
Les tables sont créées via les migrations Django :
```
python manage.py migrate products
```

### Administration
Accédez à l'interface d'administration à l'adresse `/admin/` pour gérer les produits.

### Test des API avec PowerShell

#### Obtenir un token JWT (si nécessaire pour des opérations d'écriture)
```powershell
$body = @{username='admin'; password='admin'} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/token/" -Method Post -Body $body -ContentType "application/json"
$token = $response.access
$headers = @{Authorization = "Bearer $token"}
```

#### Lister tous les produits (accessible sans authentification)
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/products/produits/" -Method Get
```

#### Obtenir les détails d'un produit spécifique
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/products/produits/1/" -Method Get
```

#### Lister les catégories
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/products/categories/" -Method Get
```

#### Rechercher des produits
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/products/produits/?search=sport" -Method Get
```

#### Filtrer des produits par catégorie
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/products/produits/?categories=1" -Method Get
```

#### Trier les produits par prix (croissant)
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/products/produits/?ordering=prix" -Method Get
```

#### Trier les produits par prix (décroissant)
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/products/produits/?ordering=-prix" -Method Get
```

#### Ajouter un nouveau produit (nécessite authentification)
```powershell
$produitBody = @{
    nom="Chaussure de course XYZ";
    prix=99.99;
    description="Chaussure de sport légère et confortable";
    type_de_semelle="Caoutchouc";
    matieres_premieres=@{textile="nylon"; semelle="caoutchouc"} | ConvertTo-Json;
    origine="France";
    categories=@(1)
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/products/produits/" -Method Post -Headers $headers -Body $produitBody -ContentType "application/json"
``` 