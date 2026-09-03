from apps.core.api.mixins import TenantScopedMixin
from rest_framework import viewsets, permissions
from apps.delivery.domain.models import DeliveryNote, ShippingMethod
from .serializers import DeliveryNoteSerializer, ShippingMethodSerializer

class DeliveryNoteViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = DeliveryNote.objects.all()
    serializer_class = DeliveryNoteSerializer

class ShippingMethodViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = ShippingMethod.objects.all()
    serializer_class = ShippingMethodSerializer
