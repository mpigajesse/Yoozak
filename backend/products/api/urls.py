
# Cette fichier urls.py permet de gerer les routes des vues coté backend django
#et par la suite on les utilisera dans le frontend react et react native 
# pour plus d'informations sur les routes : https://www.django-rest-framework.org/api-guide/routers/


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoriesViewSet, SousCategoriesViewSet, ProduitViewSet,
    ArticleViewSet, CreativeViewSet, PromotionViewSet, CatalogueViewSet
)# pour les vues qui sont dans le fichier views.py  du dossier api

# Création du routeur pour l'API pour les routes des vues 
router = DefaultRouter()
router.register(r'categories', CategoriesViewSet) # pour les categories qui sont dans le fichier views.py  du dossier api
router.register(r'sous-categories', SousCategoriesViewSet) # pour les sous-categories qui sont dans le fichier views.py  du dossier api
router.register(r'produits', ProduitViewSet) # pour les produits qui sont dans le fichier views.py  du dossier api
router.register(r'articles', ArticleViewSet) # pour les articles qui sont dans le fichier views.py  du dossier api
router.register(r'creatives', CreativeViewSet) # pour les creatives qui sont dans le fichier views.py  du dossier api
router.register(r'promotions', PromotionViewSet) # pour les promotions qui sont dans le fichier views.py  du dossier api
router.register(r'catalogues', CatalogueViewSet) # pour les catalogues qui sont dans le fichier views.py  du dossier api    

urlpatterns = [
    path('', include(router.urls)), # pour les routes des vues qui sont dans le fichier views.py  du dossier api 
] 