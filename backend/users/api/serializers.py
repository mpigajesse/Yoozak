from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.password_validation import validate_password
from django.utils.translation import gettext_lazy as _
from ..models import Pole, Service, Team, UserProfile, UserRole

User = get_user_model()

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename']

class AdminUserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    user_permissions = PermissionSerializer(many=True, read_only=True)
    password = serializers.CharField(write_only=True, required=False)
    
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
        
    def validate_password(self, value):
        # Valider le mot de passe selon les règles de Django
        if value:
            validate_password(value)
        return value
        
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

class UserSimpleSerializer(serializers.ModelSerializer):
    """Sérialiseur simplifié pour User"""
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'is_active']
        
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username

class PoleSerializer(serializers.ModelSerializer):
    """Sérialiseur pour Pole"""
    responsable = UserSimpleSerializer(read_only=True)
    responsable_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='responsable',
        write_only=True,
        allow_null=True
    )
    
    class Meta:
        model = Pole
        fields = ['id', 'nom', 'code', 'description', 'responsable', 'responsable_id', 'est_actif', 'date_creation']

class ServiceSerializer(serializers.ModelSerializer):
    """Sérialiseur pour Service"""
    responsable = UserSimpleSerializer(read_only=True)
    responsable_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='responsable',
        write_only=True,
        allow_null=True
    )
    pole_details = PoleSerializer(source='pole', read_only=True)
    
    class Meta:
        model = Service
        fields = [
            'id', 'nom', 'description', 'pole', 'pole_details',
            'responsable', 'responsable_id', 'est_actif', 'date_creation'
        ]

class TeamSerializer(serializers.ModelSerializer):
    """Sérialiseur pour Team"""
    responsable = UserSimpleSerializer(read_only=True)
    responsable_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='responsable',
        write_only=True,
        allow_null=True
    )
    service_details = ServiceSerializer(source='service', read_only=True)
    
    class Meta:
        model = Team
        fields = [
            'id', 'nom', 'description', 'service', 'service_details',
            'responsable', 'responsable_id', 'est_actif', 'date_creation'
        ]

class UserProfileSerializer(serializers.ModelSerializer):
    """Sérialiseur pour UserProfile"""
    class Meta:
        model = UserProfile
        fields = [
            'id', 'matricule', 'photo', 'telephone', 'adresse',
            'date_embauche', 'poste', 'biographie', 'competences',
            'est_actif'
        ]

class UserRoleSerializer(serializers.ModelSerializer):
    """Sérialiseur pour UserRole"""
    pole_details = PoleSerializer(source='pole', read_only=True)
    service_details = ServiceSerializer(source='service', read_only=True)
    team_details = TeamSerializer(source='team', read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    
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
    profile = UserProfileSerializer(required=False)
    roles = UserRoleSerializer(many=True, read_only=True)
    services = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'is_active', 'is_staff', 'date_joined', 'profile', 
            'roles', 'services'
        ]
        read_only_fields = ['is_staff', 'date_joined']
    
    def get_services(self, obj):
        return ServiceSerializer(obj.services.all(), many=True).data
    
    def create(self, validated_data):
        """Créer un utilisateur avec son profil"""
        profile_data = validated_data.pop('profile', None)
        user = User.objects.create_user(**validated_data)
        
        if profile_data:
            UserProfile.objects.create(user=user, **profile_data)
        else:
            # Créer un profil vide
            UserProfile.objects.create(user=user, matricule=f"MAT{user.id}")
            
        return user
    
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

class LoginSerializer(serializers.Serializer):
    """Sérialiseur pour l'authentification"""
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)

class TokenSerializer(serializers.Serializer):
    """Sérialiseur pour les tokens JWT"""
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = UserDetailSerializer(read_only=True)
    user_roles = serializers.ListField(child=serializers.CharField(), read_only=True)