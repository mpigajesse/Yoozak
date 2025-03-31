# Application Commandes

## Description
L'application **Commandes** gère tout le processus de commande dans la boutique Yoozak, depuis le panier d'achat jusqu'au suivi des commandes passées, y compris la gestion des remises, codes promo et retours.

## Modèles de données

### EtatCommande
Représente les différents états possibles d'une commande.
- `libelle_etat`: Nom de l'état (ex: "En attente", "Expédiée", "Livrée")
- `description`: Description détaillée de l'état
- `ordre`: Ordre dans le processus de commande

### Commande
Modèle central représentant une commande client.
- `client`: Lien vers le client qui a passé commande
- `date_commande`: Date à laquelle la commande a été passée
- `adresse`: Adresse de livraison
- `region`: Région de livraison
- `etat_commande`: Lien vers l'état actuel de la commande
- `date_creation`: Date de création de l'enregistrement
- `date_modification`: Date de dernière modification

### LigneCommande
Représente une ligne individuelle d'une commande (un produit commandé).
- `commande`: Lien vers la commande parente
- `produit`: Lien vers le produit commandé
- `article`: Lien vers l'article spécifique (taille/couleur)
- `quantite`: Nombre d'unités commandées
- `prix_unitaire`: Prix unitaire au moment de la commande

### Remise
Gère les réductions appliquées à une commande.
- `commande`: Lien vers la commande
- `taux_de_reduction`: Pourcentage de réduction
- `date_creation`: Date d'application de la remise

### CodePromo
Gère les codes promotionnels.
- `numero_promo`: Code unique de la promotion
- `taux`: Taux de réduction
- `commande`: Lien vers la commande qui a utilisé ce code (null si non utilisé)
- `date_debut`: Date de début de validité
- `date_fin`: Date de fin de validité
- `est_actif`: Indique si le code est actif

### Retour
Gère les retours de produits.
- `commande`: Lien vers la commande concernée
- `motif`: Raison du retour
- `date_retour`: Date du retour
- `date_creation`: Date d'enregistrement du retour

### Panier
Représente les articles dans le panier d'un client.
- `client`: Lien vers le client
- `produit`: Lien vers le produit
- `quantite`: Nombre d'unités
- `date_ajout`: Date d'ajout au panier

## API (sous `/api/commandes/`)

L'API Commandes suit l'architecture REST et utilise Django REST Framework.

### Endpoints principaux

- `/api/commandes/etats/` - Gestion des états de commande
- `/api/commandes/commandes/` - Gestion des commandes
- `/api/commandes/paniers/` - Gestion des paniers
- `/api/commandes/retours/` - Gestion des retours
- `/api/commandes/codes-promo/` - Gestion des codes promotionnels

### Endpoints spéciaux

- `/api/commandes/commandes/mes_commandes/` - Récupérer les commandes du client connecté
- `/api/commandes/paniers/mon_panier/` - Récupérer le panier du client connecté
- `/api/commandes/codes-promo/{id}/validate/` - Valider un code promotionnel

### Fonctionnalités

- Gestion complète du panier d'achat
- Passage de commande
- Suivi des commandes avec différents états
- Application de codes promo et remises
- Gestion des retours
- Filtrage des commandes par client, état, date
- Authentification JWT requise pour la plupart des opérations

### Permissions

- Création de commande: utilisateurs authentifiés
- Consultation des commandes: propriétaire ou administrateur
- Modification/suppression: propriétaire ou administrateur
- Validation de code promo: utilisateurs authentifiés
- Administration des codes promo: administrateurs uniquement

## Serializers

### EtatCommandeSerializer
Sérialisation des états de commande.

### LigneCommandeSerializer
Sérialisation des lignes de commande avec détails du produit.

### RemiseSerializer, CodePromoSerializer, RetourSerializer
Sérialisations pour les remises, codes promo et retours.

### CommandeListSerializer
Sérialisation simplifiée des commandes pour les listes.

### CommandeDetailSerializer
Sérialisation détaillée d'une commande avec toutes ses relations.

### CommandeCreateSerializer
Sérialisation spécifique pour la création d'une commande.

### PanierSerializer
Sérialisation des articles dans le panier avec détails du produit.

## Structure des dossiers

```
commandes/
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
python manage.py migrate commandes
```

### Exemples d'utilisation

#### Consultation du panier
```
GET /api/commandes/paniers/mon_panier/
Authorization: Bearer <token>
```

#### Création d'une commande
```
POST /api/commandes/commandes/
Authorization: Bearer <token>
{
  "client": 1,
  "adresse": "123 Rue Example",
  "region": "Paris",
  "etat_commande": 1,
  "lignes": [
    {
      "produit": 1,
      "article": 2,
      "quantite": 2
    }
  ]
}
```

#### Validation d'un code promo
```
POST /api/commandes/codes-promo/5/validate/
Authorization: Bearer <token>
```

### Test des API avec PowerShell

#### Obtenir un token JWT
```powershell
$body = @{username='admin'; password='admin'} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/token/" -Method Post -Body $body -ContentType "application/json"
$token = $response.access
$headers = @{Authorization = "Bearer $token"}
```

#### Lister les états de commande
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/commandes/etats/" -Method Get -Headers $headers
```

#### Lister toutes les commandes
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/commandes/commandes/" -Method Get -Headers $headers
```

#### Consulter ses propres commandes
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/commandes/commandes/mes_commandes/" -Method Get -Headers $headers
```

#### Consulter son panier
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/commandes/paniers/mon_panier/" -Method Get -Headers $headers
```

#### Ajouter un article au panier
```powershell
$panierBody = @{produit=1; quantite=2} | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/commandes/paniers/" -Method Post -Headers $headers -Body $panierBody -ContentType "application/json"
```

#### Créer une commande
```powershell
$commandeBody = @{
    adresse="123 Rue Example";
    region="Paris";
    etat_commande=1;
    lignes=@(
        @{produit=1; quantite=2}
    )
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/commandes/commandes/" -Method Post -Headers $headers -Body $commandeBody -ContentType "application/json"
```

#### Valider un code promo
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/commandes/codes-promo/1/validate/" -Method Post -Headers $headers
``` 