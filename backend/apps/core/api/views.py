from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from apps.core.domain.models import Partner
from apps.core.services.base import BaseService
from django.db.models import Count
import logging

logger = logging.getLogger(__name__)


class PartnerSerializer:
    pass  # handled inline


from rest_framework import serializers

class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        from apps.core.domain.models import Partner
        model = Partner
        fields = [
            'id', 'name', 'email', 'phone', 'partner_type',
            'address', 'country', 'website', 'tax_id',
            'credit_limit', 'payment_terms', 'is_active', 'notes',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PartnerViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for Partners (Vendors, Customers, Suppliers).
    Odoo equivalent of res.partner — tenant-scoped.
    """
    serializer_class = PartnerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = BaseService.filter_by_context(Partner.objects.all(), self.request)
        partner_type = self.request.query_params.get('type')
        if partner_type:
            qs = qs.filter(partner_type=partner_type)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(name__icontains=search)
        return qs.order_by('name')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tenant = BaseService.get_tenant_context(request)
        partner = Partner(tenant=tenant, **serializer.validated_data)
        partner.save()
        return Response({'success': True, 'data': self.get_serializer(partner).data}, status=201)

    @action(detail=False, methods=['get'], url_path='vendors')
    def vendors(self, request):
        qs = BaseService.filter_by_context(Partner.objects.filter(partner_type='vendor'), request)
        return Response({'success': True, 'data': self.get_serializer(qs, many=True).data})

    @action(detail=False, methods=['get'], url_path='customers')
    def customers(self, request):
        qs = BaseService.filter_by_context(Partner.objects.filter(partner_type='customer'), request)
        return Response({'success': True, 'data': self.get_serializer(qs, many=True).data})

class CompanySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        from apps.core.domain.models import CompanySettings
        model = CompanySettings
        fields = '__all__'

class CompanySettingsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CompanySettingsSerializer
    def get_queryset(self):
        from apps.core.domain.models import CompanySettings
        return CompanySettings.objects.filter(tenant=self.request.user.tenant)
