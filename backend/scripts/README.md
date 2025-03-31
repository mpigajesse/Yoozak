# Scripts utilitaires pour Yoozak

Ce dossier contient différents scripts utilitaires pour le projet Yoozak.

## Script de téléchargement des images de chaussures

### `download_shoes_images.py`

Ce script permet de télécharger automatiquement des images de chaussures depuis Unsplash et de les intégrer dans la base de données Django. Il est conçu pour alimenter la plateforme Yoozak avec un catalogue initial de produits.

### Fonctionnalités

- Téléchargement d'images depuis Unsplash
- Organisation des images par catégories (baskets, mocassins, bottes, escarpins, sandales)
- Création automatique des entrées dans la base de données (modèles `Produit` et `Creative`)
- Association des images aux produits correspondants

### Structure des dossiers générée

```
backend/media/products/
├── baskets/
│   └── [images de baskets]
├── mocassins/
│   └── [images de mocassins]
├── bottes/
│   └── [images de bottes]
├── escarpins/
│   └── [images d'escarpins]
├── sandales/
│   └── [images de sandales]
└── other/
    └── [autres types de chaussures]
```

### Données générées

Le script crée 25 produits au total, répartis dans 5 catégories, avec 5 produits par catégorie. Chaque produit est associé à 1-2 images téléchargées depuis Unsplash.

### Utilisation

Pour exécuter le script, assurez-vous d'être dans l'environnement virtuel Django et exécutez :

```bash
# Depuis le répertoire racine du projet
cd backend
python scripts/download_shoes_images.py
```

### Configuration requise

- Python 3.x
- Django installé et configuré
- Module `requests`
- Accès internet pour télécharger les images

### Personnalisation

Vous pouvez modifier les variables suivantes dans le script pour personnaliser son fonctionnement :

- `MEDIA_ROOT` : Chemin où les images seront enregistrées
- `CATEGORIES_MAP` : Mapping des catégories et des mots-clés associés
- `IMAGE_SOURCES` : URLs des images à télécharger
- `TEST_PRODUCTS` : Liste des produits à créer

### Remarques

- Le script est idempotent : il peut être exécuté plusieurs fois sans créer de doublons dans la base de données
- Les images sont téléchargées depuis Unsplash, une plateforme d'images libres de droits 

## Scripts de gestion de la base de données

### `insert_data.py`

Ce script permet d'insérer des données d'exemple dans la base de données Yoozak.

#### Fonctionnalités

- Insertion de données d'exemple pour toutes les entités principales
- Prise en charge des transactions pour assurer l'intégrité des données
- Création idempotente (ne crée pas de doublons)

#### Données générées

Le script crée les données d'exemple suivantes :

- **Catégories** : Femme, Homme, Enfant, Sport, Luxe
- **Sous-catégories** : Baskets, Escarpins, Mocassins, Bottes, Sandales
- **États de commande** : En attente, Validée, Expédiée, Livrée, Annulée, Retournée
- **Codes promo** : BIENVENUE10 (10%), ETE2023 (15%), VIP25 (25%)
- **Clients** : 5 clients fictifs avec des informations de contact

#### Utilisation

Pour exécuter le script, assurez-vous d'être dans l'environnement virtuel Django et exécutez :

```bash
# Depuis le répertoire racine du projet
cd backend
python scripts/insert_data.py
```

### `clear_database.py`

Ce script permet de vider les tables de la base de données Yoozak.

#### Fonctionnalités

- Vider toutes les tables (truncate) avec réinitialisation des séquences d'identifiants
- Vider des tables spécifiques (par application : commandes, clients, produits)
- Menu interactif pour choisir l'opération à effectuer
- Prise en charge des transactions pour assurer l'intégrité des données

#### Utilisation

Pour exécuter le script, assurez-vous d'être dans l'environnement virtuel Django et exécutez :

```bash
# Depuis le répertoire racine du projet
cd backend
python scripts/clear_database.py
```

Le script vous présentera un menu avec les options suivantes :
1. Vider toutes les tables
2. Vider seulement les tables de commandes
3. Vider seulement les tables de clients
4. Vider seulement les tables de produits
5. Quitter

#### Configuration requise

- Python 3.x
- Django installé et configuré
- Base de données PostgreSQL configurée (pour l'option TRUNCATE)

#### Avertissement

L'option "Vider toutes les tables" supprime définitivement toutes les données des tables concernées. Utilisez-la avec précaution, de préférence uniquement dans un environnement de développement. 