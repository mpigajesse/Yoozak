#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script pour insérer des avis et favoris dans la base de données Yoozak
"""

import os
import sys
import random
from datetime import timedelta

# Ajouter le répertoire parent au PYTHONPATH pour trouver les modules Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configuration pour utiliser les modèles Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.db import transaction
from django.utils import timezone
from clients.models import Client, Favoris, Avis
from products.models import Produit

def get_clients():
    """Récupère tous les clients existants"""
    return list(Client.objects.all())

def get_produits():
    """Récupère tous les produits existants"""
    return list(Produit.objects.all())

def create_sample_favoris():
    """Crée des favoris d'exemple."""
    clients = get_clients()
    produits = get_produits()
    
    if not clients or not produits:
        print("Attention: Veuillez d'abord créer des clients et produits avec les scripts dédiés")
        return []
    
    created_favoris = []
    
    # Pour chaque client, ajouter entre 0 et 3 produits en favoris
    for client in clients:
        # Sélectionner un nombre aléatoire de produits pour ce client
        num_favoris = random.randint(0, min(3, len(produits)))
        if num_favoris == 0:
            continue
            
        # Sélectionner des produits aléatoires pour ce client
        selected_produits = random.sample(produits, num_favoris)
        
        for produit in selected_produits:
            # Vérifier si ce favori existe déjà
            favori, created = Favoris.objects.get_or_create(
                client=client,
                produit=produit,
                defaults={
                    "date_ajout": timezone.now() - timedelta(days=random.randint(0, 30))
                }
            )
            
            if created:
                created_favoris.append(favori)
                print(f"Favori créé: {client} ♥ {produit.nom}")
            else:
                print(f"Favori existant: {client} ♥ {produit.nom}")
    
    return created_favoris

def create_sample_avis():
    """Crée des avis d'exemple."""
    clients = get_clients()
    produits = get_produits()
    
    if not clients or not produits:
        print("Attention: Veuillez d'abord créer des clients et produits avec les scripts dédiés")
        return []
    
    # Commentaires d'exemple pour générer des avis réalistes
    commentaires_positifs = [
        "Très confortable, je recommande !",
        "Qualité exceptionnelle pour le prix.",
        "Parfait pour une utilisation quotidienne.",
        "Design élégant et bonne durabilité.",
        "Livraison rapide et produit conforme à la description.",
        "Je les porte tous les jours, très satisfait(e).",
        "Bon rapport qualité-prix.",
        "Ces chaussures sont devenues mes préférées !",
        "Très belle finition, je suis impressionné(e)."
    ]
    
    commentaires_neutres = [
        "Produit correct mais rien d'exceptionnel.",
        "Un peu cher pour la qualité proposée.",
        "Confortable mais pas très durable.",
        "Le design est beau mais la taille est un peu petite.",
        "Livraison un peu longue mais produit satisfaisant."
    ]
    
    commentaires_negatifs = [
        "Déçu(e) par la qualité, ne vaut pas son prix.",
        "Inconfortable après quelques heures d'utilisation.",
        "S'est abîmé très rapidement.",
        "Taille non conforme, trop petit.",
        "Le design est différent des photos du site."
    ]
    
    created_avis = []
    
    # Créer entre 15 et 25 avis au total
    num_avis = random.randint(15, 25)
    
    for _ in range(num_avis):
        # Choisir un client et un produit aléatoires
        client = random.choice(clients)
        produit = random.choice(produits)
        
        # Éviter les doublons (un client ne peut pas laisser plusieurs avis sur le même produit)
        if Avis.objects.filter(client=client, produit=produit).exists():
            continue
        
        # Générer une note aléatoire (1 à 5)
        note = random.randint(1, 5)
        
        # Sélectionner un commentaire selon la note
        if note >= 4:
            commentaire = random.choice(commentaires_positifs)
        elif note == 3:
            commentaire = random.choice(commentaires_neutres)
        else:
            commentaire = random.choice(commentaires_negatifs)
        
        # Créer l'avis
        avis = Avis.objects.create(
            client=client,
            produit=produit,
            note=note,
            commentaire=commentaire,
            date_creation=timezone.now() - timedelta(days=random.randint(0, 60))
        )
        
        created_avis.append(avis)
        print(f"Avis créé: {client} a noté {produit.nom} {note}/5")
    
    return created_avis

def populate_avis_favoris():
    """Remplit la base de données avec des avis et favoris."""
    try:
        with transaction.atomic():
            # Créer les favoris
            favoris = create_sample_favoris()
            
            # Créer les avis
            avis = create_sample_avis()
            
            if favoris or avis:
                print(f"{len(favoris)} favoris et {len(avis)} avis créés avec succès !")
                
                return {
                    "favoris": favoris,
                    "avis": avis
                }
            else:
                return None
    
    except Exception as e:
        print(f"Erreur lors de la création des avis et favoris: {e}")
        return None

def main():
    """Fonction principale."""
    print("Insertion des avis et favoris dans la base de données Yoozak")
    
    confirm = input("Êtes-vous sûr de vouloir insérer ces données ? (o/n): ")
    if confirm.lower() == "o":
        populate_avis_favoris()
        print("Opération terminée !")
    else:
        print("Opération annulée.")

if __name__ == "__main__":
    main() 