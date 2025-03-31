from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import (
    EtatCommande, Commande, Panier, Retour, 
    Remise, CodePromo, LigneCommande
)
from django.contrib import messages

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
    list_display = ('client', 'produit', 'quantite', 'date_ajout', 'prix_total')
    list_filter = ('date_ajout', 'client')
    search_fields = ('client__nom', 'client__prenom', 'produit__nom')
    readonly_fields = ('prix_total',)
    actions = ['convertir_en_commande']
    
    def prix_total(self, obj):
        """Calcule le prix total du panier"""
        return obj.produit.prix * obj.quantite
    prix_total.short_description = _("Prix total")
    
    def convertir_en_commande(self, request, queryset):
        """Action pour convertir des paniers en commande"""
        # Regrouper les produits par client
        paniers_par_client = {}
        for panier in queryset:
            if panier.client not in paniers_par_client:
                paniers_par_client[panier.client] = []
            paniers_par_client[panier.client].append(panier)
        
        # Créer une commande pour chaque client
        commandes_creees = 0
        for client, paniers in paniers_par_client.items():
            # Obtenir l'état "En attente" ou créer si inexistant
            etat_en_attente, _ = EtatCommande.objects.get_or_create(
                libelle_etat=_("En attente"),
                defaults={'libelle_etat': _("En attente")}
            )
            
            # Créer la commande
            commande = Commande.objects.create(
                client=client,
                etat_commande=etat_en_attente
            )
            
            # Ajouter les produits du panier comme lignes de commande
            for panier in paniers:
                LigneCommande.objects.create(
                    commande=commande,
                    produit=panier.produit,
                    quantite=panier.quantite,
                    prix_unitaire=panier.produit.prix
                )
            
            commandes_creees += 1
        
        # Message de succès
        if commandes_creees > 0:
            self.message_user(
                request,
                _("%(count)d commande(s) créée(s) avec succès.") % {'count': commandes_creees},
                messages.SUCCESS
            )
        
        # Supprimer les paniers traités
        queryset.delete()
    
    convertir_en_commande.short_description = _("Convertir en commande")
    
    def get_queryset(self, request):
        """Optimise les requêtes en préchargeant les relations"""
        queryset = super().get_queryset(request)
        return queryset.select_related('client', 'produit')

@admin.register(Retour)
class RetourAdmin(admin.ModelAdmin):
    """Admin pour les retours"""
    list_display = ('commande', 'date_retour')
    list_filter = ('date_retour',)
    search_fields = ('commande__client__nom', 'commande__client__prenom', 'motif')

@admin.register(Remise)
class RemiseAdmin(admin.ModelAdmin):
    """Admin pour les remises"""
    list_display = ('commande', 'taux_de_reduction', 'montant_economise', 'date_creation')
    list_filter = ('date_creation', 'taux_de_reduction')
    search_fields = ('commande__client__nom', 'commande__client__prenom')
    readonly_fields = ('montant_economise',)
    
    def montant_economise(self, obj):
        """Calcule le montant économisé grâce à la remise"""
        total_commande = sum(ligne.prix_unitaire * ligne.quantite for ligne in obj.commande.lignes.all())
        return (total_commande * obj.taux_de_reduction) / 100
    montant_economise.short_description = _("Montant économisé")

@admin.register(CodePromo)
class CodePromoAdmin(admin.ModelAdmin):
    """Admin pour les codes promo"""
    list_display = ('numero_promo', 'taux', 'est_actif', 'date_debut', 'date_fin', 'commande', 'statut')
    list_filter = ('est_actif', 'date_debut', 'date_fin')
    search_fields = ('numero_promo',)
    readonly_fields = ('statut',)
    actions = ['activer_codes', 'desactiver_codes']
    
    def statut(self, obj):
        """Détermine le statut actuel du code promo"""
        from django.utils import timezone
        today = timezone.now().date()
        
        if not obj.est_actif:
            return _("Désactivé")
        elif obj.date_debut and obj.date_debut > today:
            return _("Pas encore actif")
        elif obj.date_fin and obj.date_fin < today:
            return _("Expiré")
        else:
            return _("Actif")
    statut.short_description = _("Statut")
    
    def activer_codes(self, request, queryset):
        """Action pour activer plusieurs codes promo"""
        queryset.update(est_actif=True)
        self.message_user(request, _("Les codes promo sélectionnés ont été activés."), messages.SUCCESS)
    activer_codes.short_description = _("Activer les codes promo sélectionnés")
    
    def desactiver_codes(self, request, queryset):
        """Action pour désactiver plusieurs codes promo"""
        queryset.update(est_actif=False)
        self.message_user(request, _("Les codes promo sélectionnés ont été désactivés."), messages.SUCCESS)
    desactiver_codes.short_description = _("Désactiver les codes promo sélectionnés")

@admin.register(LigneCommande)
class LigneCommandeAdmin(admin.ModelAdmin):
    """Admin pour les lignes de commande"""
    list_display = ('commande', 'produit', 'article', 'quantite', 'prix_unitaire', 'total')
    list_filter = ('commande__date_commande', 'commande__etat_commande')
    search_fields = ('commande__client__nom', 'commande__client__prenom', 'produit__nom')
    readonly_fields = ('total',)
    
    def total(self, obj):
        """Calcule le total pour cette ligne de commande"""
        return obj.prix_unitaire * obj.quantite
    total.short_description = _("Total")
    
    def get_queryset(self, request):
        """Optimise les requêtes en préchargeant les relations"""
        queryset = super().get_queryset(request)
        return queryset.select_related('commande', 'produit', 'article')
