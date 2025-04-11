from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

from .models import (
    Pole, 
    Service, 
    ServiceMembre, 
    Team, 
    TeamMembre, 
    UserProfile, 
    UserRole
)

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = _('Profil')
    fk_name = 'user'
    
class UserRoleInline(admin.TabularInline):
    model = UserRole
    extra = 1
    verbose_name_plural = _('Rôles')

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline, UserRoleInline)
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_poste', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'profile__poste')
    
    def get_poste(self, obj):
        if hasattr(obj, 'profile') and obj.profile:
            return obj.profile.poste
        return "-"
    get_poste.short_description = _('Poste')
    
    def get_inline_instances(self, request, obj=None):
        if not obj:
            return []
        return super().get_inline_instances(request, obj)

class ServiceMembreInline(admin.TabularInline):
    model = ServiceMembre
    extra = 1

class TeamMembreInline(admin.TabularInline):
    model = TeamMembre
    extra = 1

@admin.register(Pole)
class PoleAdmin(admin.ModelAdmin):
    list_display = ('nom', 'code', 'responsable', 'est_actif')
    list_filter = ('est_actif', 'code')
    search_fields = ('nom', 'description', 'responsable__username')

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('nom', 'pole', 'responsable', 'est_actif')
    list_filter = ('est_actif', 'pole')
    search_fields = ('nom', 'description', 'responsable__username')
    inlines = [ServiceMembreInline]

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('nom', 'service', 'responsable', 'est_actif')
    list_filter = ('est_actif', 'service__pole', 'service')
    search_fields = ('nom', 'description', 'responsable__username')
    inlines = [TeamMembreInline]

@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'pole', 'service', 'team', 'est_actif')
    list_filter = ('est_actif', 'role', 'pole', 'service')
    search_fields = ('user__username', 'user__email')
    raw_id_fields = ('user', 'pole', 'service', 'team')

# Dé-enregistrer l'UserAdmin d'origine et enregistrer notre version personnalisée
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
