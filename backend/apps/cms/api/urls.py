from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServicePageViewSet, PageViewSet, MediaAssetViewSet

router = DefaultRouter()
router.register(r'services', ServicePageViewSet, basename='service')
router.register(r'pages', PageViewSet, basename='page')
router.register(r'media', MediaAssetViewSet, basename='media')

urlpatterns = [
    path('', include(router.urls)),
]
