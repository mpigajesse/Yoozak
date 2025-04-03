from django.shortcuts import render
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import AdminUserSerializer

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