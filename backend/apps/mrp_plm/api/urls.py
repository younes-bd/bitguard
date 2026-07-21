from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EngineeringChangeOrderViewSet, ECOTypeViewSet

router = DefaultRouter()
router.register(r'ecos', EngineeringChangeOrderViewSet, basename='plm-eco')
router.register(r'eco-types', ECOTypeViewSet, basename='plm-ecotype')

urlpatterns = [
    path('', include(router.urls)),
]
