from django.db import models
from django.utils.translation import gettext_lazy as _
# JSONField fait maintenant partie de models dans Django 3.1+

class Categories(models.Model):
    """Modèle pour les catégories principales de produits"""
    nom = models.CharField(_("Nom"), max_length=255)
    description = models.TextField(_("Description"), blank=True, null=True)
    
    class Meta:
        verbose_name = _("Catégorie")
        verbose_name_plural = _("Catégories")
        
    def __str__(self):
        return self.nom

class SousCategories(models.Model):
    """Modèle pour les sous-catégories de produits"""
    nom = models.CharField(_("Nom"), max_length=255)
    description = models.TextField(_("Description"), blank=True, null=True)
    categorie = models.ForeignKey(
        Categories, 
        on_delete=models.CASCADE, 
        related_name="sous_categories",
        verbose_name=_("Catégorie parente")
    )
    
    class Meta:
        verbose_name = _("Sous-catégorie")
        verbose_name_plural = _("Sous-catégories")
        
    def __str__(self):
        return f"{self.nom} ({self.categorie.nom})"

class Produit(models.Model):
    """Modèle pour les produits (chaussures)"""
    nom = models.CharField(_("Nom"), max_length=100)
    prix = models.DecimalField(_("Prix"), max_digits=10, decimal_places=2)
    description = models.TextField(_("Description"), blank=True, null=True)
    type_de_semelle = models.CharField(_("Type de semelle"), max_length=255, blank=True, null=True)
    matieres_premieres = models.JSONField(_("Matières premières"), blank=True, null=True)
    origine = models.CharField(_("Origine"), max_length=255, blank=True, null=True)
    categories = models.ManyToManyField(
        Categories, 
        through='ProduitCategorie',
        related_name="produits",
        verbose_name=_("Catégories")
    )
    
    class Meta:
        verbose_name = _("Produit")
        verbose_name_plural = _("Produits")
        
    def __str__(self):
        return self.nom

class ProduitCategorie(models.Model):
    """Table intermédiaire pour la relation Many-to-Many entre Produit et Catégorie"""
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE)
    categorie = models.ForeignKey(Categories, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('produit', 'categorie')
        verbose_name = _("Produit - Catégorie")
        verbose_name_plural = _("Produits - Catégories")
    
    def __str__(self):
        return f"{self.produit.nom} - {self.categorie.nom}"

class Article(models.Model):
    """Modèle pour les articles (instances spécifiques de produits)"""
    produit = models.ForeignKey(
        Produit, 
        on_delete=models.CASCADE, 
        related_name="articles",
        verbose_name=_("Produit")
    )
    couleur = models.CharField(_("Couleur"), max_length=50, blank=True, null=True)
    pointure = models.CharField(_("Pointure"), max_length=10, blank=True, null=True)
    code_bar = models.CharField(_("Code-barres"), max_length=50, unique=True)
    date_achat = models.DateField(_("Date d'achat"), blank=True, null=True)
    
    class Meta:
        verbose_name = _("Article")
        verbose_name_plural = _("Articles")
        
    def __str__(self):
        return f"{self.produit.nom} - {self.couleur} - {self.pointure}"

class Creative(models.Model):
    """Modèle pour les médias associés aux produits"""
    produit = models.ForeignKey(
        Produit, 
        on_delete=models.CASCADE, 
        related_name="creatives",
        verbose_name=_("Produit")
    )
    type_creative = models.CharField(_("Type"), max_length=255, blank=True, null=True)
    url = models.URLField(_("URL"), max_length=255)
    
    class Meta:
        verbose_name = "Creative"
        verbose_name_plural = "Creatives"
        
    def __str__(self):
        return f"{self.type_creative} - {self.produit.nom}"

class Promotion(models.Model):
    """Modèle pour les promotions sur les produits"""
    produit = models.ForeignKey(
        Produit, 
        on_delete=models.CASCADE, 
        related_name="promotions",
        verbose_name=_("Produit")
    )
    type_promo = models.CharField(_("Type de promotion"), max_length=255)
    reduction = models.DecimalField(_("Réduction"), max_digits=5, decimal_places=2)
    date_debut = models.DateField(_("Date de début"))
    date_fin = models.DateField(_("Date de fin"))
    
    class Meta:
        verbose_name = _("Promotion")
        verbose_name_plural = _("Promotions")
        
    def __str__(self):
        return f"{self.type_promo} - {self.produit.nom} ({self.reduction}%)"

class Catalogue(models.Model):
    """Modèle pour les catalogues de produits"""
    nom = models.CharField(_("Nom"), max_length=255)
    description = models.TextField(_("Description"), blank=True, null=True)
    date_creation = models.DateField(_("Date de création"), auto_now_add=True)
    produits = models.ManyToManyField(
        Produit,
        through='ProduitCatalogue',
        related_name="catalogues",
        verbose_name=_("Produits")
    )
    
    class Meta:
        verbose_name = _("Catalogue")
        verbose_name_plural = _("Catalogues")
        
    def __str__(self):
        return self.nom

class ProduitCatalogue(models.Model):
    """Table intermédiaire pour la relation Many-to-Many entre Produit et Catalogue"""
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE)
    catalogue = models.ForeignKey(Catalogue, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('produit', 'catalogue')
        verbose_name = _("Produit - Catalogue")
        verbose_name_plural = _("Produits - Catalogues")
    
    def __str__(self):
        return f"{self.produit.nom} - {self.catalogue.nom}"
