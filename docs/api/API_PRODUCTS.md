# Guide des requêtes API Produits

## Produits

### Lister tous les produits
- **URL** : `{{base_url}}/api/products/produits/`
- **Méthode** : GET
- **Auth** : Non requise

### Obtenir un produit spécifique
- **URL** : `{{base_url}}/api/products/produits/{id}/`
- **Méthode** : GET
- **Auth** : Non requise

### Créer un nouveau produit
- **URL** : `{{base_url}}/api/products/produits/`
- **Méthode** : POST
- **Auth** : Bearer Token
- **Body** :
  ```json
  {
      "nom": "Nike Air Max",
      "prix": 129.99,
      "description": "Chaussure de sport confortable",
      "type_de_semelle": "Caoutchouc",
      "matieres_premieres": {
          "dessus": "Cuir synthétique",
          "semelle": "Caoutchouc"
      },
      "origine": "Vietnam"
  }
  ```

## Catégories

### Lister toutes les catégories
- **URL** : `{{base_url}}/api/products/categories/`
- **Méthode** : GET
- **Auth** : Non requise

### Créer une nouvelle catégorie
- **URL** : `{{base_url}}/api/products/categories/`
- **Méthode** : POST
- **Auth** : Bearer Token
- **Body** :
  ```json
  {
      "nom": "Chaussures de sport",
      "description": "Chaussures conçues pour les activités sportives"
  }
  ```

## Sous-catégories

### Lister toutes les sous-catégories
- **URL** : `{{base_url}}/api/products/sous-categories/`
- **Méthode** : GET
- **Auth** : Non requise

### Créer une nouvelle sous-catégorie
- **URL** : `{{base_url}}/api/products/sous-categories/`
- **Méthode** : POST
- **Auth** : Bearer Token
- **Body** :
  ```json
  {
      "nom": "Running",
      "description": "Chaussures pour la course à pied",
      "categorie_id": 1
  }
  ``` 