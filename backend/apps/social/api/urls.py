from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.journeys.api.views import SocialPostViewSet

router = DefaultRouter()
router.register(r'posts', SocialPostViewSet, basename='socialpost')

urlpatterns = [
    path('', include(router.urls)),
]
