from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import (
    EtatCommande, Commande, Panier, Retour, 
    Remise, CodePromo, LigneCommande
)

class LigneCommandeInline(admin.TabularInline):
    """Inline pour les lignes de commande"""
    model = LigneCommande
    extra = 0
    readonly_fields = ('prix_unitaire',)

class RemiseInline(admin.TabularInline):
    """Inline pour les remises"""
    model = Remise
    extra = 0

class CodePromoInline(admin.TabularInline):
    """Inline pour les codes promo utilisés"""
    model = CodePromo
    extra = 0
    readonly_fields = ('numero_promo', 'taux')
    fields = ('numero_promo', 'taux')

class RetourInline(admin.TabularInline):
    """Inline pour les retours"""
    model = Retour
    extra = 0

@admin.register(EtatCommande)
class EtatCommandeAdmin(admin.ModelAdmin):
    """Admin pour les états de commande"""
    list_display = ('libelle_etat',)
    search_fields = ('libelle_etat',)

@admin.register(Commande)
class CommandeAdmin(admin.ModelAdmin):
    """Admin pour les commandes"""
    list_display = ('id', 'client', 'date_commande', 'etat_commande', 'adresse', 'region')
    list_filter = ('etat_commande', 'date_commande')
    search_fields = ('client__nom', 'client__prenom', 'client__email', 'adresse', 'region')
    readonly_fields = ('date_creation', 'date_modification')
    inlines = [LigneCommandeInline, RemiseInline, CodePromoInline, RetourInline]
    
    fieldsets = (
        (None, {
            'fields': ('client', 'etat_commande', 'date_commande')
        }),
        (_('Livraison'), {
            'fields': ('adresse', 'region')
        }),
        (_('Informations système'), {
            'fields': ('date_creation', 'date_modification'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Panier)
class PanierAdmin(admin.ModelAdmin):
    """Admin pour les paniers"""
    list_display = ('client', 'produit', 'quantite', 'date_ajout')
    list_filter = ('date_ajout',)
    search_fields = ('client__nom', 'client__prenom', 'produit__nom')

@admin.register(Retour)
class RetourAdmin(admin.ModelAdmin):
    """Admin pour les retours"""
    list_display = ('commande', 'date_retour')
    list_filter = ('date_retour',)
    search_fields = ('commande__client__nom', 'commande__client__prenom', 'motif')

@admin.register(Remise)
class RemiseAdmin(admin.ModelAdmin):
    """Admin pour les remises"""
    list_display = ('commande', 'taux_de_reduction', 'date_creation')
    list_filter = ('date_creation',)
    search_fields = ('commande__client__nom', 'commande__client__prenom')

@admin.register(CodePromo)
class CodePromoAdmin(admin.ModelAdmin):
    """Admin pour les codes promo"""
    list_display = ('numero_promo', 'taux', 'est_actif', 'date_debut', 'date_fin', 'commande')
    list_filter = ('est_actif', 'date_debut', 'date_fin')
    search_fields = ('numero_promo',)

@admin.register(LigneCommande)
class LigneCommandeAdmin(admin.ModelAdmin):
    """Admin pour les lignes de commande"""
    list_display = ('commande', 'produit', 'article', 'quantite', 'prix_unitaire')
    list_filter = ('commande__date_commande',)
    search_fields = ('commande__client__nom', 'commande__client__prenom', 'produit__nom')
