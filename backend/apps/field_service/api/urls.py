from django.urls import path, include

app_name = 'field_service'

from rest_framework.routers import DefaultRouter
from .views import FieldInterventionViewSet

router = DefaultRouter()
router.register(r'interventions', FieldInterventionViewSet, basename='field-intervention')

urlpatterns = [
    path('', include(router.urls)),
]
