from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, FavorisViewSet, AvisViewSet

# Création du routeur pour l'API
router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'favoris', FavorisViewSet)
router.register(r'avis', AvisViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 