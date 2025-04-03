 # API Utilisateurs Administrateurs

Cette documentation détaille les endpoints API disponibles pour la gestion des utilisateurs administrateurs dans l'application **Yoozak**.

## Authentification

### Connexion administrateur

Permet à un utilisateur administrateur de se connecter à l'application.

- **URL**: `/api/users/auth/login/`
- **Méthode**: `POST`
- **Authentification requise**: Non
- **Permissions requises**: Aucune

**Paramètres du corps de la requête**:

| Paramètre | Type   | Description                    |
|-----------|--------|--------------------------------|
| username  | string | Nom d'utilisateur              |
| password  | string | Mot de passe                   |

**Réponse**:

- **Succès** (200 OK):
```json
{
  "refresh": "token_de_rafraichissement",
  "access": "token_d_accès",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@exemple.com",
    "first_name": "Administrateur",
    "last_name": "Yoozak",
    "is_staff": true,
    "is_superuser": true,
    "is_active": true,
    "date_joined": "2023-01-01T00:00:00Z",
    "last_login": "2023-04-01T00:00:00Z",
    "groups": [
      {
        "id": 1,
        "name": "Admin"
      }
    ],
    "user_permissions": []
  }
}
```

- **Erreur** (400 Bad Request):
```json
{
  "detail": "Veuillez fournir un nom d'utilisateur et un mot de passe."
}
```

- **Erreur** (401 Unauthorized):
```json
{
  "detail": "Nom d'utilisateur ou mot de passe incorrect."
}
```

- **Erreur** (403 Forbidden):
```json
{
  "detail": "Vous n'avez pas les droits d'administrateur nécessaires."
}
```

### Rafraîchissement du token

Permet de rafraîchir un token d'accès expiré.

- **URL**: `/api/users/auth/refresh/`
- **Méthode**: `POST`
- **Authentification requise**: Non
- **Permissions requises**: Aucune

**Paramètres du corps de la requête**:

| Paramètre | Type   | Description                        |
|-----------|--------|------------------------------------|
| refresh   | string | Token de rafraîchissement          |

**Réponse**:

- **Succès** (200 OK):
```json
{
  "access": "nouveau_token_d_accès"
}
```

- **Erreur** (400 Bad Request):
```json
{
  "detail": "Veuillez fournir un token de rafraîchissement."
}
```

- **Erreur** (401 Unauthorized):
```json
{
  "detail": "Token de rafraîchissement invalide ou expiré."
}
```

## Profil Utilisateur

### Obtenir le profil administrateur

Récupère les informations du profil de l'administrateur connecté.

- **URL**: `/api/users/profile/`
- **Méthode**: `GET`
- **Authentification requise**: Oui (Bearer Token)
- **Permissions requises**: Utilisateur authentifié avec statut administrateur

**Réponse**:

- **Succès** (200 OK):
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@exemple.com",
  "first_name": "Administrateur",
  "last_name": "Yoozak",
  "is_staff": true,
  "is_superuser": true,
  "is_active": true,
  "date_joined": "2023-01-01T00:00:00Z",
  "last_login": "2023-04-01T00:00:00Z",
  "groups": [
    {
      "id": 1,
      "name": "Admin"
    }
  ],
  "user_permissions": []
}
```

- **Erreur** (401 Unauthorized):
```json
{
  "detail": "Non authentifié"
}
```

- **Erreur** (403 Forbidden):
```json
{
  "detail": "Vous n'avez pas les droits d'administrateur nécessaires."
}
```

### Mettre à jour le profil administrateur

Met à jour les informations du profil de l'administrateur connecté.

- **URL**: `/api/users/profile/update/`
- **Méthode**: `PATCH`
- **Authentification requise**: Oui (Bearer Token)
- **Permissions requises**: Utilisateur authentifié avec statut administrateur

**Paramètres du corps de la requête**:

| Paramètre    | Type   | Description                           | Requis |
|--------------|--------|---------------------------------------|--------|
| username     | string | Nom d'utilisateur                     | Non    |
| email        | string | Adresse email                         | Non    |
| first_name   | string | Prénom                                | Non    |
| last_name    | string | Nom de famille                        | Non    |
| password     | string | Nouveau mot de passe                  | Non    |

**Réponse**:

- **Succès** (200 OK):
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@exemple.com",
  "first_name": "Administrateur",
  "last_name": "Yoozak",
  "is_staff": true,
  "is_superuser": true,
  "is_active": true,
  "date_joined": "2023-01-01T00:00:00Z",
  "last_login": "2023-04-01T00:00:00Z",
  "groups": [
    {
      "id": 1,
      "name": "Admin"
    }
  ],
  "user_permissions": []
}
```

- **Erreur** (400 Bad Request):
```json
{
  "password": [
    "Ce mot de passe est trop court. Il doit contenir au moins 8 caractères."
  ]
}
```

- **Erreur** (401 Unauthorized):
```json
{
  "detail": "Non authentifié"
}
```

- **Erreur** (403 Forbidden):
```json
{
  "detail": "Vous n'avez pas les droits d'administrateur nécessaires."
}
```

## Utilisation des tokens JWT

### Dans les requêtes HTTP

Pour les endpoints nécessitant une authentification, incluez le token JWT dans l'en-tête `Authorization` :

```
Authorization: Bearer <token_d_accès>
```

### Cycle de vie des tokens

1. **Obtention des tokens** : via `/api/users/auth/login/`
2. **Utilisation du token d'accès** : pour les requêtes authentifiées
3. **Rafraîchissement du token** : via `/api/users/auth/refresh/` lorsque le token d'accès expire
4. **Déconnexion** : supprimez les tokens stockés côté client

## Notes importantes

- Les tokens d'accès expirent après **1 heure**
- Les tokens de rafraîchissement expirent après **7 jours**
- Seuls les utilisateurs avec `is_staff=True` peuvent accéder aux endpoints administrateurs
- Les champs `is_staff`, `is_superuser`, `is_active`, `date_joined` et `last_login` sont en lecture seule et ne peuvent pas être modifiés via l'API
- Le mot de passe est correctement haché selon les standards de sécurité Django lorsqu'il est mis à jour