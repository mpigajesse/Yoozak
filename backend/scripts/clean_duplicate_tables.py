#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script pour supprimer les tables en doublon dans la base de données Yoozak
"""

import os
import sys

# Ajouter le répertoire parent au PYTHONPATH pour trouver les modules Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configuration pour utiliser les modèles Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.db import connection

def clean_duplicate_tables():
    """Supprime les tables en doublon qui ne sont pas utilisées par Django."""
    
    # Tables incorrectes à supprimer (qui font doublon avec les tables Django)
    duplicate_tables = [
        'client',
        'produit',
        'commande',
        'article',
        'avis',
        'categories',
        'sous_categories',
        'creative',
        'promotion',
        'catalogue',
        'favoris',
        'panier',
        'etat_commande',
        'remise',
        'retour',
        'code_promo',
        'produit_catalogue',
    ]
    
    # Tables correctes utilisées par Django (pour référence)
    correct_tables = [
        'clients_client',
        'products_produit',
        'commandes_commande',
        'products_article',
        'clients_avis',
        'products_categories',
        'products_souscategories',
        'products_creative',
        'products_promotion',
        'products_catalogue',
        'clients_favoris',
        'commandes_panier',
        'commandes_etatcommande',
        'commandes_remise',
        'commandes_retour',
        'commandes_codepromo',
        'products_produitcatalogue',
    ]
    
    try:
        with connection.cursor() as cursor:
            # Vérifier chaque table en doublon
            for table in duplicate_tables:
                # Vérifier si la table existe
                cursor.execute("""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_schema = 'public' 
                        AND table_name = %s
                    );
                """, [table])
                exists = cursor.fetchone()[0]
                
                if exists:
                    try:
                        # Supprimer la table
                        print(f"Suppression de la table en doublon: {table}")
                        cursor.execute(f"DROP TABLE IF EXISTS {table} CASCADE;")
                        print(f"✅ Table {table} supprimée avec succès")
                    except Exception as e:
                        print(f"❌ Erreur lors de la suppression de la table {table}: {e}")
                else:
                    print(f"⚠️ Table {table} n'existe pas, aucune action nécessaire")
                    
            print("\nCONCLUSION")
            print("----------")
            print("Nettoyage terminé. Les tables correctes utilisées par Django sont:")
            for table in correct_tables:
                print(f"- {table}")
    
    except Exception as e:
        print(f"Erreur lors du nettoyage des tables en doublon: {e}")

def main():
    """Fonction principale."""
    print("Nettoyage des tables en doublon dans la base de données Yoozak")
    
    confirm = input("Êtes-vous sûr de vouloir supprimer les tables en doublon ? Cette action est irréversible (o/n): ")
    if confirm.lower() == "o":
        clean_duplicate_tables()
        print("Opération terminée !")
    else:
        print("Opération annulée.")

if __name__ == "__main__":
    main() 