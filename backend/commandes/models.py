
# Cette fichier models.py permet de gerer les models pour les commandes
#les mots clés tels que :
#versbose_name : pour le nom de la classe , permet de gerer le nom de la classe dans l'admin django
#verbose_name_plural : pour le nom de la classe au pluriel , permet de gerer le nom de la classe dans l'admin django
#ordering : pour l'ordre de tri des données , permet de gerer l'ordre de tri des données dans l'admin django
#unique_together : pour les champs uniques , permet de gerer les champs uniques dans l'admin django
#related_name : pour le nom de la relation inverse , permet de gerer le nom de la relation inverse dans l'admin django

# related_name : pour le nom de la relation inverse , permet de gerer le nom de la relation inverse dans l'admin django
# pour plus d'informations sur les relations : https://docs.djangoproject.com/en/4.2/topics/db/models/#relations

from django.db import models
from django.utils.translation import gettext_lazy as _ # pour les traductions de textes car on a des textes dans les models

# Cette classe EtatCommande permet de gerer les états possibles d'une commande
class EtatCommande(models.Model):
    """Modèle pour les états possibles d'une commande"""
    libelle_etat = models.CharField(_("Libellé"), max_length=255)
    
    
    class Meta:
        verbose_name = _("État de commande")
        verbose_name_plural = _("États de commande")
    
    def __str__(self):
        return self.libelle_etat # pour afficher le libellé de l'état de commande

# Cette classe Commande permet de gerer les commandes des clients
#car les commandes sont dans la base de données 
class Commande(models.Model):
    """Modèle pour les commandes des clients"""
    client = models.ForeignKey( 
        'clients.Client',
        on_delete=models.CASCADE,
        related_name="commandes",
        verbose_name=_("Client")
    )
    date_commande = models.DateField(_("Date de commande"), auto_now_add=True)
    adresse = models.CharField(_("Adresse de livraison"), max_length=255, blank=True, null=True)
    region = models.CharField(_("Région"), max_length=255, blank=True, null=True)
    etat_commande = models.ForeignKey(
        EtatCommande,
        on_delete=models.SET_NULL,
        null=True,
        related_name="commandes",
        verbose_name=_("État")
    )
    date_creation = models.DateTimeField(_("Date de création"), auto_now_add=True)
    date_modification = models.DateTimeField(_("Date de modification"), auto_now=True)
    
    # Cette classe Meta permet de gerer les métadonnées de la classe Commande
    class Meta:
        verbose_name = _("Commande")
        verbose_name_plural = _("Commandes")
        ordering = ['-date_creation']
    
    def __str__(self):
        return f"Commande #{self.id} - {self.client}"

class Panier(models.Model):
    """Modèle pour les paniers temporaires des clients"""
    client = models.ForeignKey(
        'clients.Client',
        on_delete=models.CASCADE,
        related_name="paniers",
        verbose_name=_("Client")
    )
    produit = models.ForeignKey(
        'products.Produit',
        on_delete=models.CASCADE,
        related_name="paniers",
        verbose_name=_("Produit")
    )
    quantite = models.PositiveIntegerField(_("Quantité"), default=1)
    date_ajout = models.DateTimeField(_("Date d'ajout"), auto_now_add=True)
    
    class Meta:
        verbose_name = _("Panier")
        verbose_name_plural = _("Paniers")
        unique_together = ('client', 'produit')
    
    def __str__(self):
        return f"Panier de {self.client} - {self.produit.nom} (x{self.quantite})"

class Retour(models.Model):
    """Modèle pour les retours de commandes"""
    commande = models.ForeignKey(
        Commande,
        on_delete=models.CASCADE,
        related_name="retours",
        verbose_name=_("Commande")
    )
    motif = models.TextField(_("Motif du retour"), blank=True, null=True) # pour le motif du retour si le client veut retourner un produit
    date_retour = models.DateField(_("Date du retour"), auto_now_add=True) # pour la date du retour si le client veut retourner un produit
    date_creation = models.DateTimeField(_("Date de création"), auto_now_add=True) # pour la date de création du retour si le client veut retourner un produit
    
    class Meta:
        verbose_name = _("Retour")
        verbose_name_plural = _("Retours")
    
    def __str__(self):
        return f"Retour de la commande #{self.commande.id}"

class Remise(models.Model):
    """Modèle pour les remises appliquées aux commandes"""
    commande = models.ForeignKey(
        Commande,
        on_delete=models.CASCADE,
        related_name="remises",
        verbose_name=_("Commande")
    )
    taux_de_reduction = models.DecimalField(_("Taux de réduction"), max_digits=5, decimal_places=2) # pour le taux de réduction si le client veut une remise sur sa commande
    date_creation = models.DateTimeField(_("Date de création"), auto_now_add=True) # pour la date de création de la remise si le client veut une remise sur sa commande
    
    class Meta:
        verbose_name = _("Remise")
        verbose_name_plural = _("Remises")
    
    def __str__(self):
        return f"Remise de {self.taux_de_reduction}% sur la commande #{self.commande.id}"

class CodePromo(models.Model):
    """Modèle pour les codes promotionnels"""
    numero_promo = models.CharField(_("Code promo"), max_length=50, unique=True) # pour le code promo si le client veut une remise sur sa commande
    taux = models.DecimalField(_("Taux de réduction"), max_digits=5, decimal_places=2) # pour le taux de réduction si le client veut une remise sur sa commande
    commande = models.ForeignKey(
        Commande,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="codes_promo",
        verbose_name=_("Commande")
    )
    date_debut = models.DateField(_("Date de début"), null=True, blank=True) # pour la date de début de la promo si le client veut une remise sur sa commande   
    date_fin = models.DateField(_("Date de fin"), null=True, blank=True) # pour la date de fin de la promo si le client veut une remise sur sa commande
    est_actif = models.BooleanField(_("Est actif"), default=True) # pour savoir si la promo est active si le client veut une remise sur sa commande
    
    class Meta:
        verbose_name = _("Code promo")
        verbose_name_plural = _("Codes promo")
    
    def __str__(self):
        return f"Code {self.numero_promo} - {self.taux}%"

class LigneCommande(models.Model):
    """Modèle pour les lignes de commande (produits commandés)"""
    commande = models.ForeignKey(
        Commande,
        on_delete=models.CASCADE,
        related_name="lignes",
        verbose_name=_("Commande")
    )
    produit = models.ForeignKey(
        'products.Produit',
        on_delete=models.CASCADE,
        related_name="lignes_commande",
        verbose_name=_("Produit")
    )
    article = models.ForeignKey(
        'products.Article',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="lignes_commande",
        verbose_name=_("Article")
    )
    quantite = models.PositiveIntegerField(_("Quantité"), default=1) # pour la quantité du produit commandé si le client veut une remise sur sa commande , par défaut 1 parce que le client ne peut pas acheter 0 produit
    prix_unitaire = models.DecimalField(_("Prix unitaire"), max_digits=10, decimal_places=2) # pour le prix unitaire du produit commandé si le client veut une remise sur sa commande , max_digits=10, decimal_places=2 parce que le prix unitaire est un nombre à virgule et le client ne peut pas acheter un produit à un prix négatif
    
    class Meta:
        verbose_name = _("Ligne de commande")
        verbose_name_plural = _("Lignes de commande")
    
    def __str__(self):
        return f"Ligne {self.produit.nom} (x{self.quantite}) - Commande #{self.commande.id}"
