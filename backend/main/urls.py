from django.urls import path, include
from rest_framework.routers import DefaultRouter

from main import views

app_name = "main"

main_router = DefaultRouter()
main_router.register(r'lots', views.LotViewSet, 'lots')
main_router.register(r'lots-data', views.LotDataViewSet, 'lots-data')
main_router.register(r'status-report', views.StatusReportViewSet, 'status-report')
main_router.register(r'notifications', views.NotificationViewSet, 'notifications')
urlpatterns = [
    path('', include(main_router.urls)),
    path('statistic/', views.statistic),
    # path("lots/", views.get_all_lots, name="get_all_lots"),
    # path("lots/time/", views.get_lots_in_time_period, name="get_lots_in_time_period"),
    # path("lots/species/", views.get_lots_by_species, name="get_lots_by_species"),
    # path("lots/chamber/", views.get_lots_by_chamber, name="get_lots_by_chamber"),
    # path("lots/<str:lot_id>/", views.get_lot_details, name="get_lot_details"),
    # path("lotdata/<str:lot_id>/", views.get_lotdata_by_lot, name="get_lotdata_by_lot"),
    # path("lots/create/", views.create_lot, name="create_lot"),
    # path("lotdata/create/", views.create_lotdata, name="create_lotdata"),
]
