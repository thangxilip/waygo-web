"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.urls import path, include, re_path

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenRefreshView

from core.auth_serializer import WayGoTokenObtainPairView

schema_view = get_schema_view(
   openapi.Info(
      title="WayGo API",
      default_version='v1',
      description="All the endpoints of the Way Go Backend",
   ),
   public=True,
   permission_classes=(AllowAny,),
)
urlpatterns = []

if settings.DEBUG:
    urlpatterns = [
        path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
        path('redoc', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    ]
urlpatterns.extend([
    path('admin/', admin.site.urls),
    re_path(r'^api/auth/login/$', WayGoTokenObtainPairView.as_view(), name='rest_login'),
    re_path(r'^api/auth/refresh-token/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('main.urls')),
])
