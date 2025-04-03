from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.password_validation import validate_password

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