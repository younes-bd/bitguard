from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnerViewSet, CompanySettingsViewSet

router = DefaultRouter()
router.register(r'partners', PartnerViewSet, basename='partner')
router.register(r'company-settings', CompanySettingsViewSet, basename='company-settings')

urlpatterns = [
    path('', include(router.urls)),
]
