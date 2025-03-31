#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script pour insérer des données d'exemple dans la base de données Yoozak
"""

import os
import sys
import random
from datetime import datetime, timedelta

# Ajouter le répertoire parent au PYTHONPATH pour trouver les modules Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configuration pour utiliser les modèles Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.db import transaction
from django.utils import timezone
from products.models import Produit, Article, Categories, SousCategories, Creative, Promotion
from clients.models import Client, Favoris, Avis
from commandes.models import Commande, LigneCommande, Panier, EtatCommande, Remise, CodePromo, Retour

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

def create_sample_etats_commande():
    """Crée les différents états possibles pour une commande."""
    etats = [
        {"nom": "En attente", "description": "Commande en attente de traitement"},
        {"nom": "Validée", "description": "Commande validée et en cours de préparation"},
        {"nom": "Expédiée", "description": "Commande expédiée vers le client"},
        {"nom": "Livrée", "description": "Commande livrée au client"},
        {"nom": "Annulée", "description": "Commande annulée par le client ou le vendeur"},
        {"nom": "Retournée", "description": "Produits retournés par le client"}
    ]
    
    created_etats = []
    for etat_data in etats:
        etat, created = EtatCommande.objects.get_or_create(
            nom=etat_data["nom"],
            defaults={"description": etat_data["description"]}
        )
        created_etats.append(etat)
        print(f"État de commande {'créé' if created else 'existant'}: {etat.nom}")
    
    return created_etats

def create_sample_code_promos():
    """Crée des codes promo d'exemple."""
    codes_promo = [
        {"code": "BIENVENUE10", "reduction": 10.0, "date_expiration": timezone.now() + timedelta(days=30), "usage_unique": False},
        {"code": "ETE2023", "reduction": 15.0, "date_expiration": timezone.now() + timedelta(days=60), "usage_unique": False},
        {"code": "VIP25", "reduction": 25.0, "date_expiration": timezone.now() + timedelta(days=15), "usage_unique": True},
    ]
    
    created_codes = []
    for code_data in codes_promo:
        code, created = CodePromo.objects.get_or_create(
            code=code_data["code"],
            defaults={
                "reduction": code_data["reduction"],
                "date_expiration": code_data["date_expiration"],
                "usage_unique": code_data["usage_unique"]
            }
        )
        created_codes.append(code)
        print(f"Code promo {'créé' if created else 'existant'}: {code.code} ({code.reduction}%)")
    
    return created_codes

# TODO: Ajouter les clients  dans la table client
def create_sample_clients():
    """Crée des clients d'exemple."""
    clients = [
        {"nom": "Dupont", "prenom": "Jean", "email": "jean.dupont@example.com", "phone": "0612345678"},
        {"nom": "Martin", "prenom": "Sophie", "email": "sophie.martin@example.com", "phone": "0698765432"},
        {"nom": "Dubois", "prenom": "Pierre", "email": "pierre.dubois@example.com", "phone": "0654321789"},
        {"nom": "Lambert", "prenom": "Marie", "email": "marie.lambert@example.com", "phone": "0678912345"},
        {"nom": "Bernard", "prenom": "Lucie", "email": "lucie.bernard@example.com", "phone": "0645678912"},
    ]
#creation des clients
    created_clients = []
    for client_data in clients:
        client, created = Client.objects.get_or_create(
            email=client_data["email"],
            defaults={
                "nom": client_data["nom"],
                "prenom": client_data["prenom"],
                "phone": client_data["phone"],
                "genre": random.choice(["M", "F"]),
                "point_de_fidelite": random.randint(0, 1000)
            }
        )
        created_clients.append(client)
        print(f"Client {'créé' if created else 'existant'}: {client.prenom} {client.nom}")
    
    return created_clients

def populate_database():
    """Remplit la base de données avec des données d'exemple."""
    try:
        with transaction.atomic():
            # Créer les catégories et sous-catégories
            categories = create_sample_categories()
            sous_categories = create_sample_subcategories(categories)
            
            # Créer les états de commande
            etats_commande = create_sample_etats_commande()
            
            # Créer les codes promo
            codes_promo = create_sample_code_promos()
            
            # Créer des clients
            clients = create_sample_clients()
            
            print("Base de données remplie avec succès !")
            
            return {
                "categories": categories,
                "sous_categories": sous_categories,
                "etats_commande": etats_commande,
                "codes_promo": codes_promo,
                "clients": clients
            }
    
    except Exception as e:
        print(f"Erreur lors du remplissage de la base de données: {e}")
        return None

def main():
    """Fonction principale."""
    print("Insertion de données d'exemple dans la base de données Yoozak")
    
    confirm = input("Êtes-vous sûr de vouloir insérer des données d'exemple ? (o/n): ")
    if confirm.lower() == "o":
        populate_database()
        print("Opération terminée !")
    else:
        print("Opération annulée.")

if __name__ == "__main__":
    main() 