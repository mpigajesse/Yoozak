#!/usr/bin/env python
"""
Script pour initialiser les données d'organisation (pôles, services, équipes)
dans la base de données Yoozak.

Usage:
    python manage.py runscript init_organisation

Dépendance:
    django-extensions (déjà installé)
"""

import os
import sys
import django
from django.contrib.auth.models import User
from django.db import transaction

def run():
    """
    Fonction principale exécutée lors de l'exécution du script.
    Initialise les données d'organisation de base.
    """
    from users.models import Pole, Service, Team, UserProfile, UserRole

    # Vérifie si les données existent déjà
    if Pole.objects.exists():
        print("Des données d'organisation existent déjà dans la base de données.")
        confirm = input("Voulez-vous réinitialiser les données d'organisation ? (o/n): ")
        if confirm.lower() != 'o':
            print("Opération annulée.")
            return

    try:
        with transaction.atomic():
            # Supprimer les données existantes
            UserRole.objects.all().delete()
            Team.objects.all().delete()
            Service.objects.all().delete()
            Pole.objects.all().delete()
            
            print("Création des pôles...")
            # Création des pôles
            poles = {
                'CLIENTS': Pole.objects.create(
                    nom="Clients",
                    code="CLIENTS",
                    description="Gestion de la relation client et support"
                ),
                'COMMANDES': Pole.objects.create(
                    nom="Commandes",
                    code="COMMANDES",
                    description="Gestion des commandes et livraisons"
                ),
                'PRODUCTS': Pole.objects.create(
                    nom="Produits",
                    code="PRODUCTS",
                    description="Gestion du catalogue et des produits"
                )
            }
            
            print("Création des services...")
            # Création des services pour chaque pôle
            services = {}
            
            # Services du pôle CLIENTS
            services['support_client'] = Service.objects.create(
                nom="Support Client",
                description="Service d'assistance aux clients",
                pole=poles['CLIENTS']
            )
            services['marketing'] = Service.objects.create(
                nom="Marketing",
                description="Service de marketing et relation client",
                pole=poles['CLIENTS']
            )
            
            # Services du pôle COMMANDES
            services['facturation'] = Service.objects.create(
                nom="Facturation",
                description="Service de facturation des commandes",
                pole=poles['COMMANDES']
            )
            services['livraison'] = Service.objects.create(
                nom="Livraison",
                description="Service de livraison et expédition",
                pole=poles['COMMANDES']
            )
            services['suivi'] = Service.objects.create(
                nom="Suivi",
                description="Service de suivi des commandes",
                pole=poles['COMMANDES']
            )
            
            # Services du pôle PRODUCTS
            services['catalogues'] = Service.objects.create(
                nom="Catalogues",
                description="Gestion des catalogues de produits",
                pole=poles['PRODUCTS']
            )
            services['inventaire'] = Service.objects.create(
                nom="Inventaire",
                description="Gestion des stocks et inventaires",
                pole=poles['PRODUCTS']
            )
            
            print("Création des équipes...")
            # Création des équipes pour certains services
            teams = {}
            
            # Équipes du service Support Client
            teams['support_niveau1'] = Team.objects.create(
                nom="Équipe Support Niveau 1",
                description="Équipe de support client de premier niveau",
                service=services['support_client']
            )
            teams['support_niveau2'] = Team.objects.create(
                nom="Équipe Support Niveau 2",
                description="Équipe de support client de second niveau",
                service=services['support_client']
            )
            
            # Équipes du service Catalogues
            teams['catalogue_fr'] = Team.objects.create(
                nom="Équipe Catalogue France",
                description="Équipe en charge du catalogue français",
                service=services['catalogues']
            )
            
            teams['catalogue_int'] = Team.objects.create(
                nom="Équipe Catalogue International",
                description="Équipe en charge des catalogues internationaux",
                service=services['catalogues']
            )

            # Équipes du service Livraison
            teams['livraison_nat'] = Team.objects.create(
                nom="Équipe Logistique Nationale",
                description="Équipe en charge des livraisons nationales",
                service=services['livraison']
            )
            teams['livraison_int'] = Team.objects.create(
                nom="Équipe Logistique Internationale",
                description="Équipe en charge des livraisons internationales",
                service=services['livraison']
            )
            
            print("Création d'utilisateurs par défaut (si nécessaire)...")
            # Créer un super utilisateur s'il n'en existe pas
            if not User.objects.filter(is_superuser=True).exists():
                admin_user = User.objects.create_superuser(
                    username="admin",
                    email="admin@yoozak.com",
                    password="yoozak2024",
                    first_name="Admin",
                    last_name="Système"
                )
                
                # Créer un profil pour l'administrateur
                UserProfile.objects.create(
                    user=admin_user,
                    matricule="MAT001",
                    poste="Administrateur Système"
                )
                
                # Attribuer le rôle SUPERADMIN
                UserRole.objects.create(
                    user=admin_user,
                    role=UserRole.ROLE_SUPERADMIN
                )
                
                print(f"Super utilisateur créé : {admin_user.username} (mot de passe: yoozak2024)")
            
            # Créer des responsables pour chaque pôle
            for pole_code, pole in poles.items():
                username = f"dir_{pole_code.lower()}"
                if not User.objects.filter(username=username).exists():
                    user = User.objects.create_user(
                        username=username,
                        email=f"{username}@yoozak.com",
                        password="yoozak2024",
                        first_name=f"Directeur",
                        last_name=f"{pole.nom}",
                        is_staff=True
                    )
                    
                    # Créer un profil
                    UserProfile.objects.create(
                        user=user,
                        matricule=f"MAT{1000+user.id}",
                        poste=f"Directeur {pole.nom}"
                    )
                    
                    # Attribuer comme responsable du pôle
                    pole.responsable = user
                    pole.save()
                    
                    # Attribuer le rôle correspondant
                    role_name = f"DIRECTEUR_{pole_code}"
                    if hasattr(UserRole, f"ROLE_{role_name}"):
                        role = getattr(UserRole, f"ROLE_{role_name}")
                        UserRole.objects.create(
                            user=user,
                            role=role,
                            pole=pole
                        )
                    
                    print(f"Directeur créé pour le pôle {pole.nom}: {username} (mot de passe: yoozak2024)")
            
            print("Initialisation des données d'organisation terminée avec succès!")
            
    except Exception as e:
        print(f"Une erreur s'est produite lors de l'initialisation des données : {e}")
        raise

if __name__ == "__main__":
    # Permet l'exécution directe du script
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()
    run() 