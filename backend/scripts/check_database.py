#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script pour vérifier la configuration de la base de données utilisée par Django
"""

import os
import sys

# Ajouter le répertoire parent au PYTHONPATH pour trouver les modules Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configuration pour utiliser les modèles Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.conf import settings
from django.db import connection
from django.apps import apps

def check_database():
    """Affiche les informations sur la base de données actuellement utilisée par Django."""
    
    print("\n===== CONFIGURATION DE LA BASE DE DONNÉES =====")
    
    # Afficher la configuration depuis settings
    db_config = settings.DATABASES['default']
    print(f"ENGINE: {db_config['ENGINE']}")
    print(f"NAME: {db_config['NAME']}")
    print(f"USER: {db_config['USER']}")
    print(f"HOST: {db_config['HOST']}")
    print(f"PORT: {db_config['PORT']}")
    
    # Vérifier la connexion active
    db_conn_info = connection.settings_dict
    print("\n===== CONNEXION ACTIVE =====")
    print(f"Django est actuellement connecté à: {db_conn_info['NAME']}")
    print(f"Via le moteur: {db_conn_info['ENGINE']}")
    
    # Exécuter une requête pour vérifier que la connexion fonctionne
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()[0]
            print(f"\nVersion de la base de données: {version}")
            
            # Afficher la liste des tables
            if 'postgresql' in db_conn_info['ENGINE']:
                cursor.execute("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public'
                    ORDER BY table_name;
                """)
            elif 'sqlite' in db_conn_info['ENGINE']:
                cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            else:
                print("Moteur de base de données non reconnu pour lister les tables.")
                return
                
            tables = cursor.fetchall()
            print("\nListe des tables dans la base de données:")
            for table in tables:
                print(f"- {table[0]}")
                
            # Compter le nombre d'enregistrements dans les tables principales
            print("\nNombre d'enregistrements par table:")
            for table in ['clients_client', 'auth_user', 'products_produit', 'commandes_commande']:
                try:
                    cursor.execute(f"SELECT COUNT(*) FROM {table};")
                    count = cursor.fetchone()[0]
                    print(f"- {table}: {count} enregistrements")
                except Exception as e:
                    print(f"- {table}: Erreur - {str(e)}")
            
    except Exception as e:
        print(f"\nErreur lors de la connexion à la base de données: {e}")

def show_django_models():
    """Affiche les informations sur les modèles Django et leurs tables correspondantes."""
    print("\n===== MODÈLES DJANGO ET TABLES CORRESPONDANTES =====")
    
    all_models = []
    for app_config in apps.get_app_configs():
        for model in app_config.get_models():
            model_info = {
                'app_label': model._meta.app_label,
                'model_name': model._meta.model_name,
                'table_name': model._meta.db_table,
                'fields': [f.name for f in model._meta.fields]
            }
            all_models.append(model_info)
    
    all_models.sort(key=lambda x: (x['app_label'], x['model_name']))
    
    for model_info in all_models:
        print(f"\nApp: {model_info['app_label']}")
        print(f"Modèle: {model_info['model_name']}")
        print(f"Table: {model_info['table_name']}")
        print("Champs:")
        for field in model_info['fields']:
            print(f"  - {field}")

if __name__ == "__main__":
    check_database()
    show_django_models() 