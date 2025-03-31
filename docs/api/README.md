# Documentation API Yoozak

Cette documentation présente toutes les requêtes API disponibles pour le projet Yoozak, structurées par domaine fonctionnel.

## Structure de la documentation

- [**API_TESTING.md**](./API_TESTING.md) - Guide d'authentification et utilisation des tokens JWT
- [**API_PRODUCTS.md**](./API_PRODUCTS.md) - API pour les produits, catégories et sous-catégories
- [**API_CLIENTS.md**](./API_CLIENTS.md) - API pour les clients, favoris et avis
- [**API_COMMANDES.md**](./API_COMMANDES.md) - API pour les commandes, paniers, retours et remises

## Comment tester les API

1. Utilisez Postman pour tester facilement les API
2. Créez un environnement avec la variable `base_url` (ex: `http://127.0.0.1:8000`)
3. Obtenez d'abord un token d'authentification comme décrit dans [API_TESTING.md](./API_TESTING.md)
4. Utilisez ce token pour les requêtes authentifiées

## Codes de statut HTTP

- **200 OK** - Requête réussie
- **201 Created** - Ressource créée avec succès
- **400 Bad Request** - Données invalides ou manquantes
- **401 Unauthorized** - Authentification requise
- **403 Forbidden** - Authentifié mais non autorisé
- **404 Not Found** - Ressource non trouvée
- **500 Server Error** - Erreur interne du serveur

## Notes importantes

- Toutes les API clients et commandes nécessitent une authentification
- L'API des produits peut être consultée sans authentification pour les requêtes GET
- Les requêtes de création, mise à jour et suppression nécessitent toujours une authentification 