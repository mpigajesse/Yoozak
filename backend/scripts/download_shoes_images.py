#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script pour télécharger les images de chaussures depuis l'API Yoozak
et les organiser dans la structure de dossiers appropriée.
"""

import os
import sys
import requests
import json
import time
import random
from urllib.parse import urlparse
from pathlib import Path

# Ajouter le répertoire parent au PYTHONPATH pour trouver les modules Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configuration pour utiliser les modèles Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from products.models import Produit, Creative
from django.db import transaction

# Configuration
MEDIA_ROOT = os.path.join('media', 'products')
CATEGORIES_MAP = {
    'baskets': ['sneakers', 'basket', 'sport', 'running', 'tennis'],
    'sandales': ['sandale', 'tong', 'plage', 'été'],
    'mocassins': ['mocassin', 'loafer', 'bateau'],
    'bottes': ['botte', 'bottine', 'chelsea', 'hiver'],
    'escarpins': ['escarpin', 'talon', 'stiletto'],
    'other': []  # Catégorie par défaut
}

# URLs des sources d'images depuis Unsplash
IMAGE_SOURCES = [
    # Baskets
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80",
    "https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1412&q=80",
    "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1421&q=80",
    "https://images.unsplash.com/photo-1556048219-bb6978360b84?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    
    # Mocassins
    "https://images.unsplash.com/photo-1531310197839-ccf54634509e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1465&q=80",
    "https://images.unsplash.com/photo-1582897085656-c636d006a246?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
    "https://images.unsplash.com/photo-1614253429340-98120bd6d753?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1528&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1380&q=80",
    
    # Bottes
    "https://images.unsplash.com/photo-1520219306100-ec527c1f08f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
    "https://images.unsplash.com/photo-1605812860427-4024433a70fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1450&q=80",
    "https://images.unsplash.com/photo-1610398752800-146f269dfcc8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
    
    # Escarpins
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    "https://images.unsplash.com/photo-1573100925118-870b8efc799d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
    "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1385&q=80",
    "https://images.unsplash.com/photo-1581101767113-7b6e54e1c4a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80",
    "https://images.unsplash.com/photo-1518049362265-d5b2a6b00b37?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
    
    # Sandales
    "https://images.unsplash.com/photo-1603487742131-4160ec999306?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1567&q=80",
    "https://images.unsplash.com/photo-1622478131797-76ea4e210ab4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1587467512961-120760940315?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1435&q=80",
    "https://images.unsplash.com/photo-1503146234394-631200675614?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
    "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
]

# Données de test plus complètes avec 5 produits par catégorie
TEST_PRODUCTS = [
    # Baskets (5 produits)
    {"id": 1, "name": "Baskets Nike Air Max", "description": "Baskets de sport confortables pour la course à pied", "type": "baskets"},
    {"id": 2, "name": "Baskets Adidas Superstar", "description": "Baskets streetwear iconiques à bandes", "type": "baskets"},
    {"id": 3, "name": "Baskets Puma RS-X", "description": "Baskets tendance avec semelle chunky et design rétro", "type": "baskets"},
    {"id": 4, "name": "Baskets New Balance 574", "description": "Baskets lifestyle confortables pour un usage quotidien", "type": "baskets"},
    {"id": 5, "name": "Baskets Converse All Star", "description": "Baskets en toile classiques et intemporelles", "type": "baskets"},
    
    # Escarpins (5 produits)
    {"id": 6, "name": "Escarpins Louboutin", "description": "Escarpins élégants à talons hauts en cuir verni", "type": "escarpins"},
    {"id": 7, "name": "Stilettos noirs", "description": "Escarpins noirs classiques à talons hauts", "type": "escarpins"},
    {"id": 8, "name": "Escarpins à bride", "description": "Escarpins élégants avec bride à la cheville", "type": "escarpins"},
    {"id": 9, "name": "Escarpins Manolo Blahnik", "description": "Escarpins de luxe avec détails en cristal", "type": "escarpins"},
    {"id": 10, "name": "Escarpins à plateforme", "description": "Escarpins avec semelle plateforme pour plus de confort", "type": "escarpins"},
    
    # Bottes (5 produits)
    {"id": 11, "name": "Bottes en cuir Chelsea", "description": "Bottes d'hiver imperméables en cuir véritable", "type": "bottes"},
    {"id": 12, "name": "Bottines à talons", "description": "Bottines élégantes pour femme avec fermeture éclair", "type": "bottes"},
    {"id": 13, "name": "Bottes de neige", "description": "Bottes chaudes et imperméables pour l'hiver", "type": "bottes"},
    {"id": 14, "name": "Bottes cavalières", "description": "Bottes montantes en cuir style équitation", "type": "bottes"},
    {"id": 15, "name": "Bottes de pluie", "description": "Bottes imperméables en caoutchouc pour les jours pluvieux", "type": "bottes"},
    
    # Sandales (5 produits)
    {"id": 16, "name": "Sandales à plateforme", "description": "Sandales d'été confortables avec semelle compensée", "type": "sandales"},
    {"id": 17, "name": "Tongs de plage", "description": "Tongs légères et confortables pour la plage", "type": "sandales"},
    {"id": 18, "name": "Sandales à bride", "description": "Sandales élégantes avec bride à la cheville", "type": "sandales"},
    {"id": 19, "name": "Sandales Birkenstock", "description": "Sandales anatomiques à double bride", "type": "sandales"},
    {"id": 20, "name": "Sandales gladiateur", "description": "Sandales montantes style gladiateur avec multiples lanières", "type": "sandales"},
    
    # Mocassins (5 produits)
    {"id": 21, "name": "Mocassins en daim", "description": "Mocassins élégants en daim pour homme", "type": "mocassins"},
    {"id": 22, "name": "Chaussures bateau en cuir", "description": "Mocassins de style nautique pour homme", "type": "mocassins"},
    {"id": 23, "name": "Mocassins penny loafer", "description": "Mocassins classiques avec bande de cuir sur le dessus", "type": "mocassins"},
    {"id": 24, "name": "Mocassins à glands", "description": "Mocassins élégants ornés de glands décoratifs", "type": "mocassins"},
    {"id": 25, "name": "Mocassins italiens", "description": "Mocassins en cuir souple fabriqués en Italie", "type": "mocassins"}
]

# Fonction pour déterminer la catégorie d'une chaussure
def get_category_folder(product_name, product_description=None):
    """Détermine la catégorie de la chaussure en fonction de son nom et de sa description."""
    product_text = (product_name + ' ' + (product_description or '')).lower()
    
    for category, keywords in CATEGORIES_MAP.items():
        for keyword in keywords:
            if keyword in product_text:
                return category
    
    return "other"  # Catégorie par défaut

def download_image(url, destination_path):
    """Télécharge une image depuis l'URL spécifiée et la sauvegarde localement."""
    try:
        response = requests.get(url, stream=True, timeout=10)
        response.raise_for_status()
        
        # Créer le dossier de destination s'il n'existe pas
        os.makedirs(os.path.dirname(destination_path), exist_ok=True)
        
        # Sauvegarder l'image
        with open(destination_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"Image téléchargée avec succès: {destination_path}")
        return True
    except Exception as e:
        print(f"Erreur lors du téléchargement de {url}: {e}")
        return False

def download_images_from_api():
    """Télécharge les images de produits."""
    try:
        print("Début du téléchargement des images de chaussures...")
        
        # Pour chaque produit de test
        for product in TEST_PRODUCTS:
            product_name = product["name"]
            product_description = product.get("description", "")
            
            # Utilisez le type explicite si disponible, sinon détermine la catégorie
            if "type" in product and product["type"] in CATEGORIES_MAP:
                product_category = product["type"]
            else:
                product_category = get_category_folder(product_name, product_description)
            
            print(f"Traitement du produit: {product_name} (Catégorie: {product_category})")
            
            # Sélectionner des images en fonction du type de produit
            category_images = []
            if product_category == "baskets":
                category_images = IMAGE_SOURCES[0:6]  # 6 images de baskets
            elif product_category == "mocassins":
                category_images = IMAGE_SOURCES[6:11]  # 5 images de mocassins
            elif product_category == "bottes":
                category_images = IMAGE_SOURCES[11:16]  # 5 images de bottes
            elif product_category == "escarpins":
                category_images = IMAGE_SOURCES[16:21]  # 5 images d'escarpins
            elif product_category == "sandales":
                category_images = IMAGE_SOURCES[21:26]  # 5 images de sandales
            else:
                category_images = random.sample(IMAGE_SOURCES, 3)
            
            # Prendre 1 à 2 images aléatoires parmi les images de la catégorie
            num_images = random.randint(1, min(2, len(category_images)))
            selected_images = random.sample(category_images, num_images)
            
            for i, image_url in enumerate(selected_images):
                # Extraire le nom de fichier de l'URL
                parsed_url = urlparse(image_url)
                filename = os.path.basename(parsed_url.path.split("?")[0])  # Retirer les paramètres d'URL
                
                # Si le nom de fichier n'a pas d'extension, ajouter .jpg
                if not os.path.splitext(filename)[1]:
                    filename = f"{filename}.jpg"
                
                # Renommer pour éviter les collisions
                destination_filename = f"{product['id']}_{i+1}_{filename}"
                destination_path = os.path.join(MEDIA_ROOT, product_category, destination_filename)
                
                # Télécharger l'image
                success = download_image(image_url, destination_path)
                
                if success:
                    # Créer l'entrée Creative dans la base de données
                    try:
                        with transaction.atomic():
                            # Trouver ou créer le produit
                            produit, created = Produit.objects.get_or_create(
                                nom=product_name,
                                defaults={
                                    'prix': random.uniform(29.99, 199.99),  # Prix aléatoire
                                    'description': product_description
                                }
                            )
                            
                            # Créer l'entrée Creative
                            relative_path = os.path.join('products', product_category, destination_filename)
                            creative = Creative.objects.create(
                                produit=produit,
                                type_creative="image",
                                url=f"/media/{relative_path}"
                            )
                            print(f"Entrée Creative créée: {creative}")
                    except Exception as e:
                        print(f"Erreur lors de la création de l'entrée dans la base de données: {e}")
                
                # Attendre un peu pour ne pas surcharger le serveur
                time.sleep(0.5)
    
    except Exception as e:
        print(f"Erreur lors du traitement: {e}")

def main():
    """Fonction principale."""
    download_images_from_api()
    print("Téléchargement terminé.")

if __name__ == "__main__":
    main() 