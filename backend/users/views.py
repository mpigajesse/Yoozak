# Ce fichier contient les vues pour la gestion des utilisateurs
# Il gère les vues de connexion, de déconnexion, de profil et de modification de profil
# Il gère également les vues pour le tableau de bord et le profil utilisateur
# Il gère également les vues pour la modification de profil utilisateur
# Il gère également les vues pour la connexion utilisateur

from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.models import User

def user_login(request):
    """
    Vue centrale pour la page de connexion utilisateur standard (non API)
    """
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('users:dashboard')
        else:
            messages.error(request, 'Nom d\'utilisateur ou mot de passe incorrect.')
    
    return render(request, 'users/login.html')

def user_logout(request):
    """
    Vue centrale pour la déconnexion (non API)
    """
    logout(request)
    messages.success(request, 'Vous avez été déconnecté avec succès.')
    return redirect('users:login')

@login_required
def dashboard(request):
    """
    Vue centrale pour le tableau de bord utilisateur (non API)
    """
    return render(request, 'users/dashboard.html')

@login_required
def profile(request):
    """
    Vue centrale pour afficher le profil utilisateur (non API)
    """
    return render(request, 'users/profile.html')

@login_required
def edit_profile(request):
    """
    Vue centrale pour modifier le profil utilisateur (non API)
    """
    if request.method == 'POST':
        user = request.user
        
        # Mettre à jour les informations de l'utilisateur
        user.first_name = request.POST.get('first_name', user.first_name)
        user.last_name = request.POST.get('last_name', user.last_name)
        user.email = request.POST.get('email', user.email)
        
        # Gérer le changement de mot de passe
        password = request.POST.get('password')
        if password:
            user.set_password(password)
            
        user.save()
        messages.success(request, 'Votre profil a été mis à jour avec succès.')
        
        # Si le mot de passe a été changé, reconnecter l'utilisateur
        if password:
            user = authenticate(request, username=user.username, password=password)
            if user:
                login(request, user)
                
        return redirect('users:profile')
        
    return render(request, 'users/edit_profile.html')
