from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q

from clients.models import Client
from ..models import (
    EtatCommande, Commande, Panier, Retour, 
    Remise, CodePromo, LigneCommande
)
from .serializers import (
    EtatCommandeSerializer, CommandeListSerializer, CommandeDetailSerializer,
    CommandeCreateSerializer, PanierSerializer, RetourSerializer,
    RemiseSerializer, CodePromoSerializer, LigneCommandeSerializer
)

class IsOwnerOrAdmin(permissions.BasePermission):
    """Permission personnalisée pour permettre l'accès uniquement au propriétaire ou aux administrateurs"""
    def has_object_permission(self, request, view, obj):
        # Récupère le client de l'utilisateur connecté
        try:
            client = Client.objects.get(user=request.user)
            
            # Vérifie si c'est le propriétaire
            if hasattr(obj, 'client'):
                return obj.client == client
            
            # Pour les commandes
            if hasattr(obj, 'commande'):
                return obj.commande.client == client
            
            return False
        except Client.DoesNotExist:
            return False
        except:
            # En cas d'erreur, seuls les administrateurs ont accès
            return request.user.is_staff

class EtatCommandeViewSet(viewsets.ModelViewSet):
    """API pour gérer les états de commande"""
    queryset = EtatCommande.objects.all()
    serializer_class = EtatCommandeSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class CommandeViewSet(viewsets.ModelViewSet):
    """API pour gérer les commandes"""
    queryset = Commande.objects.all()
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['client', 'etat_commande', 'date_commande']
    ordering_fields = ['date_commande', 'date_creation', 'date_modification']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CommandeCreateSerializer
        elif self.action == 'list':
            return CommandeListSerializer
        return CommandeDetailSerializer
    
    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Filtre les commandes pour n'afficher que celles de l'utilisateur connecté (sauf pour les admins)"""
        if self.request.user.is_staff:
            return Commande.objects.all()
        
        try:
            client = Client.objects.get(user=self.request.user)
            return Commande.objects.filter(client=client)
        except Client.DoesNotExist:
            return Commande.objects.none()
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def mes_commandes(self, request):
        """Point de terminaison pour récupérer les commandes de l'utilisateur connecté"""
        try:
            client = Client.objects.get(user=request.user)
            commandes = Commande.objects.filter(client=client)
            serializer = CommandeListSerializer(commandes, many=True)
            return Response(serializer.data)
        except Client.DoesNotExist:
            return Response(
                {"detail": "Profil client non trouvé pour cet utilisateur."},
                status=status.HTTP_404_NOT_FOUND
            )

class PanierViewSet(viewsets.ModelViewSet):
    """API pour gérer les paniers"""
    queryset = Panier.objects.all()
    serializer_class = PanierSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['client', 'produit']
    
    def get_permissions(self):
        permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Filtre les paniers pour n'afficher que ceux de l'utilisateur connecté (sauf pour les admins)"""
        if self.request.user.is_staff:
            return Panier.objects.all()
        
        try:
            client = Client.objects.get(user=self.request.user)
            return Panier.objects.filter(client=client)
        except Client.DoesNotExist:
            return Panier.objects.none()
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def mon_panier(self, request):
        """Point de terminaison pour récupérer le panier de l'utilisateur connecté"""
        try:
            client = Client.objects.get(user=request.user)
            panier = Panier.objects.filter(client=client)
            serializer = PanierSerializer(panier, many=True)
            return Response(serializer.data)
        except Client.DoesNotExist:
            return Response(
                {"detail": "Profil client non trouvé pour cet utilisateur."},
                status=status.HTTP_404_NOT_FOUND
            )

class RetourViewSet(viewsets.ModelViewSet):
    """API pour gérer les retours"""
    queryset = Retour.objects.all()
    serializer_class = RetourSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['commande']
    ordering_fields = ['date_retour', 'date_creation']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsOwnerOrAdmin]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Filtre les retours pour n'afficher que ceux de l'utilisateur connecté (sauf pour les admins)"""
        if self.request.user.is_staff:
            return Retour.objects.all()
        
        try:
            client = Client.objects.get(user=self.request.user)
            return Retour.objects.filter(commande__client=client)
        except Client.DoesNotExist:
            return Retour.objects.none()

class CodePromoViewSet(viewsets.ModelViewSet):
    """API pour gérer les codes promo"""
    queryset = CodePromo.objects.all()
    serializer_class = CodePromoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['est_actif', 'commande']
    search_fields = ['numero_promo']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'validate']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def validate(self, request, pk=None):
        """Valide un code promo pour voir s'il est utilisable"""
        code_promo = self.get_object()
        
        # Vérifier si le code promo est actif et non associé à une commande
        if code_promo.est_actif and code_promo.commande is None:
            return Response(
                {"valid": True, "taux": code_promo.taux},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"valid": False, "message": "Code promo invalide ou déjà utilisé."},
                status=status.HTTP_400_BAD_REQUEST
            ) 