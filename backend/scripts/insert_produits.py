#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script pour insérer des produits dans la base de données Yoozak
"""

import os
import sys
import random
import json
import requests
from datetime import datetime, timedelta
from pathlib import Path

# Ajouter le répertoire parent au PYTHONPATH pour trouver les modules Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configuration pour utiliser les modèles Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.db import transaction
from django.utils import timezone
from django.conf import settings
from products.models import Produit, Article, Categories, SousCategories, Creative, Promotion, ProduitCategorie

# Chemin où les images seront enregistrées
MEDIA_ROOT = os.path.join(settings.BASE_DIR, 'media')
PRODUCTS_MEDIA_ROOT = os.path.join(MEDIA_ROOT, 'products')

# Créer les dossiers s'ils n'existent pas
os.makedirs(PRODUCTS_MEDIA_ROOT, exist_ok=True)

# URLs d'images Unsplash par type de chaussure
UNSPLASH_IMAGES = {
    "Baskets": [
        "https://images.unsplash.com/photo-1597045566677-8cf032ed6634",
        "https://images.unsplash.com/photo-1552346154-21d32810aba3",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772",
        "https://images.unsplash.com/photo-1556048219-bb6978360b84",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa"
    ],
    "Escarpins": [
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
        "https://images.unsplash.com/photo-1573100925118-870b8efc799d",
        "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4",
        "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95",
        "https://images.unsplash.com/photo-1563208085-648526fc0a70"
    ],
    "Mocassins": [
        "https://images.unsplash.com/photo-1605812860427-4024433a70fd",
        "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4",
        "https://images.unsplash.com/photo-1531310197839-ccf54634509e",
        "https://images.unsplash.com/photo-1626947346165-4c2288dadc2a",
        "https://images.unsplash.com/photo-1603808033192-082d6919d3e1"
    ],
    "Bottes": [
        "https://images.unsplash.com/photo-1520639888713-7851133b1ed0",
        "https://images.unsplash.com/photo-1608256246200-53e635a5794a",
        "https://images.unsplash.com/photo-1605812276795-3b6f4e82f200",
        "https://images.unsplash.com/photo-1626947346165-4c2288dadc2a",
        "https://images.unsplash.com/photo-1542838686-37da4a9fd1b3"
    ],
    "Sandales": [
        "https://images.unsplash.com/photo-1603750103027-90222965dfcd",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
        "https://images.unsplash.com/photo-1562273138-f46be4ebdf33",
        "https://images.unsplash.com/photo-1611693757292-fee5f18133e5",
        "https://images.unsplash.com/photo-1588850777267-ed552becaf2f"
    ],
    "Autre": [
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77"
    ]
}

# Images de secours au cas où une image ne peut être téléchargée
FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3"
]

def download_image(url, save_path):
    """Télécharge une image depuis une URL et la sauvegarde localement."""
    try:
        # Ajouter des paramètres Unsplash pour optimiser le téléchargement
        if "unsplash.com" in url and "?" not in url:
            url += "?ixlib=rb-4.0.3&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800"
        
        response = requests.get(url, stream=True, timeout=10)
        response.raise_for_status()
        
        with open(save_path, 'wb') as out_file:
            for chunk in response.iter_content(chunk_size=8192):
                out_file.write(chunk)
        return True
    except Exception as e:
        print(f"❌ Erreur lors du téléchargement de l'image {url}: {e}")
        return False

def get_shoe_type(produit):
    """Détermine le type de chaussure en fonction du nom du produit."""
    nom = produit.nom.lower()
    
    if "basket" in nom or "air max" in nom or "superstar" in nom or "converse" in nom or "chuck taylor" in nom:
        return "Baskets"
    elif "escarpin" in nom or "pigalle" in nom or "romy" in nom or "jimmy choo" in nom or "louboutin" in nom:
        return "Escarpins"
    elif "mocassin" in nom or "gommino" in nom or "tod's" in nom:
        return "Mocassins"
    elif "botte" in nom or "timberland" in nom:
        return "Bottes"
    elif "sandale" in nom or "birkenstock" in nom or "arizona" in nom:
        return "Sandales"
    else:
        return "Autre"

def get_categories():
    """Récupère toutes les catégories existantes"""
    return {cat.nom: cat for cat in Categories.objects.all()}

def get_sous_categories():
    """Récupère toutes les sous-catégories existantes"""
    return {subcat.nom: subcat for subcat in SousCategories.objects.all()}

def create_sample_produits():
    """Crée des produits d'exemple."""
    # Récupérer les catégories et sous-catégories existantes
    categories = get_categories()
    sous_categories = get_sous_categories()
    
    if not categories or not sous_categories:
        print("Attention: Veuillez d'abord créer des catégories et sous-catégories avec le script insert_categories.py")
        return []
    
    produits = [
        {
            "nom": "Nike Air Max 90",
            "prix": 129.99,
            "description": "Chaussure de course iconique avec une unité Air visible.",
            "type_de_semelle": "Caoutchouc",
            "matieres_premieres": json.dumps({"dessus": "cuir", "semelle": "caoutchouc", "intérieur": "textile"}),
            "origine": "Vietnam",
            "categories": ["Sport", "Femme"],
            "sous_categorie": "Baskets"
        },
        {
            "nom": "Adidas Superstar",
            "prix": 99.99,
            "description": "Chaussure de skateboard avec embout en coquille.",
            "type_de_semelle": "Caoutchouc",
            "matieres_premieres": json.dumps({"dessus": "cuir", "semelle": "caoutchouc", "intérieur": "textile"}),
            "origine": "Chine",
            "categories": ["Sport", "Homme"],
            "sous_categorie": "Baskets"
        },
        {
            "nom": "Louboutin Pigalle",
            "prix": 595.00,
            "description": "Escarpins élégants à talons hauts avec semelle rouge signature.",
            "type_de_semelle": "Cuir",
            "matieres_premieres": json.dumps({"dessus": "cuir verni", "semelle": "cuir", "intérieur": "cuir"}),
            "origine": "Italie",
            "categories": ["Femme", "Luxe"],
            "sous_categorie": "Escarpins"
        },
        {
            "nom": "Timberland 6-inch Premium",
            "prix": 179.99,
            "description": "Bottes robustes et imperméables.",
            "type_de_semelle": "Caoutchouc",
            "matieres_premieres": json.dumps({"dessus": "nubuck", "semelle": "caoutchouc", "intérieur": "textile"}),
            "origine": "République Dominicaine",
            "categories": ["Homme"],
            "sous_categorie": "Bottes"
        },
        {
            "nom": "Birkenstock Arizona",
            "prix": 89.99,
            "description": "Sandales confortables avec semelle de liège.",
            "type_de_semelle": "Liège",
            "matieres_premieres": json.dumps({"dessus": "cuir suédé", "semelle": "liège", "intérieur": "liège"}),
            "origine": "Allemagne",
            "categories": ["Homme", "Femme"],
            "sous_categorie": "Sandales"
        },
        {
            "nom": "Tod's Gommino",
            "prix": 425.00,
            "description": "Mocassins de luxe avec picots en caoutchouc.",
            "type_de_semelle": "Caoutchouc",
            "matieres_premieres": json.dumps({"dessus": "cuir premium", "semelle": "caoutchouc", "intérieur": "cuir"}),
            "origine": "Italie",
            "categories": ["Homme", "Luxe"],
            "sous_categorie": "Mocassins"
        },
        {
            "nom": "Converse Chuck Taylor All Star",
            "prix": 69.99,
            "description": "Baskets en toile emblématiques.",
            "type_de_semelle": "Caoutchouc",
            "matieres_premieres": json.dumps({"dessus": "toile", "semelle": "caoutchouc", "intérieur": "textile"}),
            "origine": "Vietnam",
            "categories": ["Homme", "Femme", "Enfant"],
            "sous_categorie": "Baskets"
        },
        {
            "nom": "Jimmy Choo Romy",
            "prix": 650.00,
            "description": "Escarpins pointus avec un talon fin.",
            "type_de_semelle": "Cuir",
            "matieres_premieres": json.dumps({"dessus": "daim", "semelle": "cuir", "intérieur": "cuir"}),
            "origine": "Italie",
            "categories": ["Femme", "Luxe"],
            "sous_categorie": "Escarpins"
        }
    ]
    
    created_produits = []
    
    for produit_data in produits:
        # Créer le produit de base
        produit, created = Produit.objects.get_or_create(
            nom=produit_data["nom"],
            defaults={
                "prix": produit_data["prix"],
                "description": produit_data["description"],
                "type_de_semelle": produit_data["type_de_semelle"],
                "matieres_premieres": produit_data["matieres_premieres"],
                "origine": produit_data["origine"],
            }
        )
        
        # Associer les catégories
        for cat_name in produit_data["categories"]:
            if cat_name in categories:
                ProduitCategorie.objects.get_or_create(
                    produit=produit,
                    categorie=categories[cat_name]
                )
        
        created_produits.append(produit)
        print(f"Produit {'créé' if created else 'existant'}: {produit.nom}")
    
    return created_produits

def create_sample_articles(produits):
    """Crée des articles d'exemple pour chaque produit."""
    tailles = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]
    couleurs = ["Noir", "Blanc", "Rouge", "Bleu", "Vert", "Jaune", "Rose", "Gris", "Marron", "Beige"]
    
    created_articles = []
    
    for produit in produits:
        # Générer 3 à 5 articles par produit avec différentes tailles et couleurs
        num_articles = random.randint(3, 5)
        for _ in range(num_articles):
            # Choisir une taille et une couleur aléatoires
            taille = random.choice(tailles)
            couleur = random.choice(couleurs)
            
            # Générer un code-barres unique (simple exemple)
            code_bar = f"{produit.id}-{taille}-{random.randint(10000, 99999)}"
            
            # Créer l'article
            article, created = Article.objects.get_or_create(
                produit=produit,
                pointure=taille,
                couleur=couleur,
                code_bar=code_bar,
                defaults={
                    "date_achat": timezone.now() - timedelta(days=random.randint(1, 90))
                }
            )
            
            created_articles.append(article)
            print(f"Article {'créé' if created else 'existant'}: {article}")
    
    return created_articles

def create_sample_creatives(produits):
    """Crée des créatives (médias) d'exemple pour chaque produit et télécharge des images réelles."""
    # Types de médias possibles
    types_media = ["image_principale", "image_secondaire", "video_produit", "image_360"]
    
    # Créer les dossiers pour chaque type de chaussure
    for shoe_type in ["Baskets", "Escarpins", "Mocassins", "Bottes", "Sandales", "Autre"]:
        os.makedirs(os.path.join(PRODUCTS_MEDIA_ROOT, shoe_type.lower()), exist_ok=True)
    
    created_creatives = []
    
    for produit in produits:
        # Déterminer le type de chaussure
        shoe_type = get_shoe_type(produit)
        
        # Créer au moins une image principale et 1-2 médias supplémentaires
        medias_to_create = ["image_principale"]
        
        # Ajouter 1 à 2 médias supplémentaires aléatoires
        for _ in range(random.randint(1, 2)):
            medias_to_create.append(random.choice(types_media[1:]))
        
        for media_type in medias_to_create:
            # Vérifier si cette creative existe déjà pour ce produit/type
            existing_creative = Creative.objects.filter(
                produit=produit,
                type_creative=media_type
            ).first()
            
            if existing_creative:
                created_creatives.append(existing_creative)
                print(f"Creative existante: {existing_creative}")
                continue
            
            # Générer les noms de fichiers
            safe_product_name = produit.nom.lower().replace(' ', '_').replace("'", "")
            filename = f"{safe_product_name}_{media_type}_{random.randint(1000, 9999)}.jpg"
            
            # Chemin complet pour l'image
            relative_path = os.path.join(shoe_type.lower(), filename)
            full_path = os.path.join(PRODUCTS_MEDIA_ROOT, relative_path)
            
            # URL pour enregistrer dans la base de données (relative à MEDIA_ROOT)
            db_url = f"/media/products/{relative_path}"
            
            # Télécharger l'image
            download_success = False
            
            # Essayer de télécharger une image pour le type spécifique de chaussure
            if media_type in ["image_principale", "image_secondaire", "image_360"]:
                # Choisir une URL aléatoire selon le type de chaussure
                image_urls = UNSPLASH_IMAGES.get(shoe_type, UNSPLASH_IMAGES["Autre"])
                
                if image_urls:
                    image_url = random.choice(image_urls)
                    download_success = download_image(image_url, full_path)
            
            # Si le téléchargement échoue ou s'il s'agit d'un type de média non-image, utiliser une URL de secours
            if not download_success:
                fallback_url = random.choice(FALLBACK_IMAGES)
                download_success = download_image(fallback_url, full_path)
            
            # Si même l'URL de secours échoue, utiliser une URL fictive
            if not download_success:
                print(f"⚠️ Impossible de télécharger une image pour {produit.nom}, utilisation d'une URL fictive")
                # Utilisation d'URL relative par rapport à MEDIA_URL
                db_url = f"/media/products/default.jpg"
                # Essayer de copier une image par défaut si elle existe
                default_img = os.path.join(PRODUCTS_MEDIA_ROOT, "default.jpg")
                if not os.path.exists(default_img):
                    # Toucher un fichier vide pour éviter les erreurs 404
                    with open(default_img, 'w') as f:
                        f.write("Placeholder")
            
            # Créer l'entrée Creative
            creative = Creative.objects.create(
                produit=produit,
                type_creative=media_type,
                url=db_url
            )
            
            created_creatives.append(creative)
            print(f"Creative créée: {creative} - URL: {db_url}")
    
    return created_creatives

def create_sample_promotions(produits):
    """Crée des promotions d'exemple pour certains produits."""
    # Types de promotions possibles
    types_promo = ["Soldes d'été", "Black Friday", "Déstockage", "Promotion de lancement", "Vente flash"]
    
    created_promotions = []
    
    # Sélectionner aléatoirement environ la moitié des produits pour avoir des promotions
    produits_en_promo = random.sample(produits, len(produits) // 2)
    
    for produit in produits_en_promo:
        # Choisir un type de promotion aléatoire
        type_promo = random.choice(types_promo)
        
        # Générer une réduction entre 10% et 50%
        reduction = random.randint(10, 50)
        
        # Générer des dates de début et de fin de promotion
        date_debut = timezone.now() - timedelta(days=random.randint(0, 10))
        date_fin = date_debut + timedelta(days=random.randint(7, 30))
        
        # Créer la promotion
        promotion, created = Promotion.objects.get_or_create(
            produit=produit,
            type_promo=type_promo,
            defaults={
                "reduction": reduction,
                "date_debut": date_debut,
                "date_fin": date_fin
            }
        )
        
        created_promotions.append(promotion)
        print(f"Promotion {'créée' if created else 'existante'}: {promotion}")
    
    return created_promotions

def populate_produits():
    """Remplit la base de données avec des produits et leurs données associées."""
    try:
        with transaction.atomic():
            # Créer les produits
            produits = create_sample_produits()
            
            if produits:
                # Créer les articles correspondants
                articles = create_sample_articles(produits)
                
                # Créer les créatives pour les produits
                creatives = create_sample_creatives(produits)
                
                # Créer des promotions pour certains produits
                promotions = create_sample_promotions(produits)
                
                print("Produits et données associées créés avec succès !")
                
                return {
                    "produits": produits,
                    "articles": articles,
                    "creatives": creatives,
                    "promotions": promotions
                }
            else:
                return None
    
    except Exception as e:
        print(f"Erreur lors de la création des produits: {e}")
        return None

def main():
    """Fonction principale."""
    print("Insertion des produits dans la base de données Yoozak")
    
    confirm = input("Êtes-vous sûr de vouloir insérer ces données ? (o/n): ")
    if confirm.lower() == "o":
        populate_produits()
        print("Opération terminée !")
    else:
        print("Opération annulée.")

if __name__ == "__main__":
    main() 