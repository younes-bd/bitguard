from rest_framework import viewsets, permissions
from apps.delivery.domain.models import DeliveryNote, ShippingMethod
from .serializers import DeliveryNoteSerializer, ShippingMethodSerializer

class DeliveryNoteViewSet(viewsets.ModelViewSet):
    queryset = DeliveryNote.objects.all()
    serializer_class = DeliveryNoteSerializer

class ShippingMethodViewSet(viewsets.ModelViewSet):
    queryset = ShippingMethod.objects.all()
    serializer_class = ShippingMethodSerializer
