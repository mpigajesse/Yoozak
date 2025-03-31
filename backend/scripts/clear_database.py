#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script pour vider toutes les tables de la base de données Yoozak
"""

import os
import sys

# Ajouter le répertoire parent au PYTHONPATH pour trouver les modules Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configuration pour utiliser les modèles Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.db import transaction, connection

def truncate_table(table_name):
    """Vide une table spécifique de la base de données."""
    with connection.cursor() as cursor:
        print(f"Vidage de la table {table_name}...")
        # Pour PostgreSQL
        cursor.execute(f"TRUNCATE TABLE {table_name} RESTART IDENTITY CASCADE;")
        # Pour SQLite (si nécessaire)
        # cursor.execute(f"DELETE FROM {table_name};")
        # cursor.execute("DELETE FROM sqlite_sequence WHERE name=?;", [table_name])

def truncate_all_tables():
    """Vide toutes les tables de l'application."""
    try:
        with transaction.atomic():
            # Tables de l'application commandes
            truncate_table("commandes_retour")
            truncate_table("commandes_codepromo")
            truncate_table("commandes_remise")
            truncate_table("commandes_lignecommande")
            truncate_table("commandes_commande")
            truncate_table("commandes_etatcommande")
            truncate_table("commandes_panier")
            
            # Tables de l'application clients
            truncate_table("clients_avis")
            truncate_table("clients_favoris")
            truncate_table("clients_client")
            
            # Tables de l'application products
            truncate_table("products_promotion")
            truncate_table("products_creative")
            truncate_table("products_produitcatalogue")
            truncate_table("products_produitcategorie")
            truncate_table("products_article")
            truncate_table("products_produit")
            truncate_table("products_catalogue")
            truncate_table("products_souscategories")
            truncate_table("products_categories")
            
            # Tables d'authentification (seulement si nécessaire)
            # truncate_table("auth_user")
            
        print("Toutes les tables ont été vidées avec succès !")
        return True
        
    except Exception as e:
        print(f"Erreur lors du vidage des tables: {e}")
        return False

def truncate_specific_tables(tables):
    """Vide des tables spécifiques de la base de données."""
    try:
        with transaction.atomic():
            for table in tables:
                truncate_table(table)
                
        print(f"Les tables sélectionnées ({', '.join(tables)}) ont été vidées avec succès !")
        return True
        
    except Exception as e:
        print(f"Erreur lors du vidage des tables spécifiques: {e}")
        return False

def main():
    """Fonction principale."""
    print("Vidage des tables de la base de données Yoozak")
    print("1. Vider toutes les tables")
    print("2. Vider seulement les tables de commandes")
    print("3. Vider seulement les tables de clients")
    print("4. Vider seulement les tables de produits")
    print("5. Quitter")
    
    choice = input("Votre choix (1-5): ")
    
    if choice == "1":
        confirm = input("ATTENTION: Êtes-vous sûr de vouloir vider TOUTES les tables ? Cette action est irréversible. (o/n): ")
        if confirm.lower() == "o":
            truncate_all_tables()
    
    elif choice == "2":
        confirm = input("Êtes-vous sûr de vouloir vider les tables de commandes ? Cette action est irréversible. (o/n): ")
        if confirm.lower() == "o":
            tables = [
                "commandes_retour", 
                "commandes_codepromo", 
                "commandes_remise", 
                "commandes_lignecommande", 
                "commandes_commande", 
                "commandes_etatcommande", 
                "commandes_panier"
            ]
            truncate_specific_tables(tables)
    
    elif choice == "3":
        confirm = input("Êtes-vous sûr de vouloir vider les tables de clients ? Cette action est irréversible. (o/n): ")
        if confirm.lower() == "o":
            tables = [
                "clients_avis", 
                "clients_favoris", 
                "clients_client"
            ]
            truncate_specific_tables(tables)
    
    elif choice == "4":
        confirm = input("Êtes-vous sûr de vouloir vider les tables de produits ? Cette action est irréversible. (o/n): ")
        if confirm.lower() == "o":
            tables = [
                "products_promotion", 
                "products_creative", 
                "products_produitcatalogue", 
                "products_produitcategorie", 
                "products_article", 
                "products_produit", 
                "products_catalogue", 
                "products_souscategories", 
                "products_categories"
            ]
            truncate_specific_tables(tables)
    
    elif choice == "5":
        print("Au revoir !")
    
    else:
        print("Choix invalide.")

if __name__ == "__main__":
    main() 