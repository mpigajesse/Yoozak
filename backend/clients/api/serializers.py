from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import Client, Favoris, Avis
from products.api.serializers import ProduitListSerializer

class UserSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle User"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)

class ClientSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Client"""
    user = UserSerializer(read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Client
        fields = ('id', 'user', 'nom', 'prenom', 'email', 'phone', 'genre', 'point_de_fidelite')
        read_only_fields = ('id', 'point_de_fidelite')

class ClientCreateSerializer(serializers.ModelSerializer):
    """Serializer pour la création d'un client avec son utilisateur"""
    email = serializers.EmailField(write_only=True)
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    class Meta:
        model = Client
        fields = ('id', 'nom', 'prenom', 'email', 'username', 'password', 'phone', 'genre')
        read_only_fields = ('id',)
    
    def create(self, validated_data):
        # Extraction des données pour l'utilisateur
        user_data = {
            'username': validated_data.pop('username'),
            'email': validated_data.pop('email'),
            'password': validated_data.pop('password'),
            'first_name': validated_data.get('prenom', ''),
            'last_name': validated_data.get('nom', '')
        }
        
        # Création de l'utilisateur
        user = User.objects.create_user(**user_data)
        
        # Création du client
        client = Client.objects.create(user=user, **validated_data)
        return client

class FavorisSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Favoris"""
    produit_detail = ProduitListSerializer(source='produit', read_only=True)
    
    class Meta:
        model = Favoris
        fields = ('id', 'client', 'produit', 'produit_detail')
        read_only_fields = ('id',)

class AvisSerializer(serializers.ModelSerializer):
    """Serializer pour le modèle Avis"""
    client_nom = serializers.CharField(source='client.nom', read_only=True)
    client_prenom = serializers.CharField(source='client.prenom', read_only=True)
    produit_nom = serializers.CharField(source='produit.nom', read_only=True)
    
    class Meta:
        model = Avis
        fields = ('id', 'client', 'client_nom', 'client_prenom', 'produit', 'produit_nom', 'commentaire', 'note', 'date_creation')
        read_only_fields = ('id', 'date_creation') 