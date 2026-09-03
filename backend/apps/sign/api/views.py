from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.core.api.mixins import TenantScopedMixin

from apps.sign.domain.models import SignatureRequest
from apps.subscriptions.domain.models import ServiceContract
from apps.helpdesk.domain.models import SLATier, SLABreach
from apps.sale.domain.models import SaleOrder

from .serializers import (
    SLATierSerializer, ServiceContractSerializer, QuoteSerializer,
    SLABreachSerializer, SignatureRequestSerializer
)

class SLATierViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = SLATier.objects.all()
    serializer_class = SLATierSerializer
    permission_classes = [IsAuthenticated]

class ServiceContractViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = ServiceContract.objects.all()
    serializer_class = ServiceContractSerializer
    permission_classes = [IsAuthenticated]

class QuoteViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    # Mapping Quotes to SaleOrders with draft/sent status
    queryset = SaleOrder.objects.filter(status__in=['draft', 'sent', 'accepted', 'rejected'])
    serializer_class = QuoteSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        quote = self.get_object()
        quote.status = 'accepted'
        quote.save()
        return Response({'status': 'Quote accepted'})

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        quote = self.get_object()
        quote.status = 'sent'
        quote.save()
        return Response({'status': 'Quote sent'})

class SLABreachViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = SLABreach.objects.all()
    serializer_class = SLABreachSerializer
    permission_classes = [IsAuthenticated]

class SignatureRequestViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = SignatureRequest.objects.all()
    serializer_class = SignatureRequestSerializer
    permission_classes = [IsAuthenticated]

from apps.sale.domain.models import SaleOrderLine
from .serializers import QuoteLineSerializer
class QuoteLineViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = SaleOrderLine.objects.all()
    serializer_class = QuoteLineSerializer
    permission_classes = [IsAuthenticated]
