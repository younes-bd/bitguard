from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse
import csv
from .models import SystemSetting
from .serializers import SystemSettingSerializer
from apps.audit.models import AuditLog
from apps.audit.serializers import AuditLogSerializer
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
            service.update_setting(key, value, request.user, ip, tenant=tenant)
            
        return Response({'status': 'Settings updated successfully'})

    @action(detail=False, methods=['get'])
    def generate_report(self, request):
        service = self.service_class()
        metrics = service.get_system_metrics()
        settings = SystemSetting.objects.all()
        
        response = HttpResponse(content_type='text/plain')
        response['Content-Disposition'] = 'attachment; filename="sysadmin_report.txt"'
        
        response.write("=========================================\n")
        response.write("       BITGUARD PLATFORM STATUS REPORT   \n")
        response.write("=========================================\n\n")
        response.write(f"Active Users: {metrics.get('active_users', 0)}\n")
        response.write(f"System Uptime: {metrics.get('server_uptime', 'N/A')}\n")
        response.write(f"System Load: {metrics.get('cpu_load', 'N/A')}\n")
        response.write(f"Total Audit Events: {metrics.get('total_audits', 0)}\n\n")
        
        response.write("Platform Settings:\n")
        response.write("------------------\n")
        for setting in settings:
            response.write(f"- {setting.key}: {setting.value}\n")
            
        return response

    @action(detail=False, methods=['get'])
    def server_logs(self, request):
        import os
        from django.conf import settings
        log_path = os.path.join(settings.BASE_DIR, 'django.log')
        if not os.path.exists(log_path):
            return Response({'logs': "No backend log file found at django.log"})
        
        # Tail the last 100 lines
        with open(log_path, 'r') as f:
            lines = f.readlines()
            tail_lines = lines[-100:]
        return Response({'logs': "".join(tail_lines)})

class AuditTrailViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows audit logs to be viewed.
    Using central AuditLog model for system-wide transparency.
    """
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['action', 'resource_type', 'user__email', 'details']
    filterset_fields = ['action', 'resource_type']
    ordering_fields = ['created_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return self.queryset
        # Staff but not superuser: restrict to their tenant if they have one
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

    @action(detail=False, methods=['post'])
    def prune(self, request):
        days = request.data.get('days', 90)
        service = SysadminService()
        tenant = getattr(request.user, 'tenant', None)
        deleted = service.prune_audit_logs(days, request.user, tenant)
        return Response({'status': f'Successfully pruned {deleted} audit logs older than {days} days.'})

from .models import PlatformAPIKey, WebhookEndpoint, DatabaseBackup
from .serializers import PlatformAPIKeySerializer, WebhookEndpointSerializer, DatabaseBackupSerializer

class APIKeyViewSet(viewsets.ModelViewSet):
    queryset = PlatformAPIKey.objects.all()
    serializer_class = PlatformAPIKeySerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        if not user.is_superuser and getattr(user, 'tenant', None):
            return qs.filter(tenant=user.tenant)
        return qs

    def create(self, request, *args, **kwargs):
        name = request.data.get('name', 'New API Key')
        service = SysadminService()
        tenant = getattr(request.user, 'tenant', None)
        api_key, raw_secret = service.create_api_key(name, request.user, tenant)
        data = self.get_serializer(api_key).data
        data['raw_secret'] = raw_secret # Only returned once
        return Response(data, status=status.HTTP_201_CREATED)

class WebhookEndpointViewSet(viewsets.ModelViewSet):
    queryset = WebhookEndpoint.objects.all()
    serializer_class = WebhookEndpointSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        if not user.is_superuser and getattr(user, 'tenant', None):
            return qs.filter(tenant=user.tenant)
        return qs

    def perform_create(self, serializer):
        tenant = getattr(self.request.user, 'tenant', None)
        serializer.save(tenant=tenant)
        service = SysadminService()
        service.log_action(self.request.user, 'create', 'WebhookEndpoint', str(serializer.instance.id), tenant=tenant)

class DatabaseBackupViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DatabaseBackup.objects.all()
    serializer_class = DatabaseBackupSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        if not user.is_superuser and getattr(user, 'tenant', None):
            return qs.filter(tenant=user.tenant)
        return qs

    @action(detail=False, methods=['post'])
    def trigger(self, request):
        service = SysadminService()
        tenant = getattr(request.user, 'tenant', None)
        backup = service.trigger_backup(request.user, tenant)
        return Response(self.get_serializer(backup).data)
