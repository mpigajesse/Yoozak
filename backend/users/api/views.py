from django.shortcuts import render
from rest_framework import viewsets, permissions, status, generics, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import models

from ..models import Pole, Service, Team, UserProfile, UserRole
from .serializers import (
    AdminUserSerializer,
    UserDetailSerializer, 
    PoleSerializer,
    ServiceSerializer,
    TeamSerializer,
    UserRoleSerializer,
    LoginSerializer,
    TokenSerializer
)

User = get_user_model()

# Vue API simple
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    """
    Endpoint simple qui renvoie les informations de l'utilisateur actuellement connecté
    """
    user = request.user
    serializer = AdminUserSerializer(user)
    return Response(serializer.data)

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filtre pour ne retourner que les utilisateurs staff/admin
        """
        return User.objects.filter(is_staff=True)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Endpoint pour récupérer les informations de l'utilisateur connecté
        """
        print(f"User authenticated: {request.user.is_authenticated}")
        print(f"User staff: {request.user.is_staff}")
        print(f"User: {request.user}")
        
        if not request.user.is_authenticated:
            return Response(
                {"detail": "Non authentifié"},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        if not request.user.is_staff:
            return Response(
                {"detail": "Seuls les administrateurs peuvent accéder à cet endpoint"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class AdminProfileView(APIView):
    """
    Vue pour récupérer et mettre à jour le profil de l'utilisateur admin connecté
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """
        Récupère les informations du profil de l'utilisateur connecté
        """
        if not request.user.is_staff:
            return Response(
                {"detail": "Seuls les administrateurs peuvent accéder à cet endpoint"},
                status=status.HTTP_403_FORBIDDEN
            )
            
        serializer = AdminUserSerializer(request.user)
        return Response(serializer.data)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def user_detail(request, user_id):
    """
    Endpoint pour récupérer, mettre à jour ou supprimer un utilisateur spécifique par son ID
    """
    # Vérifier que l'utilisateur est un administrateur
    if not request.user.is_staff:
        return Response(
            {"detail": "Seuls les administrateurs peuvent accéder à cet endpoint"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {"detail": "Utilisateur non trouvé"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # GET - Récupérer les informations de l'utilisateur
    if request.method == 'GET':
        serializer = AdminUserSerializer(user)
        return Response(serializer.data)
    
    # PATCH - Mettre à jour l'utilisateur
    elif request.method == 'PATCH':
        # Vérifier que l'utilisateur est un superuser pour modifier un autre superuser
        if user.is_superuser and not request.user.is_superuser:
            return Response(
                {"detail": "Seuls les superutilisateurs peuvent modifier d'autres superutilisateurs"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = AdminUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            # Gérer le mot de passe séparément s'il est fourni
            password = request.data.get('password')
            if password:
                user.set_password(password)
            
            # Si l'utilisateur souhaite changer le statut superuser
            is_superuser = request.data.get('is_superuser')
            if is_superuser is not None:
                # Seul un superuser peut promouvoir/rétrograder un superuser
                if not request.user.is_superuser:
                    return Response(
                        {"detail": "Seuls les superutilisateurs peuvent modifier le statut de superutilisateur"},
                        status=status.HTTP_403_FORBIDDEN
                    )
                user.is_superuser = is_superuser
            
            # Gérer is_staff et is_active
            is_staff = request.data.get('is_staff')
            if is_staff is not None:
                user.is_staff = is_staff
                
            is_active = request.data.get('is_active')
            if is_active is not None:
                user.is_active = is_active
            
            # Sauvegarder les autres champs via le serializer
            serializer.save()
            user.save()  # Sauvegarder les champs modifiés manuellement
            
            # Récupérer les données mises à jour
            updated_serializer = AdminUserSerializer(user)
            return Response(updated_serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # DELETE - Supprimer l'utilisateur
    elif request.method == 'DELETE':
        # Vérifier que l'utilisateur est un superuser pour supprimer un utilisateur
        if not request.user.is_superuser:
            return Response(
                {"detail": "Seuls les superutilisateurs peuvent supprimer des utilisateurs"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Empêcher la suppression de son propre compte
        if user.id == request.user.id:
            return Response(
                {"detail": "Vous ne pouvez pas supprimer votre propre compte"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.delete()
        return Response(
            {"detail": "Utilisateur supprimé avec succès"},
            status=status.HTTP_204_NO_CONTENT
        )

class LoginViewSet(viewsets.ViewSet):
    """Viewset pour l'authentification"""
    permission_classes = [permissions.AllowAny]
    
    @action(methods=['post'], detail=False)
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            
            if user:
                refresh = RefreshToken.for_user(user)
                # Récupérer tous les rôles de l'utilisateur
                roles = [role.role for role in user.roles.filter(est_actif=True)]
                
                data = {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': UserDetailSerializer(user).data,
                    'user_roles': roles
                }
                
                return Response(TokenSerializer(data).data)
            
            return Response(
                {'error': _('Nom d\'utilisateur ou mot de passe incorrect')},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    """Viewset pour User"""
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'is_staff']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'profile__poste']
    ordering_fields = ['username', 'date_joined', 'last_name']
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Récupérer les informations de l'utilisateur connecté"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def roles(self, request, pk=None):
        """Récupérer les rôles d'un utilisateur"""
        user = self.get_object()
        roles = user.roles.filter(est_actif=True)
        serializer = UserRoleSerializer(roles, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_role(self, request, pk=None):
        """Ajouter un rôle à un utilisateur"""
        user = self.get_object()
        serializer = UserRoleSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PoleViewSet(viewsets.ModelViewSet):
    """Viewset pour Pole"""
    queryset = Pole.objects.all()
    serializer_class = PoleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['est_actif', 'code']
    search_fields = ['nom', 'description']
    ordering_fields = ['nom', 'date_creation']
    
    @action(detail=True, methods=['get'])
    def services(self, request, pk=None):
        """Récupérer les services d'un pôle"""
        pole = self.get_object()
        services = pole.services.filter(est_actif=True)
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def users(self, request, pk=None):
        """Récupérer les utilisateurs d'un pôle"""
        pole = self.get_object()
        # Utilisateurs qui ont un rôle dans ce pôle
        pole_users = User.objects.filter(roles__pole=pole, roles__est_actif=True).distinct()
        serializer = UserDetailSerializer(pole_users, many=True)
        return Response(serializer.data)

class ServiceViewSet(viewsets.ModelViewSet):
    """Viewset pour Service"""
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['est_actif', 'pole']
    search_fields = ['nom', 'description']
    ordering_fields = ['nom', 'date_creation']
    
    @action(detail=True, methods=['get'])
    def teams(self, request, pk=None):
        """Récupérer les équipes d'un service"""
        service = self.get_object()
        teams = service.teams.filter(est_actif=True)
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def users(self, request, pk=None):
        """Récupérer les utilisateurs d'un service"""
        service = self.get_object()
        # Utilisateurs qui sont membres du service ou qui ont un rôle dans ce service
        service_users = User.objects.filter(
            models.Q(servicemembre__service=service) |
            models.Q(roles__service=service, roles__est_actif=True)
        ).distinct()
        serializer = UserDetailSerializer(service_users, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """Ajouter un membre à un service"""
        service = self.get_object()
        user_id = request.data.get('user_id')
        
        try:
            user = User.objects.get(pk=user_id)
            service.membres.add(user)
            return Response({'status': 'member added'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {'error': _('Utilisateur non trouvé')},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        """Retirer un membre d'un service"""
        service = self.get_object()
        user_id = request.data.get('user_id')
        
        try:
            user = User.objects.get(pk=user_id)
            service.membres.remove(user)
            return Response({'status': 'member removed'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {'error': _('Utilisateur non trouvé')},
                status=status.HTTP_404_NOT_FOUND
            )

class TeamViewSet(viewsets.ModelViewSet):
    """Viewset pour Team"""
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['est_actif', 'service', 'service__pole']
    search_fields = ['nom', 'description']
    ordering_fields = ['nom', 'date_creation']
    
    @action(detail=True, methods=['get'])
    def users(self, request, pk=None):
        """Récupérer les utilisateurs d'une équipe"""
        team = self.get_object()
        # Utilisateurs qui sont membres de l'équipe ou qui ont un rôle dans cette équipe
        team_users = User.objects.filter(
            models.Q(teammembre__team=team) |
            models.Q(roles__team=team, roles__est_actif=True)
        ).distinct()
        serializer = UserDetailSerializer(team_users, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        """Ajouter un membre à une équipe"""
        team = self.get_object()
        user_id = request.data.get('user_id')
        
        try:
            user = User.objects.get(pk=user_id)
            team.membres.add(user)
            return Response({'status': 'member added'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {'error': _('Utilisateur non trouvé')},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        """Retirer un membre d'une équipe"""
        team = self.get_object()
        user_id = request.data.get('user_id')
        
        try:
            user = User.objects.get(pk=user_id)
            team.membres.remove(user)
            return Response({'status': 'member removed'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {'error': _('Utilisateur non trouvé')},
                status=status.HTTP_404_NOT_FOUND
            )

class UserRoleViewSet(viewsets.ModelViewSet):
    """Viewset pour UserRole"""
    queryset = UserRole.objects.all()
    serializer_class = UserRoleSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['est_actif', 'role', 'pole', 'service', 'team', 'user']
    search_fields = ['user__username', 'user__email', 'role']
    ordering_fields = ['date_attribution']