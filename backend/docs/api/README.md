# Documentation API Yoozak

Cette documentation présente toutes les requêtes API disponibles pour le projet Yoozak, structurées par domaine fonctionnel.

## Structure de la documentation

- [**API_TESTING.md**](./API_TESTING.md) - Guide d'authentification et utilisation des tokens JWT
- [**API_PRODUCTS.md**](./API_PRODUCTS.md) - API pour les produits, catégories et sous-catégories
- [**API_CLIENTS.md**](./API_CLIENTS.md) - API pour les clients, favoris et avis
- [**API_COMMANDES.md**](./API_COMMANDES.md) - API pour les commandes, paniers, retours et remises
- [**TESTING_DRF.md**](./TESTING_DRF.md) - Guide pour tester via l'interface Django REST Framework
- [**SWAGGER_JWT_GUIDE.md**](./SWAGGER_JWT_GUIDE.md) - Guide détaillé pour utiliser Swagger avec l'authentification JWT

## Autres documentations

- [**../ADMIN_INTERFACE.md**](../ADMIN_INTERFACE.md) - Documentation de l'interface d'administration améliorée

## Comment tester les API

Vous avez plusieurs options pour tester les API :

1. **Postman** - Voir [API_TESTING.md](./API_TESTING.md) pour plus de détails
2. **Interface Django REST Framework** - Voir [TESTING_DRF.md](./TESTING_DRF.md) pour plus de détails
3. **Interface Swagger** - Voir [SWAGGER_JWT_GUIDE.md](./SWAGGER_JWT_GUIDE.md) pour un guide détaillé

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