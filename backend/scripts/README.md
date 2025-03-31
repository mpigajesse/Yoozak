# Scripts d'insertion de données pour Yoozak

Ce répertoire contient plusieurs scripts d'insertion de données dans la base de données Yoozak, ainsi que des outils de diagnostic et de maintenance de la base de données.

## Ordre d'exécution recommandé

Pour garantir le bon fonctionnement de tous les scripts (en raison des dépendances entre les tables), veuillez les exécuter dans l'ordre suivant :

1. `check_database.py` - Vérifier la configuration de la base de données 
2. `clean_duplicate_tables.py` - Nettoyer les tables en doublon si nécessaire
3. `insert_categories.py` - Catégories et sous-catégories
4. `insert_clients.py` - Clients
5. `insert_etats_commande.py` - États de commande
6. `insert_code_promos.py` - Codes promo
7. `insert_produits.py` - Produits, articles, créatives et promotions
8. `insert_commandes.py` - Commandes et lignes de commande
9. `insert_avis_favoris.py` - Avis et favoris clients

## Scripts de diagnostic et maintenance

### `check_database.py`

Script pour vérifier la configuration et l'état de la base de données.

#### Fonctionnalités :
- Affiche la configuration de la base de données depuis `settings.py`
- Montre les informations de connexion active
- Liste toutes les tables existantes
- Affiche le nombre d'enregistrements dans les tables principales
- Détaille les modèles Django et leurs tables correspondantes

#### Utilisation :
```bash
python scripts/check_database.py
```

### `clean_duplicate_tables.py`

Script pour nettoyer les tables en doublon dans la base de données.

#### Fonctionnalités :
- Identifie et supprime les tables qui font doublon avec les tables Django
- Référence les tables correctes utilisées par Django
- Opération sécurisée avec confirmation

#### Utilisation :
```bash
python scripts/clean_duplicate_tables.py
```

## Scripts d'insertion de données

### 1. `insert_categories.py`

Insère des catégories et sous-catégories de produits dans la base de données.

#### Données créées :
- Catégories : Femme, Homme, Enfant, Sport, Luxe
- Sous-catégories : Baskets, Escarpins, Mocassins, Bottes, Sandales

#### Utilisation :
```bash
python scripts/insert_categories.py
```

### 2. `insert_clients.py`

Crée des clients fictifs avec leurs utilisateurs Django associés.

#### Données créées :
- Utilisateurs Django avec noms, prénoms, emails et mots de passe
- Profils clients associés à ces utilisateurs

#### Utilisation :
```bash
python scripts/insert_clients.py
```

### 3. `insert_etats_commande.py`

Insère les différents états possibles pour une commande.

#### Données créées :
- États : En attente, Validée, Expédiée, Livrée, Annulée, Retournée

#### Utilisation :
```bash
python scripts/insert_etats_commande.py
```

### 4. `insert_code_promos.py`

Crée des codes promotionnels dans la base de données.

#### Données créées :
- Codes promo avec taux de réduction et dates de validité

#### Utilisation :
```bash
python scripts/insert_code_promos.py
```

### 5. `insert_produits.py`

Insère des produits, articles, créatives et promotions dans la base de données.

#### Données créées :
- Produits (chaussures) de différentes marques et types
- Articles (instances spécifiques des produits avec taille et couleur)
- Créatives (médias associés aux produits)
- Promotions sur certains produits

#### Prérequis :
- Les catégories et sous-catégories doivent exister (exécuter `insert_categories.py` d'abord)

#### Utilisation :
```bash
python scripts/insert_produits.py
```

### 6. `insert_commandes.py`

Crée des commandes fictives avec des lignes de commande.

#### Données créées :
- Commandes associées à des clients
- Lignes de commande avec produits et quantités

#### Prérequis :
- Clients, produits et états de commande doivent exister

#### Utilisation :
```bash
python scripts/insert_commandes.py
```

### 7. `insert_avis_favoris.py`

Insère des avis et des favoris clients dans la base de données.

#### Données créées :
- Avis clients sur des produits (notes et commentaires)
- Produits favoris pour les clients

#### Prérequis :
- Clients et produits doivent exister

#### Utilisation :
```bash
python scripts/insert_avis_favoris.py
```

## Script de gestion de la base de données

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
python scripts/clear_database.py
```

Le script vous présentera un menu avec les options suivantes :
1. Vider toutes les tables
2. Vider seulement les tables de commandes
3. Vider seulement les tables de clients
4. Vider seulement les tables de produits
5. Quitter

## Notes importantes

- Chaque script demande une confirmation avant d'insérer des données.
- Les scripts utilisent `transaction.atomic()` pour garantir l'intégrité des données. Si une erreur se produit, aucune donnée ne sera insérée.
- Les scripts vérifient l'existence des dépendances nécessaires et affichent des avertissements si certaines données requises n'existent pas.
- Pour réinitialiser la base de données, vous pouvez utiliser `python manage.py flush` mais cela effacera TOUTES les données de la base.
- Lors de l'utilisation de ces scripts avec PostgreSQL, respectez la convention de nommage Django : les tables sont préfixées par le nom de l'application (ex: `clients_client`, `products_produit`).

## Personnalisation

Vous pouvez modifier les données d'exemple dans chaque script pour les adapter à vos besoins. Chaque script contient des variables contenant les données à insérer au début des fonctions de création.

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