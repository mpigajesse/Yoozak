from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdminUserViewSet, AdminProfileView, current_user, user_detail
from .api import admin_login, admin_token_refresh, admin_update_profile, admin_create_user, admin_delete_user

# Routes pour les utilisateurs admin
router = DefaultRouter()
router.register('', AdminUserViewSet, basename='user')

urlpatterns = [
    # URL simple pour l'utilisateur courant
    path('current/', current_user, name='current-user'),
    # URL directe pour le profil administrateur
    path('profile/', AdminProfileView.as_view(), name='admin-profile'),
    # URLs d'authentification admin
    path('auth/login/', admin_login, name='admin-login'),
    path('auth/refresh/', admin_token_refresh, name='admin-token-refresh'),
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