from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from django.db.models import Count, Q
from ..models import Client, Favoris, Avis
from .serializers import (
    UserSerializer, ClientSerializer, ClientCreateSerializer,
    FavorisSerializer, AvisSerializer
)

class ClientViewSet(viewsets.ModelViewSet):
    """API pour gérer les clients"""
    queryset = Client.objects.all()
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['nom', 'prenom', 'phone', 'user__email']
    filterset_fields = ['genre']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ClientCreateSerializer
        return ClientSerializer
    
    def get_permissions(self):
        """
        Définit les permissions :
        - Création : accessible à tous
        - Lecture de liste : authentification requise
        - Autres actions : administrateur ou propriétaire du profil
        """
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        elif self.action == 'list':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Point de terminaison pour récupérer le profil de l'utilisateur connecté"""
        try:
            client = Client.objects.get(user=request.user)
            serializer = ClientSerializer(client)
            return Response(serializer.data)
        except Client.DoesNotExist:
            return Response(
                {"detail": "Profil client non trouvé pour cet utilisateur."},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def stats(self, request):
        """Point de terminaison pour récupérer les statistiques sur les clients"""
        try:
            # Nombre total de clients
            total_clients = Client.objects.count()
            
            # Nombre de clients actifs (avec au moins une commande)
            clients_actifs = Client.objects.filter(commandes__isnull=False).distinct().count()
            
            # Clients créés ce mois-ci
            from django.utils import timezone
            import datetime
            
            today = timezone.now()
            first_day_of_month = datetime.date(today.year, today.month, 1)
            
            # On utilise le User model car Client n'a pas de date_joined
            nouveaux_clients = Client.objects.filter(
                user__date_joined__gte=first_day_of_month
            ).count()
            
            # Taux de rétention (clients ayant plus d'une commande / clients ayant au moins une commande)
            # Ou valeur par défaut si pas de clients avec commandes
            clients_avec_commandes = Client.objects.filter(commandes__isnull=False).distinct().count()
            clients_avec_plusieurs_commandes = Client.objects.annotate(
                nb_commandes=Count('commandes')
            ).filter(nb_commandes__gt=1).count()
            
            taux_retention = 0
            if clients_avec_commandes > 0:
                taux_retention = round((clients_avec_plusieurs_commandes / clients_avec_commandes) * 100, 1)
            
            return Response({
                'totalClients': total_clients,
                'clientsActifs': clients_actifs,
                'nouveauxClients': nouveaux_clients,
                'tauxRetention': taux_retention
            })
        except Exception as e:
            return Response(
                {"detail": f"Erreur lors de la récupération des statistiques: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class FavorisViewSet(viewsets.ModelViewSet):
    """API pour gérer les favoris des clients"""
    queryset = Favoris.objects.all()
    serializer_class = FavorisSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['client', 'produit']
    
    def get_permissions(self):
        """
        Définit les permissions :
        - Lecture : utilisateur authentifié
        - Autres actions : propriétaire ou administrateur
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Filtre les favoris pour n'afficher que ceux de l'utilisateur connecté"""
        if self.request.user.is_staff:
            return Favoris.objects.all()
        
        try:
            client = Client.objects.get(user=self.request.user)
            return Favoris.objects.filter(client=client)
        except Client.DoesNotExist:
            return Favoris.objects.none()
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def mes_favoris(self, request):
        """Point de terminaison pour récupérer les favoris de l'utilisateur connecté"""
        try:
            client = Client.objects.get(user=request.user)
            favoris = Favoris.objects.filter(client=client)
            serializer = FavorisSerializer(favoris, many=True)
            return Response(serializer.data)
        except Client.DoesNotExist:
            return Response(
                {"detail": "Profil client non trouvé pour cet utilisateur."},
                status=status.HTTP_404_NOT_FOUND
            )

class AvisViewSet(viewsets.ModelViewSet):
    """API pour gérer les avis des clients"""
    queryset = Avis.objects.all()
    serializer_class = AvisSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['client', 'produit', 'note']
    search_fields = ['commentaire', 'client__nom', 'client__prenom', 'produit__nom']
    ordering_fields = ['date_creation', 'note']
    
    def get_permissions(self):
        """
        Définit les permissions :
        - Lecture : accessible à tous
        - Création : utilisateur authentifié
        - Modification/Suppression : propriétaire ou administrateur
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def mes_avis(self, request):
        """Point de terminaison pour récupérer les avis de l'utilisateur connecté"""
        try:
            client = Client.objects.get(user=request.user)
            avis = Avis.objects.filter(client=client)
            serializer = AvisSerializer(avis, many=True)
            return Response(serializer.data)
        except Client.DoesNotExist:
            return Response(
                {"detail": "Profil client non trouvé pour cet utilisateur."},
                status=status.HTTP_404_NOT_FOUND
            ) 