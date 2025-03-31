
# Cette fichier serializers.py permet de gerer les serializers pour les données 
# car les données sont dans la base de données
#Serializer permet de convertir les données en format JSON ou XML ,il est utilisé pour les requetes http
# pour plus d'informations sur les serializers : https://www.django-rest-framework.org/api-guide/serializers/


from rest_framework import serializers # import du serializer de rest framework
from ..models import (
    Categories, SousCategories, Produit, Article,
    Creative, Promotion, Catalogue
)# import des models de la base de données

# Cette classe CategoriesSerializer permet de gerer les serializers pour les données 
# car les données sont dans la base de données
class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = '__all__'

# Cette classe SousCategoriesSerializer permet de gerer les serializers pour les données 
# car les données sont dans la base de données
class SousCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SousCategories
        fields = '__all__'

# Cette classe CreativeSerializer permet de gerer les serializers pour les données 
# car les données sont dans la base de données
class CreativeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Creative
        fields = '__all__'

# Cette classe ArticleSerializer permet de gerer les serializers pour les données 
# car les données sont dans la base de données
class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'

# Cette classe PromotionSerializer permet de gerer les serializers pour les données 
# car les données sont dans la base de données
class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = '__all__'

# Cette classe ProduitListSerializer permet de gerer les serializers pour les données 
# car les données sont dans la base de données
class ProduitListSerializer(serializers.ModelSerializer):
    """Serializer pour la liste des produits (version simplifiée)"""
    class Meta:
        model = Produit
        fields = ('id', 'nom', 'prix', 'origine', 'type_de_semelle')

# Cette classe ProduitDetailSerializer permet de gerer les serializers pour les données 
# car les données sont dans la base de données
class ProduitDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour un produit unique avec relations"""
    categories = CategoriesSerializer(many=True, read_only=True) # pour les categories le read_only=True permet de ne pas afficher les données des categories
    articles = ArticleSerializer(many=True, read_only=True) # pour les articles le read_only=True permet de ne pas afficher les données des articles
    creatives = CreativeSerializer(many=True, read_only=True) # pour les creatives le read_only=True permet de ne pas afficher les données des creatives
    promotions = PromotionSerializer(many=True, read_only=True) # pour les promotions le read_only=True permet de ne pas afficher les données des promotions
    
    # Cette classe Meta permet de gerer les serializers pour les données 
    # car les données sont dans la base de données et les champs sont dans la base de données
    class Meta:
        model = Produit
        fields = '__all__'

# Cette classe CatalogueListSerializer permet de gerer les serializers pour les données 
# car les données sont dans la base de données
class CatalogueListSerializer(serializers.ModelSerializer):
    """Serializer pour la liste des catalogues"""
    class Meta:
        model = Catalogue
        fields = ('id', 'nom', 'description', 'date_creation')

# Cette classe CatalogueDetailSerializer permet de gerer les serializers pour les données 
# car les données sont dans la base de données
class CatalogueDetailSerializer(serializers.ModelSerializer):
    """Serializer détaillé pour un catalogue avec ses produits"""
    produits = ProduitListSerializer(many=True, read_only=True) # pour les produits le read_only=True permet de ne pas afficher les données des produits
    
    # Cette classe Meta permet de gerer les serializers pour les données 
    # car les données sont dans la base de données et les champs sont dans la base de données
    class Meta:
        model = Catalogue
        fields = '__all__' 