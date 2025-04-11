"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from users.api.views import ServiceViewSet, TeamViewSet, PoleViewSet
from rest_framework.routers import DefaultRouter

# Configuration de Swagger pour la documentation de l'API
schema_view = get_schema_view(
    openapi.Info(
        title="Yoozak API",
        default_version='v1',
        description="API pour l'application Yoozak. \n\nPour vous authentifier, utilisez d'abord l'endpoint POST /api/token/ pour obtenir un token JWT, puis ajoutez-le dans l'en-tête Authorization sous la forme 'Bearer votre_token'.",
        terms_of_service="https://www.yoozak.com/terms/",
        contact=openapi.Contact(email="contact@yoozak.com"),
        license=openapi.License(name="Copyright Yoozak"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# Créer un routeur pour les endpoints d'organisation
org_router = DefaultRouter()
org_router.register(r'services', ServiceViewSet, basename='service')
org_router.register(r'teams', TeamViewSet, basename='team')
org_router.register(r'poles', PoleViewSet, basename='pole')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # URLs des vues centrales
    path('users/', include('users.urls')),
    
    # API endpoints
    path('api/', include([
        path('products/', include('products.urls')),
        path('clients/', include('clients.urls')),
        path('commandes/', include('commandes.urls')),
        path('users/', include('users.api.urls')),
        
        # Endpoints d'organisation (services, teams, pôles) directement accessibles au niveau racine API
        path('', include(org_router.urls)),
        
        # Authentification JWT
        path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    ])),
    
    # Documentation API
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# Servir les fichiers media et statiques en développement
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
