#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script pour insérer des produits dans la base de données Yoozak
"""

import os
import sys
import random
import json
from datetime import datetime, timedelta

# Ajouter le répertoire parent au PYTHONPATH pour trouver les modules Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configuration pour utiliser les modèles Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.db import transaction
from django.utils import timezone
from products.models import Produit, Article, Categories, SousCategories, Creative, Promotion, ProduitCategorie

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
    """Crée des créatives (médias) d'exemple pour chaque produit."""
    # Types de médias possibles
    types_media = ["image_principale", "image_secondaire", "video_produit", "image_360"]
    
    created_creatives = []
    
    for produit in produits:
        # Créer au moins une image principale et quelques médias supplémentaires
        medias_to_create = ["image_principale"]
        
        # Ajouter 1 à 3 médias supplémentaires aléatoires
        for _ in range(random.randint(1, 3)):
            medias_to_create.append(random.choice(types_media[1:]))
        
        for media_type in medias_to_create:
            # Générer une URL fictive selon le type de média
            if media_type == "image_principale":
                url = f"https://yoozak.com/media/products/{produit.nom.lower().replace(' ', '_')}_main.jpg"
            elif media_type == "image_secondaire":
                url = f"https://yoozak.com/media/products/{produit.nom.lower().replace(' ', '_')}_secondary_{random.randint(1, 3)}.jpg"
            elif media_type == "video_produit":
                url = f"https://yoozak.com/media/products/{produit.nom.lower().replace(' ', '_')}_video.mp4"
            else:  # image_360
                url = f"https://yoozak.com/media/products/{produit.nom.lower().replace(' ', '_')}_360.jpg"
            
            # Créer la creative
            creative, created = Creative.objects.get_or_create(
                produit=produit,
                type_creative=media_type,
                url=url
            )
            
            created_creatives.append(creative)
            print(f"Creative {'créée' if created else 'existante'}: {creative}")
    
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