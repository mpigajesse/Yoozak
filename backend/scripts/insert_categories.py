#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script pour insérer des catégories et sous-catégories dans la base de données Yoozak
"""

import os
import sys

# Ajouter le répertoire parent au PYTHONPATH pour trouver les modules Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configuration pour utiliser les modèles Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.db import transaction
from products.models import Categories, SousCategories

def create_sample_categories():
    """Crée des catégories d'exemple pour les produits."""
    categories = [
        {"nom": "Femme", "description": "Chaussures pour femmes"},
        {"nom": "Homme", "description": "Chaussures pour hommes"},
        {"nom": "Enfant", "description": "Chaussures pour enfants"},
        {"nom": "Sport", "description": "Chaussures de sport"},
        {"nom": "Luxe", "description": "Chaussures de luxe"},
    ]
    
    created_categories = []
    for cat_data in categories:
        cat, created = Categories.objects.get_or_create(
            nom=cat_data["nom"],
            defaults={"description": cat_data["description"]}
        )
        created_categories.append(cat)
        print(f"Catégorie {'créée' if created else 'existante'}: {cat.nom}")
    
    return created_categories

def create_sample_subcategories(categories):
    """Crée des sous-catégories d'exemple liées aux catégories."""
    sous_categories = [
        {"nom": "Baskets", "description": "Chaussures de sport décontractées", "categorie": "Sport"},
        {"nom": "Escarpins", "description": "Chaussures à talons élégantes", "categorie": "Femme"},
        {"nom": "Mocassins", "description": "Chaussures basses sans lacets", "categorie": "Homme"},
        {"nom": "Bottes", "description": "Chaussures montantes", "categorie": "Femme"},
        {"nom": "Sandales", "description": "Chaussures ouvertes pour l'été", "categorie": "Enfant"},
    ]
    
    # Dictionnaire pour retrouver facilement les catégories par nom
    cat_dict = {cat.nom: cat for cat in categories}
    
    created_subcategories = []
    for subcat_data in sous_categories:
        cat = cat_dict.get(subcat_data["categorie"])
        if cat:
            subcat, created = SousCategories.objects.get_or_create(
                nom=subcat_data["nom"],
                categorie=cat,
                defaults={"description": subcat_data["description"]}
            )
            created_subcategories.append(subcat)
            print(f"Sous-catégorie {'créée' if created else 'existante'}: {subcat.nom} (dans {cat.nom})")
    
    return created_subcategories

def populate_categories():
    """Remplit la base de données avec des catégories et sous-catégories."""
    try:
        with transaction.atomic():
            # Créer les catégories et sous-catégories
            categories = create_sample_categories()
            sous_categories = create_sample_subcategories(categories)
            
            print("Catégories et sous-catégories créées avec succès !")
            
            return {
                "categories": categories,
                "sous_categories": sous_categories
            }
    
    except Exception as e:
        print(f"Erreur lors de la création des catégories: {e}")
        return None

def main():
    """Fonction principale."""
    print("Insertion des catégories et sous-catégories dans la base de données Yoozak")
    
    confirm = input("Êtes-vous sûr de vouloir insérer ces données ? (o/n): ")
    if confirm.lower() == "o":
        populate_categories()
        print("Opération terminée !")
    else:
        print("Opération annulée.")

if __name__ == "__main__":
    main()
