from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_api_key.permissions import KeyParser
from .models import CompanyAPIKey

class APIKeyUser:
    def __init__(self, company, is_superuser=False):
        self.company = company
        self.is_superuser = is_superuser
        
class APIKeyAuthentication(authentication.BaseAuthentication):
    key_parser = KeyParser()

    def authenticate(self, request):
        key = self.key_parser.get(request)
        if not key:
            return None
        
        try:
            is_valid = CompanyAPIKey.objects.is_valid(key)
            if not is_valid:
                return None
            
            api_key = CompanyAPIKey.objects.get_from_key(key)

            return (APIKeyUser(api_key.company, False), None)  # (user, auth) 

        except CompanyAPIKey.DoesNotExist:
            raise AuthenticationFailed('Invalid API Key')
            