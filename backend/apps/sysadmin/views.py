from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse
import csv
from .models import SystemSetting, AuditTrail
from .serializers import SystemSettingSerializer, AuditTrailSerializer
from .services import SysadminService

class IsPlatformAdmin(permissions.BasePermission):
    """
    Custom permission to only allow superusers or platform admins.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_superuser or request.user.is_staff))

class SystemSettingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows system settings to be viewed or edited.
    """
    queryset = SystemSetting.objects.all()
    serializer_class = SystemSettingSerializer
    # Public settings can be accessed by any logged in (or even anonymous) user depending on needs
    # Setting permission to IsPlatformAdmin by default for security, but overridden in specific actions if needed
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]
    service_class = SysadminService

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action in ['list', 'retrieve'] and not (self.request.user.is_superuser or self.request.user.is_staff):
            return queryset.filter(is_public=True)
        return queryset
        
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    @action(detail=False, methods=['get'])
    def metrics(self, request):
        service = self.service_class()
        data = service.get_system_metrics()
        return Response(data)

    @action(detail=False, methods=['post'])
    def clear_cache(self, request):
        service = self.service_class()
        tenant = getattr(request.user, 'tenant', None)
        ip = request.META.get('REMOTE_ADDR')
        service.clear_django_cache(request.user, ip, tenant)
        return Response({'status': 'Cache cleared successfully.'})

    @action(detail=False, methods=['post'])
    def sync_indexes(self, request):
        service = self.service_class()
        tenant = getattr(request.user, 'tenant', None)
        ip = request.META.get('REMOTE_ADDR')
        service.sync_search_indexes(request.user, ip, tenant)
        return Response({'status': 'Search indexes synchronization started.'})

    @action(detail=False, methods=['post'])
    def toggle_maintenance(self, request):
        service = self.service_class()
        tenant = getattr(request.user, 'tenant', None)
        ip = request.META.get('REMOTE_ADDR')
        new_val = service.toggle_maintenance_mode(request.user, ip, tenant)
        return Response({'status': f'Maintenance mode is now {new_val}.'})

    @action(detail=False, methods=['post'])
    def batch_update(self, request):
        service = self.service_class()
        tenant = getattr(request.user, 'tenant', None)
        ip = request.META.get('REMOTE_ADDR')
        
        settings_data = request.data.get('settings', {})
        for key, value in settings_data.items():
            service.update_setting(key, value, request.user, ip)
            
        return Response({'status': 'Settings updated successfully'})

class AuditTrailViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows audit trails to be viewed.
    Read-only for everyone, only accessible by platform admins.
    """
    queryset = AuditTrail.objects.all()
    serializer_class = AuditTrailSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]
    
    @action(detail=False, methods=['get'])
    def generate_report(self, request):
        service = self.service_class()
        metrics = service.get_system_metrics()
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="system_health_report.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['System Health Metric', 'Value'])
        for key, value in metrics.items():
            writer.writerow([key.replace('_', ' ').title(), value])
            
        return response

class AuditTrailViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows audit trails to be viewed.
    Read-only for everyone, only accessible by platform admins.
    """
    queryset = AuditTrail.objects.all()
    serializer_class = AuditTrailSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['action', 'resource_type', 'user__email', 'user__first_name', 'details']
    filterset_fields = ['action', 'resource_type']
    ordering_fields = ['created_at']
    
    def get_queryset(self):
        # If the app is tenant aware, we should filter by tenant
        # But this is a read only view set, so we can filter based on standard patterns
        user = self.request.user
        if getattr(user, 'tenant', None):
            return self.queryset.filter(tenant=user.tenant)
        return self.queryset

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="audit_logs_export.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Timestamp', 'User', 'Action', 'Resource', 'IP Address', 'Details'])
        
        for log in queryset:
            user_str = log.user.email if log.user else 'System'
            writer.writerow([
                log.created_at.strftime("%Y-%m-%d %H:%M:%S") if log.created_at else '',
                user_str,
                log.action,
                log.resource_type,
                log.ip_address or '',
                str(log.details)
            ])
            
        return response
