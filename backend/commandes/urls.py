from django.urls import path, include

urlpatterns = [
    path('', include('commandes.api.urls')),
] 