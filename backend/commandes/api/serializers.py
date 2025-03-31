from rest_framework import serializers
from ..models import (
    EtatCommande, Commande, Panier, Retour, 
    Remise, CodePromo, LigneCommande
)
from clients.api.serializers import ClientSerializer
from products.api.serializers import ProduitListSerializer

class EtatCommandeSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle EtatCommande"""
    class Meta:
        model = EtatCommande
        fields = '__all__'

class LigneCommandeSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle LigneCommande"""
    produit_detail = ProduitListSerializer(source='produit', read_only=True)
    
    class Meta:
        model = LigneCommande
        fields = ('id', 'commande', 'produit', 'produit_detail', 'article', 'quantite', 'prix_unitaire')
        read_only_fields = ('id', 'prix_unitaire')

class RemiseSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Remise"""
    class Meta:
        model = Remise
        fields = ('id', 'commande', 'taux_de_reduction', 'date_creation')
        read_only_fields = ('id', 'date_creation')

class CodePromoSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle CodePromo"""
    class Meta:
        model = CodePromo
        fields = ('id', 'numero_promo', 'taux', 'commande', 'date_debut', 'date_fin', 'est_actif')
        read_only_fields = ('id',)

class RetourSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Retour"""
    class Meta:
        model = Retour
        fields = ('id', 'commande', 'motif', 'date_retour', 'date_creation')
        read_only_fields = ('id', 'date_creation', 'date_retour')

class CommandeListSerializer(serializers.ModelSerializer):
    """Serializer pour la liste des commandes"""
    client_nom = serializers.CharField(source='client.nom', read_only=True)
    client_prenom = serializers.CharField(source='client.prenom', read_only=True)
    etat = serializers.CharField(source='etat_commande.libelle_etat', read_only=True)
    
    class Meta:
        model = Commande
        fields = ('id', 'client', 'client_nom', 'client_prenom', 'date_commande', 'etat_commande', 'etat', 'adresse', 'region')
        read_only_fields = ('id', 'date_commande')

class CommandeDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour une commande avec ses relations"""
    client = ClientSerializer(read_only=True)
    etat_commande = EtatCommandeSerializer(read_only=True)
    lignes = LigneCommandeSerializer(many=True, read_only=True)
    remises = RemiseSerializer(many=True, read_only=True)
    codes_promo = CodePromoSerializer(many=True, read_only=True)
    retours = RetourSerializer(many=True, read_only=True)
    
    class Meta:
        model = Commande
        fields = (
            'id', 'client', 'date_commande', 'adresse', 'region', 
            'etat_commande', 'date_creation', 'date_modification',
            'lignes', 'remises', 'codes_promo', 'retours'
        )
        read_only_fields = ('id', 'date_commande', 'date_creation', 'date_modification')

class CommandeCreateSerializer(serializers.ModelSerializer):
    """Serializer pour la création d'une commande"""
    lignes = LigneCommandeSerializer(many=True, required=False)
    
    class Meta:
        model = Commande
        fields = ('id', 'client', 'adresse', 'region', 'etat_commande', 'lignes')
        read_only_fields = ('id',)
    
    def create(self, validated_data):
        lignes_data = validated_data.pop('lignes', [])
        commande = Commande.objects.create(**validated_data)
        
        for ligne_data in lignes_data:
            LigneCommande.objects.create(commande=commande, **ligne_data)
            
        return commande

class PanierSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Panier"""
    produit_detail = ProduitListSerializer(source='produit', read_only=True)
    
    class Meta:
        model = Panier
        fields = ('id', 'client', 'produit', 'produit_detail', 'quantite', 'date_ajout')
        read_only_fields = ('id', 'date_ajout') 