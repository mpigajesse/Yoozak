from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

class BaseModel(models.Model):
    """Modèle de base avec champs communs"""
    date_creation = models.DateTimeField(_("Date de création"), auto_now_add=True)
    date_modification = models.DateTimeField(_("Date de modification"), auto_now=True)
    est_actif = models.BooleanField(_("Est actif"), default=True)

    class Meta:
        abstract = True

class Pole(BaseModel):
    """
    Représente un pôle dans l'organisation Yoozak (ex: CLIENTS, COMMANDES, PRODUCTS)
    """
    POLES_CHOICES = (
        ('CLIENTS', 'Pôle Clients'),
        ('COMMANDES', 'Pôle Commandes'),
        ('PRODUCTS', 'Pôle Produits'),
    )
    
    nom = models.CharField(_("Nom"), max_length=100)
    code = models.CharField(_("Code"), max_length=50, choices=POLES_CHOICES, unique=True)
    description = models.TextField(_("Description"), blank=True)
    responsable = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="poles_diriges"
    )
    
    class Meta:
        verbose_name = _("Pôle")
        verbose_name_plural = _("Pôles")
        ordering = ['nom']
    
    def __str__(self):
        return self.nom

class Service(BaseModel):
    """
    Représente un service au sein d'un pôle (ex: Clients, Avis, Commandes, Produits)
    """
    nom = models.CharField(_("Nom"), max_length=100)
    description = models.TextField(_("Description"), blank=True)
    pole = models.ForeignKey(
        Pole, 
        on_delete=models.CASCADE,
        related_name="services"
    )
    responsable = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="services_diriges"
    )
    membres = models.ManyToManyField(
        User,
        through='ServiceMembre',
        related_name="services",
        blank=True
    )
    
    class Meta:
        verbose_name = _("Service")
        verbose_name_plural = _("Services")
        ordering = ['pole__nom', 'nom']
        unique_together = [['nom', 'pole']]
    
    def __str__(self):
        return f"{self.nom} ({self.pole.nom})"

class ServiceMembre(BaseModel):
    """Table d'association entre Service et User avec métadonnées"""
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_affectation = models.DateTimeField(_("Date d'affectation"), default=timezone.now)
    
    class Meta:
        verbose_name = _("Membre de service")
        verbose_name_plural = _("Membres de service")
        unique_together = [['service', 'user']]

class Team(BaseModel):
    """
    Représente une équipe au sein d'un service
    """
    nom = models.CharField(_("Nom"), max_length=100)
    description = models.TextField(_("Description"), blank=True)
    service = models.ForeignKey(
        Service, 
        on_delete=models.CASCADE,
        related_name="teams"
    )
    responsable = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="teams_dirigees"
    )
    membres = models.ManyToManyField(
        User,
        through='TeamMembre',
        related_name="teams",
        blank=True
    )
    
    class Meta:
        verbose_name = _("Équipe")
        verbose_name_plural = _("Équipes")
        ordering = ['service__nom', 'nom']
        unique_together = [['nom', 'service']]
    
    def __str__(self):
        return f"{self.nom} ({self.service.nom})"

class TeamMembre(BaseModel):
    """Table d'association entre Team et User avec métadonnées"""
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_affectation = models.DateTimeField(_("Date d'affectation"), default=timezone.now)
    
    class Meta:
        verbose_name = _("Membre d'équipe")
        verbose_name_plural = _("Membres d'équipe")
        unique_together = [['team', 'user']]

class UserProfile(BaseModel):
    """
    Extension du modèle User de Django avec informations supplémentaires
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        related_name="profile"
    )
    matricule = models.CharField(_("Matricule"), max_length=50, unique=True)
    photo = models.ImageField(
        _("Photo"), 
        upload_to="users/photos/", 
        blank=True, 
        null=True
    )
    telephone = models.CharField(_("Téléphone"), max_length=20, blank=True)
    adresse = models.TextField(_("Adresse"), blank=True)
    date_embauche = models.DateField(_("Date d'embauche"), null=True, blank=True)
    poste = models.CharField(_("Poste"), max_length=100, blank=True)
    biographie = models.TextField(_("Biographie"), blank=True)
    competences = models.JSONField(_("Compétences"), default=list, blank=True)
    
    class Meta:
        verbose_name = _("Profil utilisateur")
        verbose_name_plural = _("Profils utilisateurs")
    
    def __str__(self):
        return f"Profil de {self.user.username}"

class UserRole(BaseModel):
    """
    Définit les rôles d'un utilisateur dans l'organisation
    """
    # Rôles globaux
    ROLE_SUPERADMIN = 'SUPERADMIN'
    ROLE_ADMIN = 'ADMIN'
    ROLE_MANAGER = 'MANAGER'
    ROLE_EMPLOYEE = 'EMPLOYEE'
    ROLE_EXTERNAL = 'EXTERNAL'
    
    # Rôles spécifiques au pôle CLIENTS
    ROLE_DIRECTEUR_CLIENTS = 'DIRECTEUR_CLIENTS'
    ROLE_RESPONSABLE_CRM = 'RESPONSABLE_CRM'
    ROLE_GESTIONNAIRE_AVIS = 'GESTIONNAIRE_AVIS'
    
    # Rôles spécifiques au pôle COMMANDES
    ROLE_DIRECTEUR_COMMANDES = 'DIRECTEUR_COMMANDES'
    ROLE_RESPONSABLE_LOGISTIQUE = 'RESPONSABLE_LOGISTIQUE'
    ROLE_GESTIONNAIRE_PROMO = 'GESTIONNAIRE_PROMO'
    
    # Rôles spécifiques au pôle PRODUCTS
    ROLE_DIRECTEUR_PRODUITS = 'DIRECTEUR_PRODUITS'
    ROLE_RESPONSABLE_CATALOGUE = 'RESPONSABLE_CATALOGUE'
    ROLE_GESTIONNAIRE_PROMOTION = 'GESTIONNAIRE_PROMOTION'
    
    ROLES_CHOICES = (
        # Rôles globaux
        (ROLE_SUPERADMIN, _('Super Administrateur')),
        (ROLE_ADMIN, _('Administrateur')),
        (ROLE_MANAGER, _('Manager')),
        (ROLE_EMPLOYEE, _('Employé')),
        (ROLE_EXTERNAL, _('Externe')),
        
        # Rôles spécifiques au pôle CLIENTS
        (ROLE_DIRECTEUR_CLIENTS, _('Directeur Clients')),
        (ROLE_RESPONSABLE_CRM, _('Responsable CRM')),
        (ROLE_GESTIONNAIRE_AVIS, _('Gestionnaire Avis')),
        
        # Rôles spécifiques au pôle COMMANDES
        (ROLE_DIRECTEUR_COMMANDES, _('Directeur Commandes')),
        (ROLE_RESPONSABLE_LOGISTIQUE, _('Responsable Logistique')),
        (ROLE_GESTIONNAIRE_PROMO, _('Gestionnaire Promo')),
        
        # Rôles spécifiques au pôle PRODUCTS
        (ROLE_DIRECTEUR_PRODUITS, _('Directeur Produits')),
        (ROLE_RESPONSABLE_CATALOGUE, _('Responsable Catalogue')),
        (ROLE_GESTIONNAIRE_PROMOTION, _('Gestionnaire Promotion')),
    )
    
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name="roles"
    )
    role = models.CharField(_("Rôle"), max_length=50, choices=ROLES_CHOICES)
    pole = models.ForeignKey(
        Pole, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name="roles_utilisateurs"
    )
    service = models.ForeignKey(
        Service, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name="roles_utilisateurs"
    )
    team = models.ForeignKey(
        Team, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name="roles_utilisateurs"
    )
    date_attribution = models.DateTimeField(_("Date d'attribution"), default=timezone.now)
    
    class Meta:
        verbose_name = _("Rôle utilisateur")
        verbose_name_plural = _("Rôles utilisateurs")
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'role', 'pole', 'service', 'team'],
                name='unique_user_role'
            )
        ]
    
    def __str__(self):
        role_str = self.get_role_display()
        context = ""
        
        if self.pole:
            context += f" - {self.pole.nom}"
        if self.service:
            context += f" - {self.service.nom}"
        if self.team:
            context += f" - {self.team.nom}"
            
        return f"{self.user.username}: {role_str}{context}"
    
    def save(self, *args, **kwargs):
        # Logique pour gérer les contraintes de rôles
        # Par exemple, un rôle spécifique à un pôle doit être associé à ce pôle
        if self.role in [self.ROLE_DIRECTEUR_CLIENTS, self.ROLE_RESPONSABLE_CRM, self.ROLE_GESTIONNAIRE_AVIS]:
            # Vérifier que le pôle est CLIENTS
            if not (self.pole and self.pole.code == 'CLIENTS'):
                from django.core.exceptions import ValidationError
                raise ValidationError(_("Ce rôle doit être associé au pôle CLIENTS"))
                
        super().save(*args, **kwargs)
