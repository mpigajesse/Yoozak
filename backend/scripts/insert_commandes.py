#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script pour insérer des commandes dans la base de données Yoozak
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
from commandes.models import Commande, LigneCommande, EtatCommande
from clients.models import Client
from products.models import Produit, Article

def get_clients():
    """Récupère tous les clients existants"""
    return list(Client.objects.all())

def get_produits():
    """Récupère tous les produits existants"""
    return list(Produit.objects.all())

def get_articles():
    """Récupère tous les articles existants"""
    return list(Article.objects.all())

def get_etats_commande():
    """Récupère tous les états de commande existants"""
    return list(EtatCommande.objects.all())

def create_sample_commandes():
    """Crée des commandes d'exemple."""
    clients = get_clients()
    produits = get_produits()
    articles = get_articles()
    etats_commande = get_etats_commande()
    
    if not clients or not produits or not etats_commande:
        print("Attention: Veuillez d'abord créer des clients, produits et états de commande avec les scripts dédiés")
        return []
    
    # Regrouper les articles par produit
    articles_by_produit = {}
    for article in articles:
        if article.produit.id not in articles_by_produit:
            articles_by_produit[article.produit.id] = []
        articles_by_produit[article.produit.id].append(article)
    
    # Créer entre 10 et 20 commandes
    num_commandes = random.randint(10, 20)
    created_commandes = []
    
    for _ in range(num_commandes):
        # Choisir un client aléatoire
        client = random.choice(clients)
        
        # Choisir un état de commande aléatoire
        etat_commande = random.choice(etats_commande)
        
        # Générer une date de commande (entre il y a 60 jours et aujourd'hui)
        date_commande = timezone.now() - timedelta(days=random.randint(0, 60))
        
        # Créer la commande
        commande = Commande.objects.create(
            client=client,
            etat_commande=etat_commande,
            date_commande=date_commande,
            adresse=f"{random.randint(1, 150)} rue de la Paix",
            region="Île-de-France" if random.random() < 0.5 else "Provence-Alpes-Côte d'Azur",
            date_creation=date_commande,
            date_modification=date_commande + timedelta(hours=random.randint(1, 48))
        )
        
        # Nombre de produits commandés (entre 1 et 4)
        num_produits = random.randint(1, 4)
        
        # Sélectionner des produits aléatoires
        selected_produits = random.sample(produits, min(num_produits, len(produits)))
        
        # Ajouter des lignes de commande
        for produit in selected_produits:
            # Sélectionner un article correspondant au produit (s'il en existe)
            produit_articles = articles_by_produit.get(produit.id, [])
            article = random.choice(produit_articles) if produit_articles else None
            
            # Créer la ligne de commande
            LigneCommande.objects.create(
                commande=commande,
                produit=produit,
                article=article,
                quantite=random.randint(1, 3),
                prix_unitaire=produit.prix
            )
        
        created_commandes.append(commande)
        print(f"Commande créée: #{commande.id} pour {client}")
    
    return created_commandes

def populate_commandes():
    """Remplit la base de données avec des commandes."""
    try:
        with transaction.atomic():
            # Créer les commandes
            commandes = create_sample_commandes()
            
            if commandes:
                print(f"{len(commandes)} commandes créées avec succès !")
                
                return {"commandes": commandes}
            else:
                return None
    
    except Exception as e:
        print(f"Erreur lors de la création des commandes: {e}")
        return None

def main():
    """Fonction principale."""
    print("Insertion des commandes dans la base de données Yoozak")
    
    confirm = input("Êtes-vous sûr de vouloir insérer ces données ? (o/n): ")
    if confirm.lower() == "o":
        populate_commandes()
        print("Opération terminée !")
    else:
        print("Opération annulée.")

if __name__ == "__main__":
    main() 