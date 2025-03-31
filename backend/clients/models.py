from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User

class Client(models.Model):
    """Modèle pour les clients de l'application"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    nom = models.CharField(_("Nom"), max_length=255)
    prenom = models.CharField(_("Prénom"), max_length=255)
    phone = models.CharField(_("Téléphone"), max_length=20, blank=True, null=True, unique=True)
    genre = models.CharField(_("Genre"), max_length=50, blank=True, null=True)
    point_de_fidelite = models.IntegerField(_("Points de fidélité"), default=0)
    
    class Meta:
        verbose_name = _("Client")
        verbose_name_plural = _("Clients")
    
    def __str__(self):
        return f"{self.prenom} {self.nom}"

class Favoris(models.Model):
    """Modèle pour les produits favoris des clients"""
    client = models.ForeignKey(
        Client, 
        on_delete=models.CASCADE,
        related_name="favoris",
        verbose_name=_("Client")
    )
    produit = models.ForeignKey(
        'products.Produit',
        on_delete=models.CASCADE,
        related_name="favoris",
        verbose_name=_("Produit")
    )
    date_ajout = models.DateTimeField(_("Date d'ajout"), auto_now_add=True)
    
    class Meta:
        verbose_name = _("Favori")
        verbose_name_plural = _("Favoris")
        unique_together = ('client', 'produit')
    
    def __str__(self):
        return f"Favori de {self.client} - {self.produit.nom}"

class Avis(models.Model):
    """Modèle pour les avis des clients sur les produits"""
    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="avis",
        verbose_name=_("Client")
    )
    produit = models.ForeignKey(
        'products.Produit',
        on_delete=models.CASCADE,
        related_name="avis",
        verbose_name=_("Produit")
    )
    commentaire = models.TextField(_("Commentaire"), blank=True, null=True) # pour le commentaire du client sur le produit
    note = models.IntegerField(_("Note"), choices=[(i, i) for i in range(1, 6)]) # pour la note du client sur le produit car il ne peut pas noter un produit en dehors de 1 et 5
    date_creation = models.DateTimeField(_("Date de création"), auto_now_add=True) # pour la date de création de l'avis si le client veut un avis sur un produit
    
    class Meta:
        verbose_name = _("Avis")
        verbose_name_plural = _("Avis")
        unique_together = ('client', 'produit')
    
    def __str__(self):
        return f"Avis de {self.client} - {self.produit.nom} ({self.note}/5)" # pour afficher l'avis du client sur le produit car il ne peut pas noter un produit en dehors de 1 et 5
