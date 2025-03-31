# Application Clients

## Description
L'application **Clients** gère les utilisateurs de la boutique Yoozak, leurs profils, leurs favoris et leurs avis sur les produits. Elle étend le modèle d'utilisateur standard de Django pour inclure des informations spécifiques aux clients de l'e-commerce.

## Modèles de données

### Client
Étend le modèle utilisateur de Django avec des informations supplémentaires.
- `user`: Lien one-to-one vers l'utilisateur Django (username, email, password)
- `nom`: Nom de famille du client
- `prenom`: Prénom du client
- `phone`: Numéro de téléphone
- `genre`: Genre du client (choix: Homme, Femme, Autre)
- `point_de_fidelite`: Points de fidélité accumulés

### Favoris
Représente les produits mis en favoris par les clients.
- `client`: Lien vers le client
- `produit`: Lien vers le produit favori
- `date_ajout`: Date d'ajout aux favoris

### Avis
Gère les avis et évaluations laissés par les clients sur les produits.
- `client`: Lien vers le client qui a posté l'avis
- `produit`: Lien vers le produit évalué
- `commentaire`: Texte de l'avis
- `note`: Note attribuée (de 1 à 5)
- `date_creation`: Date de création de l'avis

## API (sous `/api/clients/`)

L'API Clients suit l'architecture REST et utilise Django REST Framework.

### Endpoints principaux

- `/api/clients/clients/` - Gestion des profils clients
- `/api/clients/favoris/` - Gestion des favoris
- `/api/clients/avis/` - Gestion des avis sur les produits

### Endpoints spéciaux

- `/api/clients/clients/me/` - Récupérer le profil du client connecté
- `/api/clients/favoris/mes_favoris/` - Récupérer les favoris du client connecté
- `/api/clients/avis/mes_avis/` - Récupérer les avis du client connecté

### Fonctionnalités

- Création de compte client (inscription)
- Gestion du profil client
- Ajout et suppression de produits favoris
- Publication, modification et suppression d'avis
- Filtrage et recherche dans les avis
- Authentification JWT requise pour la plupart des opérations

### Permissions

- Création de compte: ouvert à tous
- Consultation de liste des clients: utilisateurs authentifiés
- Modification/suppression de compte: propriétaire ou administrateur
- Gestion des favoris: propriétaire ou administrateur
- Lecture des avis: accessible à tous
- Création/modification/suppression d'avis: propriétaire ou administrateur

## Serializers

### UserSerializer
Sérialisation des données de l'utilisateur Django standard.

### ClientSerializer
Sérialisation des données du profil client pour l'affichage et la modification.

### ClientCreateSerializer
Sérialisation spécifique pour la création d'un client avec son utilisateur Django associé.

### FavorisSerializer
Sérialisation des produits favoris avec les détails du produit.

### AvisSerializer
Sérialisation des avis avec informations sur le client et le produit.

## Structure des dossiers

```
clients/
├── api/                    # Contient tout le code de l'API
│   ├── __init__.py
│   ├── serializers.py      # Sérialisation des données
│   ├── urls.py             # URLs de l'API
│   └── views.py            # Vues et logique de l'API
├── migrations/             # Migrations de base de données
├── __init__.py
├── admin.py                # Configuration de l'interface d'administration
├── apps.py                 # Configuration de l'application
├── models.py               # Modèles de données
├── tests.py                # Tests automatisés
├── urls.py                 # URLs principales redirigeant vers l'API
└── views.py                # Vues principales (vide car tout est dans l'API)
```

## Utilisation

### Installation
Les dépendances sont listées dans `backend/requirements.txt`.

### Base de données
Les tables sont créées via les migrations Django :
```
python manage.py migrate clients
```

### Authentification
L'authentification utilise des tokens JWT (JSON Web Tokens).
Obtenir un token :
```
POST /api/token/
{
  "username": "user@example.com",
  "password": "password"
}
```

### Exemple d'utilisation

#### Création d'un compte client
```
POST /api/clients/clients/
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "username": "jean.dupont",
  "password": "motdepasse",
  "phone": "+33123456789",
  "genre": "Homme"
}
```

#### Récupération du profil
```
GET /api/clients/clients/me/
Authorization: Bearer <token>
``` 