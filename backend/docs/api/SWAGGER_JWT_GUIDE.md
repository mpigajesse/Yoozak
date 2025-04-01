# Guide d'utilisation de Swagger avec JWT

Ce guide explique comment utiliser l'interface Swagger pour tester l'API Yoozak avec l'authentification JWT (JSON Web Token).

## Sommaire

1. [Introduction à Swagger](#introduction-à-swagger)
2. [Accéder à l'interface Swagger](#accéder-à-linterface-swagger)
3. [Authentification avec JWT](#authentification-avec-jwt)
4. [Tester les endpoints protégés](#tester-les-endpoints-protégés)
5. [Astuces et bonnes pratiques](#astuces-et-bonnes-pratiques)
6. [Résolution des problèmes courants](#résolution-des-problèmes-courants)

## Introduction à Swagger

Swagger (OpenAPI) est un outil qui permet de documenter et tester des API REST directement depuis votre navigateur. Les avantages de Swagger incluent :

- Documentation interactive de l'API
- Interface utilisateur intuitive pour tester les endpoints
- Visualisation des modèles de données
- Gestion simplifiée de l'authentification

## Accéder à l'interface Swagger

Pour accéder à l'interface Swagger de l'API Yoozak :

1. Démarrez le serveur Django : `python manage.py runserver`
2. Ouvrez votre navigateur web
3. Accédez à l'URL : `http://localhost:8000/swagger/`

Vous verrez la page d'accueil de Swagger avec la liste de tous les endpoints disponibles, organisés par catégories (clients, commandes, produits, etc.).

## Authentification avec JWT

L'API Yoozak utilise l'authentification JWT (JSON Web Token). Voici comment vous authentifier :

### Étape 1 : Obtenir un token JWT

1. Dans la liste des endpoints, localisez la section "token"
2. Cliquez sur l'endpoint POST `/api/token/`
3. Cliquez sur le bouton "Try it out"
4. Entrez vos identifiants dans le corps de la requête :
   ```json
   {
     "username": "admin",
     "password": "admin"
   }
   ```
5. Cliquez sur "Execute"
6. Dans la réponse, copiez la valeur du champ "access" (qui commence par "eyJhbGc...")

### Étape 2 : Configurer l'authentification

1. Cliquez sur le bouton "Authorize" (cadenas) en haut à droite de la page
2. Dans le champ de valeur, entrez : `Bearer ` suivi du token JWT copié
   - **Important** : N'oubliez pas l'espace après "Bearer"
   - Exemple : `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Cliquez sur le bouton "Authorize"
4. Cliquez sur "Close"

Vous êtes maintenant authentifié ! Toutes les requêtes que vous effectuerez incluront automatiquement le token JWT dans l'en-tête d'autorisation.

## Tester les endpoints protégés

Une fois authentifié, vous pouvez tester les endpoints protégés :

### Exemple : Obtenir les détails d'un client

1. Localisez l'endpoint GET `/api/clients/clients/{id}/`
2. Cliquez sur "Try it out"
3. Entrez l'ID du client (par exemple : `1`)
4. Cliquez sur "Execute"
5. Vous devriez recevoir une réponse 200 OK avec les détails du client

### Exemple : Créer un nouvel avis

1. Localisez l'endpoint POST `/api/clients/avis/`
2. Cliquez sur "Try it out"
3. Entrez les détails de l'avis dans le corps de la requête :
   ```json
   {
     "client_id": 1,
     "produit_id": 1,
     "commentaire": "Excellent produit !",
     "note": 5
   }
   ```
4. Cliquez sur "Execute"
5. Vous devriez recevoir une réponse 201 Created avec les détails de l'avis créé

## Astuces et bonnes pratiques

### Durée de validité des tokens

- Le token d'accès est valide pendant 7 jours (configuration de développement)
- Si le token expire, vous recevrez une erreur 401 Unauthorized
- Dans ce cas, obtenez un nouveau token en répétant le processus d'authentification

### Comprendre les codes de réponse

- **200 OK** : Requête réussie
- **201 Created** : Ressource créée avec succès
- **400 Bad Request** : Erreur dans les données envoyées
- **401 Unauthorized** : Authentification requise ou invalide
- **403 Forbidden** : Pas les permissions nécessaires
- **404 Not Found** : Ressource introuvable
- **500 Server Error** : Erreur interne du serveur

### Explorer les modèles de données

Swagger affiche les modèles de données en bas de page. Vous pouvez les consulter pour comprendre la structure des objets manipulés par l'API.

## Résolution des problèmes courants

### Erreur 401 Unauthorized

Si vous recevez une erreur 401 alors que vous pensez être authentifié :

1. Vérifiez que vous avez bien ajouté le préfixe `Bearer ` avant le token
2. Assurez-vous que le token n'a pas expiré
3. Vérifiez que vous avez cliqué sur "Authorize" après avoir entré le token

### Format du token incorrect

Le format correct du token dans le champ d'autorisation est :
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Veillez à inclure l'espace après "Bearer" et à ne pas ajouter de guillemets autour du token.

### Problèmes de CORS

Si vous utilisez Swagger depuis un domaine différent de celui de l'API, vous pourriez rencontrer des problèmes CORS. Dans ce cas, assurez-vous que les en-têtes CORS sont correctement configurés dans les paramètres Django.

---

Ce guide vous permet de tester efficacement l'API Yoozak via l'interface Swagger. Pour plus d'informations sur les endpoints spécifiques, consultez les autres documents de la documentation API dans le dossier `docs/api/`. 