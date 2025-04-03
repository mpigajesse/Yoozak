from django.urls import path, include
from . import views

app_name = 'users'

urlpatterns = [
    # URLs pour les vues centrales (non API)
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('profile/', views.profile, name='profile'),
    path('profile/edit/', views.edit_profile, name='edit_profile'),
    
    # URLs pour l'API (inclus depuis le sous-module api)
    path('api/', include('users.api.urls')),
]