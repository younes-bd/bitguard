from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SLATierViewSet, ServiceContractViewSet, QuoteViewSet, 
    SLABreachViewSet, SignatureRequestViewSet, QuoteLineViewSet
)

router = DefaultRouter()
router.register(r'sla-tiers', SLATierViewSet, basename='sla-tier')
router.register(r'service-contracts', ServiceContractViewSet, basename='service-contract')
router.register(r'quotes', QuoteViewSet, basename='quote')
router.register(r'quote-lines', QuoteLineViewSet, basename='quote-line')
router.register(r'sla-breaches', SLABreachViewSet, basename='sla-breach')
router.register(r'signature-requests', SignatureRequestViewSet, basename='signature-request')

urlpatterns = [
    path('', include(router.urls)),
]
