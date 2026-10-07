from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.journeys.api.views import SurveyViewSet

router = DefaultRouter()
router.register(r'', SurveyViewSet, basename='survey')

urlpatterns = [
    path('', include(router.urls)),
]
