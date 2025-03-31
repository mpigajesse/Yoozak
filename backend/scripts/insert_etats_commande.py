#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script pour insérer des états de commande dans la base de données Yoozak
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
from commandes.models import EtatCommande

def create_sample_etats_commande():
    """Crée les différents états possibles pour une commande."""
    etats = [
        {"libelle_etat": "En attente", "description": "Commande en attente de traitement"},
        {"libelle_etat": "Validée", "description": "Commande validée et en cours de préparation"},
        {"libelle_etat": "Expédiée", "description": "Commande expédiée vers le client"},
        {"libelle_etat": "Livrée", "description": "Commande livrée au client"},
        {"libelle_etat": "Annulée", "description": "Commande annulée par le client ou le vendeur"},
        {"libelle_etat": "Retournée", "description": "Produits retournés par le client"}
    ]
    
    created_etats = []
    for etat_data in etats:
        etat, created = EtatCommande.objects.get_or_create(
            libelle_etat=etat_data["libelle_etat"],
            defaults={}
        )
        created_etats.append(etat)
        print(f"État de commande {'créé' if created else 'existant'}: {etat.libelle_etat}")
    
    return created_etats

def populate_etats_commande():
    """Remplit la base de données avec des états de commande."""
    try:
        with transaction.atomic():
            # Créer les états de commande
            etats_commande = create_sample_etats_commande()
            
            print("États de commande créés avec succès !")
            
            return {"etats_commande": etats_commande}
    
    except Exception as e:
        print(f"Erreur lors de la création des états de commande: {e}")
        return None

def main():
    """Fonction principale."""
    print("Insertion des états de commande dans la base de données Yoozak")
    
    confirm = input("Êtes-vous sûr de vouloir insérer ces données ? (o/n): ")
    if confirm.lower() == "o":
        populate_etats_commande()
        print("Opération terminée !")
    else:
        print("Opération annulée.")

if __name__ == "__main__":
    main() 