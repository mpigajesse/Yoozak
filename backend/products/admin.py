from django.contrib import admin
from .models import (
    Categories, SousCategories, Produit, Article, 
    Creative, Promotion, Catalogue, ProduitCategorie, ProduitCatalogue
)

@admin.register(Categories)
class CategoriesAdmin(admin.ModelAdmin):
    list_display = ('nom', 'description')
    search_fields = ('nom',)

@admin.register(SousCategories)
class SousCategoriesAdmin(admin.ModelAdmin):
    list_display = ('nom', 'categorie', 'description')
    list_filter = ('categorie',)
    search_fields = ('nom',)

class ArticleInline(admin.TabularInline):
    model = Article
    extra = 1

class CreativeInline(admin.TabularInline):
    model = Creative
    extra = 1

class PromotionInline(admin.TabularInline):
    model = Promotion
    extra = 0

class ProduitCategorieInline(admin.TabularInline):
    model = ProduitCategorie
    extra = 1
    autocomplete_fields = ['categorie']

class ProduitCatalogueInline(admin.TabularInline):
    model = ProduitCatalogue
    extra = 1

@admin.register(Produit)
class ProduitAdmin(admin.ModelAdmin):
    list_display = ('nom', 'prix', 'origine', 'type_de_semelle')
    list_filter = ('origine',)
    search_fields = ('nom', 'description')
    inlines = [ProduitCategorieInline, ArticleInline, CreativeInline, PromotionInline]

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('produit', 'couleur', 'pointure', 'code_bar', 'date_achat')
    list_filter = ('produit', 'couleur', 'pointure')
    search_fields = ('code_bar', 'produit__nom')

@admin.register(Creative)
class CreativeAdmin(admin.ModelAdmin):
    list_display = ('produit', 'type_creative', 'url')
    list_filter = ('type_creative', 'produit')
    search_fields = ('produit__nom',)

@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ('produit', 'type_promo', 'reduction', 'date_debut', 'date_fin')
    list_filter = ('type_promo', 'date_debut', 'date_fin')
    search_fields = ('produit__nom', 'type_promo')

@admin.register(Catalogue)
class CatalogueAdmin(admin.ModelAdmin):
    list_display = ('nom', 'description', 'date_creation')
    search_fields = ('nom',)
    inlines = [ProduitCatalogueInline]
