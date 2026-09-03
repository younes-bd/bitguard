from apps.core.api.mixins import TenantScopedMixin
from django.db.models import Count
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from apps.core.utils.response import standard_response
from apps.core.permissions import HasRole, IsSuperAdmin
from ..domain.models import Tenant
from ..api.serializers import TenantSerializer
from django.conf import settings

class TenantViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = TenantSerializer
    def get_permissions(self):
        if self.action in ['retrieve', 'update', 'partial_update', 'my_company']:
            return [IsAuthenticated()]
        return [IsAuthenticated(), HasRole(['SUPER_ADMIN'])]

    def get_queryset(self):
        # We annotate user_count but must handle the related name based on the User model.
        # Since BaseModel adds `%(class)s_set` by default, but we have a custom membership model, we use `memberships`.
        qs = Tenant.objects.annotate(user_count=Count('memberships')).all()
        partner_id = self.request.query_params.get('partner_id') or self.request.query_params.get('partner')
        if partner_id:
            qs = qs.filter(partner_id=partner_id)
            
        user = self.request.user
        if not (user.is_superuser or user.roles.filter(name='SUPER_ADMIN').exists()):
            tenant = getattr(self.request, 'tenant', None)
            if tenant:
                qs = qs.filter(id=tenant.id)
            else:
                qs = qs.none()
                
        return qs

    from rest_framework.decorators import action

    @action(detail=False, methods=['post'])
    def switch(self, request):
        tenant_id = request.data.get('tenant_id')
        if not tenant_id:
            from rest_framework.response import Response
            return Response({'detail': 'tenant_id required'}, status=400)
        
        from apps.users.domain.models import TenantMembership
        from apps.tenants.domain.models import Tenant
        
        has_membership = TenantMembership.objects.filter(user=request.user, tenant_id=tenant_id).exists()
        is_super = request.user.is_superuser or request.user.roles.filter(name='SUPER_ADMIN').exists()
        
        if not has_membership and not is_super:
            from rest_framework.response import Response
            return Response({'detail': 'Access denied to this company'}, status=403)
        
        try:
            tenant = Tenant.objects.get(id=tenant_id)
        except Tenant.DoesNotExist:
            from rest_framework.response import Response
            return Response({'detail': 'Company not found'}, status=404)
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(request.user)
        refresh['tenant_id'] = str(tenant.id)
        refresh['tenant_name'] = tenant.name
        
        from rest_framework.response import Response
        return Response({
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'tenant': {'id': str(tenant.id), 'name': tenant.name, 'domain': getattr(tenant, 'domain', None)}
        })

    @action(detail=False, methods=['get'], url_path='public-info', permission_classes=[])
    def public_info(self, request):
        domain = request.query_params.get('domain')
        if not domain:
            from rest_framework.response import Response
            return Response({'name': getattr(settings, 'PLATFORM_VENDOR_NAME', 'BitGuard'), 'logo': None})
            
        from apps.tenants.domain.models import Tenant
        tenant = Tenant.objects.filter(domain=domain).first()
        # Fallback to the first active tenant if domain not found (for single-tenant setups)
        if not tenant:
            tenant = Tenant.objects.filter(is_active=True).first()
            
        if tenant:
            logo_url = request.build_absolute_uri(tenant.logo.url) if tenant.logo else None
            from rest_framework.response import Response
            return Response({
                'name': tenant.name,
                'logo': logo_url
            })
            
        from rest_framework.response import Response
        return Response({'name': getattr(settings, 'PLATFORM_VENDOR_NAME', 'BitGuard'), 'logo': None})

    @action(detail=False, methods=['get', 'patch'], url_path='my-company')
    def my_company(self, request):
        tenant = getattr(request, 'tenant', None)
        if not tenant:
            return standard_response(False, "No tenant associated with user", status=status.HTTP_400_BAD_REQUEST)
        
        if request.method == 'GET':
            serializer = self.get_serializer(tenant)
            return standard_response(True, "Company profile retrieved", serializer.data)
            
        # PATCH
        serializer = self.get_serializer(tenant, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return standard_response(True, "Company profile updated", serializer.data)


    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return standard_response(True, "Tenants retrieved", serializer.data)


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return standard_response(True, "Tenant created", serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return standard_response(True, "Tenant updated", serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return standard_response(True, "Tenant deleted", status=status.HTTP_204_NO_CONTENT)
