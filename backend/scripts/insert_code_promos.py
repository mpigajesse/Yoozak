#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script pour insérer des codes promo dans la base de données Yoozak
"""

import os
import sys
from datetime import timedelta

# Ajouter le répertoire parent au PYTHONPATH pour trouver les modules Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configuration pour utiliser les modèles Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.db import transaction
from django.utils import timezone
from commandes.models import CodePromo

def create_sample_code_promos():
    """Crée des codes promo d'exemple."""
    codes_promo = [
        {"numero_promo": "BIENVENUE10", "taux": 10.0, "date_debut": timezone.now(), "date_fin": timezone.now() + timedelta(days=30), "est_actif": True},
        {"numero_promo": "ETE2023", "taux": 15.0, "date_debut": timezone.now(), "date_fin": timezone.now() + timedelta(days=60), "est_actif": True},
        {"numero_promo": "VIP25", "taux": 25.0, "date_debut": timezone.now(), "date_fin": timezone.now() + timedelta(days=15), "est_actif": True},
        {"numero_promo": "BLACKFRIDAY", "taux": 30.0, "date_debut": timezone.now(), "date_fin": timezone.now() + timedelta(days=7), "est_actif": True},
        {"numero_promo": "NOEL2023", "taux": 20.0, "date_debut": timezone.now(), "date_fin": timezone.now() + timedelta(days=45), "est_actif": True},
    ]
    
    created_codes = []
    for code_data in codes_promo:
        code, created = CodePromo.objects.get_or_create(
            numero_promo=code_data["numero_promo"],
            defaults={
                "taux": code_data["taux"],
                "date_debut": code_data["date_debut"],
                "date_fin": code_data["date_fin"],
                "est_actif": code_data["est_actif"]
            }
        )
        created_codes.append(code)
        print(f"Code promo {'créé' if created else 'existant'}: {code.numero_promo} ({code.taux}%)")
    
    return created_codes

def populate_code_promos():
    """Remplit la base de données avec des codes promo."""
    try:
        with transaction.atomic():
            # Créer les codes promo
            codes_promo = create_sample_code_promos()
            
            print("Codes promo créés avec succès !")
            
            return {"codes_promo": codes_promo}
    
    except Exception as e:
        print(f"Erreur lors de la création des codes promo: {e}")
        return None

def main():
    """Fonction principale."""
    print("Insertion des codes promo dans la base de données Yoozak")
    
    confirm = input("Êtes-vous sûr de vouloir insérer ces données ? (o/n): ")
    if confirm.lower() == "o":
        populate_code_promos()
        print("Opération terminée !")
    else:
        print("Opération annulée.")

if __name__ == "__main__":
    main() 