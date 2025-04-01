from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings

# Configuration de Swagger pour la documentation de l'API
schema_view = get_schema_view(
    openapi.Info(
        title="Yoozak API",
        default_version='v1',
        description=(
            "API pour l'application Yoozak.\n\n"
            "**Authentification**:\n"
            "1. Utilisez l'endpoint POST `/api/token/` avec votre username et password\n"
            "2. Copiez le token d'accès (\"access\") depuis la réponse\n"
            "3. Dans Postman ou autre client API, ajoutez un en-tête `Authorization: Bearer votre_token`\n"
            "4. Pour Swagger, cliquez sur le bouton 'Authorize' et entrez `Bearer votre_token`"
        ),
        terms_of_service="https://www.yoozak.com/terms/",
        contact=openapi.Contact(email="contact@yoozak.com"),
        license=openapi.License(name="Copyright Yoozak"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# Ajouter des en-têtes personnalisés à la documentation Swagger
swagger_settings = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header',
            'description': 'Entrez votre token JWT avec le préfixe "Bearer ". Exemple: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."'
        }
    },
    'USE_SESSION_AUTH': False,
}

# Configurer une fonction pour ajouter l'en-tête d'autorisation aux requêtes Swagger
def jwt_header_parameter_resolver(request, obj, view, name, **kwargs):
    return openapi.Parameter(
        name='Authorization',
        in_=openapi.IN_HEADER,
        type=openapi.TYPE_STRING,
        description='Format: Bearer <token>',
        required=True,
    ) 