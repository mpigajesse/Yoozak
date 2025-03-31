# ce fichier contient les vues pour l'api 
# il permet de gerer les requetes http et de gerer les données
# il permet de gerer les permissions , la pagination et le format de réponse
# pour plus d'informations sur les vues : https://www.django-rest-framework.org/api-guide/viewsets/


from rest_framework import viewsets, permissions, filters # pour les vues , les permissions , les filtres
from django_filters.rest_framework import DjangoFilterBackend # pour le filtrage des données
from ..models import (
    Categories, SousCategories, Produit, 
    Article, Creative, Promotion, Catalogue
) # pour les models  qui sont dans le fichier models.py 
from .serializers import (
    CategoriesSerializer, SousCategoriesSerializer,
    ProduitListSerializer, ProduitDetailSerializer,
    ArticleSerializer, CreativeSerializer, PromotionSerializer,
    CatalogueListSerializer, CatalogueDetailSerializer
) # pour les serializers qui sont dans le fichier serializers.py  , il permet de gerer les données et les formats de réponse 
# parce que les serializers sont utilisés pour convertir les données en format json


# Cette CategorieViewSet permet de gerer les requetes http pour les catégories 
class CategoriesViewSet(viewsets.ModelViewSet):
    """API pour gérer les catégories"""
    queryset = Categories.objects.all() # pour les données  car les données sont dans la base de données
    serializer_class = CategoriesSerializer # pour le serializer qui est dans le fichier serializers.py 
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # pour les permissions , il permet de gerer les permissions
    filter_backends = [filters.SearchFilter, DjangoFilterBackend] # pour le filtrage des données
    search_fields = ['nom'] # pour le filtrage des données

# Cette SousCategoriesViewSet permet de gerer les requetes http pour les sous-catégories
class SousCategoriesViewSet(viewsets.ModelViewSet):
    """API pour gérer les sous-catégories"""
    queryset = SousCategories.objects.all() # pour les données  car les données sont dans la base de données
    serializer_class = SousCategoriesSerializer # pour le serializer qui est dans le fichier serializers.py 
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # pour les permissions , il permet de gerer les permissions
    filter_backends = [filters.SearchFilter, DjangoFilterBackend] # pour le filtrage des données
    filterset_fields = ['categorie'] # pour le filtrage des données
    search_fields = ['nom'] # pour le filtrage des données


# Cette ProduitViewSet permet de gerer les requetes http pour les produits
class ProduitViewSet(viewsets.ModelViewSet):
    """API pour gérer les produits"""
    queryset = Produit.objects.all() # pour les données  car les données sont dans la base de données
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # pour les permissions , il permet de gerer les permissions
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter] # pour le filtrage des données
    filterset_fields = ['categories', 'origine', 'type_de_semelle'] # pour le filtrage des données
    search_fields = ['nom', 'description'] # pour le filtrage des données
    ordering_fields = ['prix', 'nom']
    
    # Cette fonction permet de gerer les formats de réponse  car il y a deux formats de réponse 
    #Notemmeent le format de réponse pour la liste et le format de réponse pour le détail
    def get_serializer_class(self):
        if self.action == 'list':
            return ProduitListSerializer
        return ProduitDetailSerializer


# Cette ArticleViewSet permet de gerer les requetes http pour les articles
class ArticleViewSet(viewsets.ModelViewSet):
    """API pour gérer les articles"""
    queryset = Article.objects.all() # pour les données  car les données sont dans la base de données
    serializer_class = ArticleSerializer # pour le serializer qui est dans le fichier serializers.py 
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # pour les permissions , il permet de gerer les permissions
    filter_backends = [filters.SearchFilter, DjangoFilterBackend] # pour le filtrage des données
    filterset_fields = ['produit', 'couleur', 'pointure'] # pour le filtrage des données
    search_fields = ['code_bar'] # pour le filtrage des données


# Cette CreativeViewSet permet de gerer les requetes http pour les médias des produits
class CreativeViewSet(viewsets.ModelViewSet):
    """API pour gérer les médias des produits"""
    queryset = Creative.objects.all() # pour les données  car les données sont dans la base de données
    serializer_class = CreativeSerializer # pour le serializer qui est dans le fichier serializers.py 
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # pour les permissions , il permet de gerer les permissions
    filter_backends = [DjangoFilterBackend] # pour le filtrage des données
    filterset_fields = ['produit', 'type_creative'] # pour le filtrage des données

class PromotionViewSet(viewsets.ModelViewSet):
    """API pour gérer les promotions"""
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer # pour le serializer qui est dans le fichier serializers.py 
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # pour les permissions , il permet de gerer les permissions
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter] # pour le filtrage des données
    filterset_fields = ['produit', 'type_promo'] # pour le filtrage des données
    ordering_fields = ['date_debut', 'date_fin', 'reduction'] # pour le filtrage des données


# Cette CatalogueViewSet permet de gerer les requetes http pour les catalogues
class CatalogueViewSet(viewsets.ModelViewSet):
    """API pour gérer les catalogues"""
    queryset = Catalogue.objects.all() # pour les données  car les données sont dans la base de données
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # pour les permissions , il permet de gerer les permissions
    filter_backends = [filters.SearchFilter] # pour le filtrage des données
    search_fields = ['nom', 'description'] # pour le filtrage des données
    
    # Cette fonction permet de gerer les formats de réponse  car il y a deux formats de réponse 
    #Notemmeent le format de réponse pour la liste et le format de réponse pour le détail
    def get_serializer_class(self):
        if self.action == 'list':
            return CatalogueListSerializer
        return CatalogueDetailSerializer 