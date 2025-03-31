# Guide des requêtes API Commandes

## Commandes

### Lister toutes les commandes
- **URL** : `{{base_url}}/api/commandes/commandes/`
- **Méthode** : GET
- **Auth** : Bearer Token

### Obtenir une commande spécifique
- **URL** : `{{base_url}}/api/commandes/commandes/{id}/`
- **Méthode** : GET
- **Auth** : Bearer Token

### Créer une nouvelle commande
- **URL** : `{{base_url}}/api/commandes/commandes/`
- **Méthode** : POST
- **Auth** : Bearer Token
- **Body** :
  ```json
  {
      "date_commande": "2024-03-31",
      "adresse": "123 Rue de Paris",
      "region": "Île-de-France",
      "etat_commande": "En attente",
      "client_id": 1
  }
  ```

## Paniers

### Lister tous les paniers
- **URL** : `{{base_url}}/api/commandes/paniers/`
- **Méthode** : GET
- **Auth** : Bearer Token

### Créer un nouveau panier
- **URL** : `{{base_url}}/api/commandes/paniers/`
- **Méthode** : POST
- **Auth** : Bearer Token
- **Body** :
  ```json
  {
      "quantite": 2,
      "client_id": 1
  }
  ```

## Retours

### Lister tous les retours
- **URL** : `{{base_url}}/api/commandes/retours/`
- **Méthode** : GET
- **Auth** : Bearer Token

### Créer un nouveau retour
- **URL** : `{{base_url}}/api/commandes/retours/`
- **Méthode** : POST
- **Auth** : Bearer Token
- **Body** :
  ```json
  {
      "motif": "Taille incorrecte",
      "date_retour": "2024-04-01",
      "commande_id": 1
  }
  ```

## Remises et Codes Promo

### Lister toutes les remises
- **URL** : `{{base_url}}/api/commandes/remises/`
- **Méthode** : GET
- **Auth** : Bearer Token

### Créer une nouvelle remise
- **URL** : `{{base_url}}/api/commandes/remises/`
- **Méthode** : POST
- **Auth** : Bearer Token
- **Body** :
  ```json
  {
      "taux_de_reduction": 10.00,
      "commande_id": 1
  }
  ```

### Lister tous les codes promo
- **URL** : `{{base_url}}/api/commandes/codes-promo/`
- **Méthode** : GET
- **Auth** : Bearer Token

### Créer un nouveau code promo
- **URL** : `{{base_url}}/api/commandes/codes-promo/`
- **Méthode** : POST
- **Auth** : Bearer Token
- **Body** :
  ```json
  {
      "taux": 15.00,
      "numero_promo": "SUMMER15",
      "commande_id": 1
  }
  ``` 