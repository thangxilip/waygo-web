from rest_framework_api_key.permissions import BaseHasAPIKey
from .models import CompanyAPIKey


class HasAPIKeyOrIsAuthenticated(BaseHasAPIKey):
    model = CompanyAPIKey

    def has_permission(self, request, view):
        # JWT token
        if hasattr(request.user, "is_authenticated") and request.user.is_authenticated:
            return True
        
        # API key
        return super().has_permission(request, view);