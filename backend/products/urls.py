from django.urls import path, include

urlpatterns = [
    path('', include('products.api.urls')),
] 