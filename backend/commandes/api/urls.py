from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EtatCommandeViewSet, CommandeViewSet, 
    PanierViewSet, RetourViewSet, CodePromoViewSet
)

# Création du routeur pour l'API
router = DefaultRouter()
router.register(r'etats', EtatCommandeViewSet)
router.register(r'commandes', CommandeViewSet)
router.register(r'paniers', PanierViewSet)
router.register(r'retours', RetourViewSet)
router.register(r'codes-promo', CodePromoViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 