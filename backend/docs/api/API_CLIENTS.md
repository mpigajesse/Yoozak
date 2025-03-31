# Guide des requêtes API Clients

## Clients

### Lister tous les clients
- **URL** : `{{base_url}}/api/clients/clients/`
- **Méthode** : GET
- **Auth** : Bearer Token

### Obtenir un client spécifique
- **URL** : `{{base_url}}/api/clients/clients/{id}/`
- **Méthode** : GET
- **Auth** : Bearer Token

### Créer un nouveau client
- **URL** : `{{base_url}}/api/clients/clients/`
- **Méthode** : POST
- **Auth** : Bearer Token
- **Body** :
  ```json
  {
      "nom": "Dupont",
      "prenom": "Jean",
      "phone": "0612345678",
      "genre": "Homme",
      "point_de_fidelite": 0,
      "mode_de_passe": "motdepasse123",
      "email": "jean.dupont@example.com"
  }
  ```

## Favoris

### Lister tous les favoris
- **URL** : `{{base_url}}/api/clients/favoris/`
- **Méthode** : GET
- **Auth** : Bearer Token

### Créer un nouveau favori
- **URL** : `{{base_url}}/api/clients/favoris/`
- **Méthode** : POST
- **Auth** : Bearer Token
- **Body** :
  ```json
  {
      "client_id": 1,
      "produit_id": 1
  }
  ```

## Avis

### Lister tous les avis
- **URL** : `{{base_url}}/api/clients/avis/`
- **Méthode** : GET
- **Auth** : Bearer Token

### Créer un nouvel avis
- **URL** : `{{base_url}}/api/clients/avis/`
- **Méthode** : POST
- **Auth** : Bearer Token
- **Body** :
  ```json
  {
      "client_id": 1,
      "produit_id": 1,
      "commentaire": "Très bonnes chaussures, confortables et durables",
      "note": 5
  }
  ``` 