from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .serializers import AdminUserSerializer

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    """
    Endpoint pour l'authentification des administrateurs
    """
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {"detail": "Veuillez fournir un nom d'utilisateur et un mot de passe."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if user is None: 
            return Response(
                {"detail": "Nom d'utilisateur ou mot de passe incorrect."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_staff:
            return Response(
                {"detail": "Vous n'avez pas les droits d'administrateur nécessaires."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        refresh = RefreshToken.for_user(user)
        
        # Ajouter des informations supplémentaires au token
        refresh['user_id'] = user.id
        refresh['username'] = user.username
        refresh['is_staff'] = user.is_staff
        refresh['is_superuser'] = user.is_superuser
        
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": AdminUserSerializer(user).data
        })
    except Exception as e:
        return Response(
            {"detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_token_refresh(request):
    """
    Endpoint pour rafraîchir le token d'authentification
    """
    refresh_token = request.data.get('refresh')
    
    if not refresh_token:
        return Response(
            {"detail": "Veuillez fournir un token de rafraîchissement."},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        refresh = RefreshToken(refresh_token)
        user_id = refresh.payload.get('user_id')
        
        # Vérifier si l'utilisateur est toujours un admin
        try:
            user = User.objects.get(id=user_id)
            if not user.is_staff:
                return Response(
                    {"detail": "Vous n'avez pas les droits d'administrateur nécessaires."},
                    status=status.HTTP_403_FORBIDDEN
                )
        except User.DoesNotExist:
            return Response(
                {"detail": "Utilisateur non trouvé."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        return Response({
            "access": str(refresh.access_token),
        })
        
    except Exception as e:
        return Response(
            {"detail": "Token de rafraîchissement invalide ou expiré."},
            status=status.HTTP_401_UNAUTHORIZED
        )

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def admin_update_profile(request):
    """
    Endpoint pour mettre à jour le profil administrateur
    """
    if not request.user.is_staff:
        return Response(
            {"detail": "Vous n'avez pas les droits d'administrateur nécessaires."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    user = request.user
    serializer = AdminUserSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        # Si un nouveau mot de passe est fourni, le définir séparément
        password = request.data.get('password')
        if password:
            user.set_password(password)
        
        # Sauvegarder les autres changements
        serializer.save()
        
        # Mettre à jour les données serialisées après la sauvegarde
        serializer = AdminUserSerializer(user)
        
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_create_user(request):
    """
    Endpoint pour créer un nouvel utilisateur administrateur
    Seuls les utilisateurs administrateurs existants peuvent créer d'autres administrateurs
    """
    # Vérifier que l'utilisateur qui fait la requête est un administrateur
    if not request.user.is_staff:
        return Response(
            {"detail": "Vous n'avez pas les droits d'administrateur nécessaires."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Extraire les données de la requête
    data = request.data.copy()
    
    # Vérifier que les champs requis sont présents
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return Response(
                {"detail": f"Le champ '{field}' est requis."},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    # Créer un sérialiseur avec les données
    serializer = AdminUserSerializer(data=data)
    
    if serializer.is_valid():
        # Créer l'utilisateur avec le statut staff
        user = serializer.save()
        
        # Définir le mot de passe et le statut d'administrateur
        password = data.get('password')
        user.set_password(password)
        user.is_staff = True
        
        # Définir si l'utilisateur est superuser si spécifié
        if 'is_superuser' in data:
            user.is_superuser = data.get('is_superuser', False)
        
        user.save()
        
        # Retourner les données de l'utilisateur créé
        return Response(
            {
                "detail": "Utilisateur administrateur créé avec succès.",
                "user": AdminUserSerializer(user).data
            },
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_delete_user(request, user_id):
    """
    Endpoint pour supprimer un utilisateur administrateur
    Seuls les superutilisateurs peuvent supprimer d'autres administrateurs
    """
    # Vérifier que l'utilisateur qui fait la requête est un superutilisateur
    if not request.user.is_superuser:
        return Response(
            {"detail": "Vous n'avez pas les droits de superutilisateur nécessaires."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
        # Récupérer l'utilisateur à supprimer
        user_to_delete = User.objects.get(id=user_id)
        
        # Empêcher la suppression de son propre compte
        if user_to_delete.id == request.user.id:
            return Response(
                {"detail": "Vous ne pouvez pas supprimer votre propre compte."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Supprimer l'utilisateur
        username = user_to_delete.username
        user_to_delete.delete()
        
        return Response(
            {"detail": f"L'utilisateur '{username}' a été supprimé avec succès."},
            status=status.HTTP_200_OK
        )
        
    except User.DoesNotExist:
        return Response(
            {"detail": "Utilisateur non trouvé."},
            status=status.HTTP_404_NOT_FOUND
        )