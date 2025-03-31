# Guide des requêtes d'authentification

## Obtenir un token JWT
- **URL** : `{{base_url}}/api/token/`
- **Méthode** : POST
- **Body** :
  ```json
  {
      "username": "admin",
      "password": "admin"
  }
  ```
- **Réponse** : Token d'accès et de rafraîchissement
  ```json
  {
      "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

## Utiliser le token pour l'authentification
Pour toutes les requêtes authentifiées, ajoutez l'en-tête :
- **Authorization** : `Bearer {{token}}` 