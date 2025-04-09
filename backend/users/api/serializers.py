# ce fichier gere les sérialiseurs pour les utilisateurs
# le serializer est un fichier qui permet de convertir les objets en format JSON    
# on utilise serializers.py pour gerer les sérialiseurs pour les utilisateurs
# serializers.py est un fichier de sérialiseurs pour les utilisateurs

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.password_validation import validate_password
from django.utils.translation import gettext_lazy as _
from ..models import Pole, Service, Team, UserProfile, UserRole

# on importe le modèle User de django
User = get_user_model()

# on crée un serializer pour le modèle Group
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

# on crée un serializer pour le modèle Permission
class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename']

# on crée un serializer pour le modèle User
class AdminUserSerializer(serializers.ModelSerializer):
    # on crée un serializer pour le modèle Group
    groups = GroupSerializer(many=True, read_only=True)
    # on crée un serializer pour le modèle Permission
    user_permissions = PermissionSerializer(many=True, read_only=True)
    # on crée un champ pour le mot de passe
    password = serializers.CharField(write_only=True, required=False)
    
    # on crée un serializer pour le modèle User
    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email', 
            'first_name', 
            'last_name', 
            'is_staff', 
            'is_superuser', 
            'is_active',
            'date_joined',
            'last_login',
            'groups',
            'user_permissions',
            'password'
        ]
        read_only_fields = ['is_staff', 'is_superuser', 'is_active', 'date_joined', 'last_login']
    # on crée une méthode pour valider le mot de passe
    def validate_password(self, value):
        # Valider le mot de passe selon les règles de Django
        if value:
            validate_password(value)
        return value
    # on crée une méthode pour mettre à jour l'utilisateur
    def update(self, instance, validated_data):
        # Gérer le mot de passe séparément s'il est fourni
        password = validated_data.pop('password', None)
        
        # Mettre à jour les autres champs
        instance = super().update(instance, validated_data)
        
        # Si un mot de passe est fourni, le définir
        if password:
            instance.set_password(password)
            instance.save()
            
        return instance

# on crée un serializer pour le modèle User
class UserSimpleSerializer(serializers.ModelSerializer):
    """Sérialiseur simplifié pour User"""
    # on crée un champ pour le nom complet
    full_name = serializers.SerializerMethodField()
    # on crée un serializer pour le modèle User
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'is_active']
    # on crée une méthode pour obtenir le nom complet
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username

# on crée un serializer pour le modèle Pole
class PoleSerializer(serializers.ModelSerializer):
    """Sérialiseur pour Pole"""
    # on crée un serializer pour le modèle User
    responsable = UserSimpleSerializer(read_only=True)
    responsable_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='responsable',
        write_only=True,
        allow_null=True
    )
    # on crée un serializer pour le modèle User
    class Meta:
        model = Pole
        fields = ['id', 'nom', 'code', 'description', 'responsable', 'responsable_id', 'est_actif', 'date_creation']

# on crée un serializer pour le modèle Service
class ServiceSerializer(serializers.ModelSerializer):
    """Sérialiseur pour Service"""
    # on crée un serializer pour le modèle User
    responsable = UserSimpleSerializer(read_only=True)
    responsable_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='responsable',
        write_only=True,
        allow_null=True
    )
    pole_details = PoleSerializer(source='pole', read_only=True)
    # on crée un serializer pour le modèle User
    class Meta:
        model = Service
        fields = [
            'id', 'nom', 'description', 'pole', 'pole_details',
            'responsable', 'responsable_id', 'est_actif', 'date_creation'
        ]

# on crée un serializer pour le modèle Team
class TeamSerializer(serializers.ModelSerializer):
    """Sérialiseur pour Team"""
    # on crée un serializer pour le modèle User
    responsable = UserSimpleSerializer(read_only=True)
    responsable_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='responsable',
        write_only=True,
        allow_null=True
    )
    service_details = ServiceSerializer(source='service', read_only=True)
    # on crée un serializer pour le modèle User
    class Meta:
        model = Team
        fields = [
            'id', 'nom', 'description', 'service', 'service_details',
            'responsable', 'responsable_id', 'est_actif', 'date_creation'
        ]

# on crée un serializer pour le modèle UserProfile
class UserProfileSerializer(serializers.ModelSerializer):
    """Sérialiseur pour UserProfile"""
    # on crée un serializer pour le modèle User
    class Meta:
        model = UserProfile
        fields = ['avatar', 'poste', 'bio', 'date_naissance', 'telephone']

# on crée un serializer pour le modèle UserRole
class UserRoleSerializer(serializers.ModelSerializer):
    """Sérialiseur pour UserRole"""
    # on crée un serializer pour le modèle User
    pole_details = PoleSerializer(source='pole', read_only=True)
    # on crée un serializer pour le modèle User
    service_details = ServiceSerializer(source='service', read_only=True)
    # on crée un serializer pour le modèle User
    team_details = TeamSerializer(source='team', read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    # on crée un serializer pour le modèle User
    class Meta:
        model = UserRole
        fields = [
            'id', 'role', 'role_display',
            'pole', 'pole_details',
            'service', 'service_details',
            'team', 'team_details',
            'date_attribution', 'est_actif'
        ]

class UserDetailSerializer(serializers.ModelSerializer):
    """Sérialiseur détaillé pour User"""
    profile = UserProfileSerializer(read_only=True)
    roles = UserRoleSerializer(many=True, read_only=True)
    services = serializers.SerializerMethodField()
    roles_count = serializers.SerializerMethodField()
    # on crée un serializer pour le modèle User             
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'is_active', 'is_staff', 'date_joined', 'profile', 
            'roles', 'services', 'roles_count'
        ]
        read_only_fields = ['is_staff', 'date_joined']
    # on crée une méthode pour obtenir les services
    def get_services(self, obj):
        return ServiceSerializer(obj.services.all(), many=True).data
    # on crée une méthode pour obtenir le nombre de rôles
    def get_roles_count(self, obj):
        # Utilisez cette méthode au lieu de faire un .count() qui génère une requête
        if hasattr(obj, 'roles'):
            return len([r for r in obj.roles.all() if r.est_actif])
        return 0
    
    def create(self, validated_data):
        """Créer un utilisateur avec son profil"""
        profile_data = validated_data.pop('profile', None)
        user = User.objects.create_user(**validated_data)
        
        # on crée un profil pour l'utilisateur
        if profile_data:
            UserProfile.objects.create(user=user, **profile_data)
        else:
            # Créer un profil vide
            UserProfile.objects.create(user=user, matricule=f"MAT{user.id}")
            
        return user
    
    # on crée une méthode pour mettre à jour l'utilisateur
    def update(self, instance, validated_data):
        """Mettre à jour un utilisateur et son profil"""
        profile_data = validated_data.pop('profile', None)
        
        # Mise à jour de l'utilisateur
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Mise à jour du profil
        if profile_data and hasattr(instance, 'profile'):
            profile = instance.profile
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()
            
        return instance

# on crée un serializer pour l'authentification
class LoginSerializer(serializers.Serializer):
    """Sérialiseur pour l'authentification"""
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)

# on crée un serializer pour les tokens JWT
# car on a besoin de gerer les tokens JWT pour l'authentification
class TokenSerializer(serializers.Serializer):
    """Sérialiseur pour les tokens JWT"""
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserDetailSerializer(read_only=True)
    user_roles = serializers.ListField(child=serializers.CharField(), read_only=True)