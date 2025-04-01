# Test des API via l'interface Django REST Framework

Django REST Framework (DRF) fournit une interface navigateur conviviale pour tester directement les API sans outils externes comme Postman.

## Avantages de l'interface DRF

- Interface web interactive accessible depuis un navigateur
- Formulaires HTML automatiques pour tester les requêtes POST/PUT/PATCH
- Documentation visuelle des champs et de leurs validations
- Navigation hypertexte entre les ressources liées
- Possibilité de basculer entre différents formats (JSON, API, HTML)

## Accès à l'interface

L'interface DRF est accessible en visitant directement les URL API dans votre navigateur.

## Guide d'utilisation

### 1. Authentification

1. Accédez à `http://127.0.0.1:8000/api/token/`
2. Dans le formulaire HTML, entrez les informations:
   - Username: `admin`
   - Password: `admin`
3. Cliquez sur "POST"
4. Copiez le token "access" renvoyé

Pour vous authentifier sur les autres pages:
1. Cliquez sur le bouton "Log in" en haut à droite
2. Sélectionnez "Token" dans la liste déroulante
3. Collez votre token d'accès dans le champ "Token"
4. Cliquez sur "Login"

### 2. Test des API Produits

#### Liste des produits
- URL: `http://127.0.0.1:8000/api/products/produits/`
- Méthode GET: visualisez la liste des produits
- Méthode POST: utilisez le formulaire pour créer un nouveau produit

#### Détail d'un produit
- URL: `http://127.0.0.1:8000/api/products/produits/1/`
- Méthode GET: visualisez les détails du produit
- Méthode PUT/PATCH: modifiez le produit existant
- Méthode DELETE: supprimez le produit

#### Catégories et sous-catégories
- URLs: 
  - `http://127.0.0.1:8000/api/products/categories/`
  - `http://127.0.0.1:8000/api/products/sous-categories/`

### 3. Test des API Clients

> **Note**: Authentification requise

#### Liste des clients
- URL: `http://127.0.0.1:8000/api/clients/clients/`

#### Favoris et avis
- URLs:
  - `http://127.0.0.1:8000/api/clients/favoris/`
  - `http://127.0.0.1:8000/api/clients/avis/`

### 4. Test des API Commandes

> **Note**: Authentification requise

#### Commandes
- URL: `http://127.0.0.1:8000/api/commandes/commandes/`

#### Paniers
- URL: `http://127.0.0.1:8000/api/commandes/paniers/`

#### Retours
- URL: `http://127.0.0.1:8000/api/commandes/retours/`

## Accès aux Images (Creative API)

L'API Creative permet d'accéder aux images des produits. Voici les endpoints disponibles :

### Liste de toutes les images

```http
GET /api/products/creatives/
```

Exemple de réponse :
```json
[
  {
    "id": 1,
    "type_creative": "image_principale",
    "url": "/media/products/baskets/nike_air_max_90_image_principale_7401.jpg",
    "product_id": 1
  },
  // ... autres images ...
]
```

### Filtrer les images par produit

```http
GET /api/products/creatives/?produit=1
```

### Types de Creative disponibles
- `image_principale` : Image principale du produit
- `image_360` : Vue à 360 degrés du produit
- `video_produit` : Vidéo du produit

### Accès direct aux fichiers média

Les fichiers média sont accessibles via l'URL de base :
```http
GET http://127.0.0.1:8000/media/products/{chemin_du_fichier}
```

Par exemple :
```http
GET http://127.0.0.1:8000/media/products/baskets/nike_air_max_90_image_principale_7401.jpg
```

## Astuces utiles

1. **Format des réponses**: Utilisez les boutons en bas de page pour basculer entre:
   - JSON (données brutes)
   - API (vue navigable)
   - HTML (formulaire)

2. **Filtrage**: Certains endpoints prennent en charge le filtrage via des paramètres GET:
   ```
   http://127.0.0.1:8000/api/products/produits/?prix_min=100
   ```

3. **Pagination**: Utilisez les liens "next" et "previous" pour naviguer dans les résultats paginés

4. **Champs requis**: Les champs marqués en gras sont obligatoires dans les formulaires

5. **Documentation des champs**: Passez votre souris sur les noms des champs pour voir leur description

## Dépannage

- **Erreur 401**: Vous n'êtes pas authentifié ou votre token a expiré
- **Erreur 403**: Vous êtes authentifié mais n'avez pas les permissions nécessaires
- **Erreur 400**: Vos données ne respectent pas les validations requises 