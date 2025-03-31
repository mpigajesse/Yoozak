#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script pour insérer des clients dans la base de données Yoozak
"""

import os
import sys
import random

# Ajouter le répertoire parent au PYTHONPATH pour trouver les modules Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configuration pour utiliser les modèles Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.db import transaction
from clients.models import Client
from django.contrib.auth.models import User

def create_sample_clients():
    """Crée des clients d'exemple avec leurs utilisateurs associés."""
    clients = [
        {"nom": "Dupont", "prenom": "Jean", "email": "jean.dupont@example.com", "phone": "0612345678", "username": "jdupont"},
        {"nom": "Martin", "prenom": "Sophie", "email": "sophie.martin@example.com", "phone": "0698765432", "username": "smartin"},
        {"nom": "Dubois", "prenom": "Pierre", "email": "pierre.dubois@example.com", "phone": "0654321789", "username": "pdubois"},
        {"nom": "Lambert", "prenom": "Marie", "email": "marie.lambert@example.com", "phone": "0678912345", "username": "mlambert"},
        {"nom": "Bernard", "prenom": "Lucie", "email": "lucie.bernard@example.com", "phone": "0645678912", "username": "lbernard"},
    ]
    
    created_clients = []
    for client_data in clients:
        # Créer ou récupérer l'utilisateur Django
        try:
            user, user_created = User.objects.get_or_create(
                username=client_data["username"],
                defaults={
                    "email": client_data["email"],
                    "first_name": client_data["prenom"],
                    "last_name": client_data["nom"],
                }
            )
            
            if user_created:
                # Définir un mot de passe sécurisé pour le nouvel utilisateur
                user.set_password("password123")  # À remplacer par un mot de passe plus sécurisé en production
                user.save()
                print(f"Utilisateur {'créé'}: {user.username}")
            else:
                print(f"Utilisateur {'existant'}: {user.username}")
                
            # Créer ou récupérer le client associé à cet utilisateur
            client, client_created = Client.objects.get_or_create(
                user=user,
                defaults={
                    "nom": client_data["nom"],
                    "prenom": client_data["prenom"],
                    "phone": client_data["phone"],
                    "genre": random.choice(["M", "F"]),
                    "point_de_fidelite": random.randint(0, 1000)
                }
            )
            
            created_clients.append(client)
            print(f"Client {'créé' if client_created else 'existant'}: {client.prenom} {client.nom}")
            
        except Exception as e:
            print(f"Erreur lors de la création du client {client_data['prenom']} {client_data['nom']}: {e}")
    
    return created_clients

def populate_clients():
    """Remplit la base de données avec des clients."""
    try:
        with transaction.atomic():
            # Créer des clients
            clients = create_sample_clients()
            
            print("Clients créés avec succès !")
            
            return {"clients": clients}
    
    except Exception as e:
        print(f"Erreur lors de la création des clients: {e}")
        return None

def main():
    """Fonction principale."""
    print("Insertion des clients dans la base de données Yoozak")
    
    confirm = input("Êtes-vous sûr de vouloir insérer ces données ? (o/n): ")
    if confirm.lower() == "o":
        populate_clients()
        print("Opération terminée !")
    else:
        print("Opération annulée.")

if __name__ == "__main__":
    main() 