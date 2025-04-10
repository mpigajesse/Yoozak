from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import Client, Favoris, Avis

class CustomUserAdmin(UserAdmin):
    """Admin personnalisé pour le modèle Client"""
    model = Client
    list_display = ('email', 'nom', 'prenom', 'phone', 'point_de_fidelite', 'is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff', 'genre')
    search_fields = ('email', 'nom', 'prenom', 'phone')
    ordering = ('email',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Informations personnelles'), {'fields': ('nom', 'prenom', 'phone', 'genre')}),
        (_('Fidélité'), {'fields': ('point_de_fidelite',)}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Dates importantes'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nom', 'prenom', 'password1', 'password2', 'is_active', 'is_staff'),
        }),
    )

class ClientAdmin(admin.ModelAdmin):
    """Admin pour le modèle Client"""
    list_display = ('nom', 'prenom', 'phone', 'point_de_fidelite', 'get_email', 'nombre_commandes')
    search_fields = ('nom', 'prenom', 'phone', 'user__email')
    list_filter = ('genre', 'point_de_fidelite')
    fieldsets = (
        (None, {
            'fields': (('nom', 'prenom'), 'user', 'genre')
        }),
        (_('Contact'), {
            'fields': ('phone',)
        }),
        (_('Fidélité'), {
            'fields': ('point_de_fidelite',)
        }),
    )
    
    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = _("Email")
    get_email.admin_order_field = 'user__email'
    
    def nombre_commandes(self, obj):
        """Affiche le nombre de commandes du client"""
        return obj.commandes.count()
    nombre_commandes.short_description = _("Commandes")
    
    def get_queryset(self, request):
        """Optimise les requêtes en préchargeant les relations"""
        queryset = super().get_queryset(request)
        return queryset.select_related('user').prefetch_related('commandes')

class FavorisAdmin(admin.ModelAdmin):
    """Admin pour le modèle Favoris"""
    list_display = ('client', 'produit', 'date_ajout', 'prix_produit')
    list_filter = ('client', 'date_ajout')
    search_fields = ('client__nom', 'client__prenom', 'produit__nom')
    readonly_fields = ('prix_produit',)
    autocomplete_fields = ['client', 'produit']
    
    def prix_produit(self, obj):
        """Retourne le prix du produit favori"""
        return obj.produit.prix
    prix_produit.short_description = _("Prix")
    
    def get_queryset(self, request):
        """Optimise les requêtes en préchargeant les relations"""
        queryset = super().get_queryset(request)
        return queryset.select_related('client', 'produit')

class AvisAdmin(admin.ModelAdmin):
    """Admin pour le modèle Avis"""
    list_display = ('client', 'produit', 'note', 'apercu_commentaire', 'date_creation')
    list_filter = ('note', 'date_creation')
    search_fields = ('client__nom', 'client__prenom', 'produit__nom', 'commentaire')
    readonly_fields = ('date_creation',)
    
    def apercu_commentaire(self, obj):
        """Affiche un aperçu du commentaire"""
        if obj.commentaire:
            if len(obj.commentaire) > 50:
                return f"{obj.commentaire[:50]}..."
            return obj.commentaire
        return "-"
    apercu_commentaire.short_description = _("Commentaire")
    
    def get_queryset(self, request):
        """Optimise les requêtes en préchargeant les relations"""
        queryset = super().get_queryset(request)
        return queryset.select_related('client', 'produit')

# Enregistrement des modèles dans l'admin
admin.site.register(Client, ClientAdmin)
admin.site.register(Favoris, FavorisAdmin)
admin.site.register(Avis, AvisAdmin)
