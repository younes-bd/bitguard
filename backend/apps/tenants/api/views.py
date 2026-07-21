from django.db.models import Count
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from apps.core.utils.response import standard_response
from apps.core.permissions import HasRole, IsSuperAdmin
from ..domain.models import Tenant
from ..api.serializers import TenantSerializer

class TenantViewSet(viewsets.ModelViewSet):
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

    @action(detail=False, methods=['get', 'patch'])
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
