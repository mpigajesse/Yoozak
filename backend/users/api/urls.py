from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from .views import (
    LoginViewSet,
    UserViewSet,
    PoleViewSet,
    ServiceViewSet,
    TeamViewSet,
    UserRoleViewSet,
    AdminUserViewSet,
    AdminProfileView,
    current_user,
    user_detail
)

from .api import admin_login, admin_token_refresh, admin_update_profile, admin_create_user, admin_delete_user

# Création du routeur pour l'API
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'poles', PoleViewSet, basename='pole')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'roles', UserRoleViewSet, basename='user-role')
router.register(r'admin/users', AdminUserViewSet, basename='admin-user')

# Endpoints d'authentification
auth_patterns = [
    path('login/', LoginViewSet.as_view({'post': 'login'}), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('verify/', TokenVerifyView.as_view(), name='token-verify'),
]

urlpatterns = [
    # URL simple pour l'utilisateur courant
    path('current/', current_user, name='current-user'),
    # URL directe pour le profil administrateur
    path('profile/', AdminProfileView.as_view(), name='admin-profile'),
    # URLs d'authentification admin
    path('auth/', include(auth_patterns)),
    # URL pour mettre à jour le profil admin
    path('profile/update/', admin_update_profile, name='admin-update-profile'),
    # URL pour créer un nouvel utilisateur admin
    path('create/', admin_create_user, name='admin-create-user'),
    # URL pour supprimer un utilisateur admin
    path('delete/<int:user_id>/', admin_delete_user, name='admin-delete-user'),
    # URL pour consulter, modifier ou supprimer un utilisateur par son ID
    path('<int:user_id>/', user_detail, name='user-detail'),
    # URLs générées par le routeur pour les autres endpoints
    path('', include(router.urls)),
] 