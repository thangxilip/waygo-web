from django.core.exceptions import ObjectDoesNotExist
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from main.serializers import AppUserSerializer


class WayGoTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['access_token'] = data['access']
        data['refresh_token'] = data['refresh']
        try:
            data['app_user'] = AppUserSerializer(instance=self.user.appuser).data
        except ObjectDoesNotExist:
            raise ObjectDoesNotExist('User not associated with any company')
        del data['access']
        del data['refresh']
        return data


class WayGoTokenObtainPairView(TokenObtainPairView):
    serializer_class = WayGoTokenObtainPairSerializer
