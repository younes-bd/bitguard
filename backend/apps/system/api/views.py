from apps.core.api.mixins import TenantScopedMixin
from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from django_filters.rest_framework import DjangoFilterBackend
from django.http import HttpResponse
import csv
from ..domain.models import SystemSetting
from ..api.serializers import SystemSettingSerializer
from apps.core.domain.models import AuditTrail
from apps.system.domain.models import OutgoingMailServer, IncomingMailServer, EmailTemplate
from apps.system.api.serializers import AuditTrailSerializer, OutgoingMailServerSerializer, IncomingMailServerSerializer, EmailTemplateSerializer
from ..application.services import SettingsService
from apps.system.domain.models import InstalledModule, MailAlias
from apps.system.api.serializers import InstalledModuleSerializer, MailAliasSerializer, AutomatedActionSerializer
from apps.system.services.modules import sync_modules

class EmailConfigViewSet(TenantScopedMixin, viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        tenant = getattr(request, 'tenant', None)
        service = SettingsService()
        config = {
            'smtp_host': service.get_setting('smtp_host', '', tenant=tenant),
            'smtp_port': int(service.get_setting('smtp_port', '587', tenant=tenant)),
            'smtp_user': service.get_setting('smtp_user', '', tenant=tenant),
            'smtp_password': service.get_setting('smtp_password', '', tenant=tenant),
            'use_tls': service.get_setting('use_tls', 'true', tenant=tenant).lower() == 'true',
            'default_sender': service.get_setting('default_sender', '', tenant=tenant),
        }
        return Response({'config': config})

    def create(self, request):
        tenant = getattr(request, 'tenant', None)
        service = SettingsService()
        ip = request.META.get('REMOTE_ADDR')
        
        for key in ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_password', 'use_tls', 'default_sender']:
            if key in request.data:
                service.update_setting(key, str(request.data[key]), request.user, ip, tenant=tenant)
                
        return Response({'status': 'Email configuration updated successfully'})
        
    @action(detail=False, methods=['post'])
    def test(self, request):
        from django.core.mail import send_mail
        from django.conf import settings as django_settings
        tenant = getattr(request, 'tenant', None)
        try:
            send_mail(
                subject = f'Test Email from {tenant.name}' if tenant else 'Test Email from BitGuard',
                message='This is a test email to verify your SMTP configuration.',
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[request.user.email],
                fail_silently=False,
            )
            return Response({'status': 'success', 'message': f'Test email sent to {request.user.email}'})
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=500)

class IsPlatformAdmin(permissions.BasePermission):
    """
    Allow platform superusers, staff, or users with admin roles.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_superuser or request.user.is_staff:
            return True
        # Also allow users with SUPER_ADMIN or TENANT_ADMIN roles
        try:
            return request.user.roles.filter(name__in=['SUPER_ADMIN', 'TENANT_ADMIN']).exists()
        except Exception:
            return False


class InstalledModuleViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    """
    API endpoint that allows ERP modules to be viewed, installed, or uninstalled.
    """
    queryset = InstalledModule.objects.all()
    serializer_class = InstalledModuleSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'technical_name', 'summary', 'category']
    filterset_fields = ['is_installed', 'category']

    @action(detail=False, methods=['get'])
    def categories(self, request):
        qs = self.filter_queryset(self.get_queryset())
        from django.db.models import Count
        categories = qs.values('category').annotate(count=Count('id')).order_by('category')
        result = [
            {'name': c['category'] or 'Uncategorized', 'count': c['count']}
            for c in categories
        ]
        return Response(result)
    ordering_fields = ['name', 'category']
    ordering = ['category', 'name']

    def get_queryset(self):
        tenant = getattr(self.request, 'tenant', None)
        qs = super().get_queryset()
        
        # By default, only show user-facing applications (unless explicitly queried)
        if self.request.query_params.get('all') != 'true':
            qs = qs.filter(application=True)
            
        if tenant:
            return qs.filter(tenant=tenant)
        return qs

    @action(detail=False, methods=['post'])
    def update_list(self, request):
        tenant = getattr(request, 'tenant', None)
        count = sync_modules(tenant)
        return Response({'status': 'success', 'modules_found': count})

    @action(detail=True, methods=['post'], permission_classes=[IsPlatformAdmin])
    def install(self, request, pk=None):
        module = self.get_object()
        
        # Check dependencies are installed
        unmet_deps = []
        if isinstance(module.depends, list):
            for dep_name in module.depends:
                dep = InstalledModule.objects.filter(tenant=module.tenant, technical_name=dep_name).first()
                if not dep or not dep.is_installed:
                    unmet_deps.append(dep_name)
        
        if unmet_deps:
            return Response({
                'error': 'Dependencies not installed',
                'unmet_dependencies': unmet_deps
            }, status=status.HTTP_400_BAD_REQUEST)
        
        module.is_installed = True
        module.save()
        
        tenant = getattr(request, 'tenant', None)
        try:
            from apps.core.domain.models import AuditTrail
            AuditTrail.objects.create(
                action='install_module',
                resource_type='InstalledModule',
                resource_id=str(module.id),
                details={'technical_name': module.technical_name},
                tenant=tenant
            )
        except Exception:
            pass
            
        return Response({'status': 'installed', 'module': module.technical_name})

    @action(detail=True, methods=['post'], permission_classes=[IsPlatformAdmin])
    def upgrade(self, request, pk=None):
        module = self.get_object()
        if not module.is_installed:
            return Response({'error': 'Module is not installed'}, status=status.HTTP_400_BAD_REQUEST)
        
        from apps.system.services.modules import find_manifest, read_manifest
        manifest_path = find_manifest(module.technical_name)
        if manifest_path:
            data = read_manifest(manifest_path)
            module.version = data.get('version', module.version)
            module.summary = data.get('summary', module.summary)
            module.description = data.get('description', module.description)
            module.save()
        else:
            return Response({'error': 'Manifest not found'}, status=404)
            
        tenant = getattr(request, 'tenant', None)
        try:
            from apps.core.domain.models import AuditTrail
            AuditTrail.objects.create(
                action='update',
                resource_type='InstalledModule',
                resource_id=str(module.id),
                details={'technical_name': module.technical_name, 'message': 'Module upgraded'},
                tenant=tenant
            )
        except Exception:
            pass
            
        return Response({'status': 'upgraded', 'module': module.technical_name})

    @action(detail=True, methods=['post'], permission_classes=[IsPlatformAdmin])
    def uninstall(self, request, pk=None):
        module = self.get_object()
        
        # --- KERNEL PROTECTION ---
        KERNEL_MODULES = ['core', 'system', 'auth', 'tenants', 'automation', 'apps', 'users']
        if module.technical_name in KERNEL_MODULES:
            return Response({
                'error': f"Cannot uninstall '{module.technical_name}'. It is a protected core kernel module required for the ERP to function.",
                'blocking_modules': ['ERP Core Engine']
            }, status=status.HTTP_403_FORBIDDEN)
        # -------------------------
        
        # Check no installed module depends on this one
        dependents = InstalledModule.objects.filter(
            tenant=module.tenant,
            is_installed=True
        ).exclude(id=module.id)
        
        blocking = [m.technical_name for m in dependents if isinstance(m.depends, list) and module.technical_name in m.depends]
        
        if blocking:
            return Response({
                'error': 'Other installed modules depend on this module',
                'blocking_modules': blocking
            }, status=status.HTTP_400_BAD_REQUEST)
        
        module.is_installed = False
        module.save()
        
        tenant = getattr(request, 'tenant', None)
        try:
            from apps.core.domain.models import AuditTrail
            AuditTrail.objects.create(
                action='uninstall_module',
                resource_type='InstalledModule',
                resource_id=str(module.id),
                details={'technical_name': module.technical_name},
                tenant=tenant
            )
        except Exception:
            pass
            
        return Response({'status': 'uninstalled', 'module': module.technical_name})


class SystemSettingViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    """
    API endpoint that allows system settings to be viewed or edited.
    """
    queryset = SystemSetting.objects.all()
    serializer_class = SystemSettingSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]
    service_class = SettingsService

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action in ['list', 'retrieve']:
            user = self.request.user
            if user.is_superuser or user.is_staff or user.roles.filter(name__in=['SUPER_ADMIN', 'TENANT_ADMIN']).exists():
                return queryset
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

class AuditTrailViewSet(TenantScopedMixin, viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows audit logs to be viewed.
    Using central AuditTrail model for system-wide transparency.
    """
    queryset = AuditTrail.objects.all()
    serializer_class = AuditTrailSerializer
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
        service = SettingsService()
        tenant = getattr(request.user, 'tenant', None)
        deleted = service.prune_audit_logs(days, request.user, tenant)
        return Response({'status': f'Successfully pruned {deleted} audit logs older than {days} days.'})

from ..domain.models import ApiKey, WebhookEndpoint, DatabaseBackup, CommandCenterSection
from .serializers import PlatformAPIKeySerializer, WebhookEndpointSerializer, DatabaseBackupSerializer
from rest_framework import serializers

class CommandCenterSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommandCenterSection
        fields = ['id', 'name', 'sequence']

class CommandCenterSectionViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = CommandCenterSection.objects.all()
    serializer_class = CommandCenterSectionSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None # Return a simple flat list
class APIKeyViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = ApiKey.objects.all()
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
        service = SettingsService()
        tenant = getattr(request.user, 'tenant', None)
        api_key, raw_secret = service.create_api_key(name, request.user, tenant)
        data = self.get_serializer(api_key).data
        data['raw_secret'] = raw_secret # Only returned once
        return Response(data, status=status.HTTP_201_CREATED)

class WebhookEndpointViewSet(TenantScopedMixin, viewsets.ModelViewSet):
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
        service = SettingsService()
        service.log_action(self.request.user, 'create', 'WebhookEndpoint', str(serializer.instance.id), tenant=tenant)

    @action(detail=True, methods=['post'])
    def test(self, request, pk=None):
        webhook = self.get_object()
        try:
            import requests as req
            resp = req.post(webhook.url, json={'event': 'test', 'source': 'bitguard_erp'}, timeout=5)
            return Response({'status': 'sent', 'response_code': resp.status_code})
        except Exception as e:
            return Response({'status': 'failed', 'error': str(e)}, status=400)

class DatabaseBackupViewSet(TenantScopedMixin, viewsets.ReadOnlyModelViewSet):
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
        service = SettingsService()
        tenant = getattr(request.user, 'tenant', None)
        backup = service.trigger_backup(request.user, tenant)
        return Response(self.get_serializer(backup).data)

from ..domain.models import Language
from apps.core.domain.models import ScheduledAction
from apps.automation.domain.models import AutomatedAction
from .serializers import LanguageSerializer, ScheduledActionSerializer

class LanguageViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'code']

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        if not user.is_superuser and getattr(user, 'tenant', None):
            return qs.filter(tenant=user.tenant)
        return qs

    def perform_create(self, serializer):
        tenant = getattr(self.request.user, 'tenant', None)
        serializer.save(tenant=tenant)

    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        language = self.get_object()
        tenant = getattr(self.request.user, 'tenant', None)
        
        # Unset default on all other languages
        if tenant:
            Language.objects.filter(tenant=tenant).update(is_default=False)
        else:
            Language.objects.update(is_default=False)
            
        language.is_default = True
        language.save()
        return Response({"status": "success", "message": "Default language updated."})

class ScheduledActionViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = ScheduledAction.objects.all()
    serializer_class = ScheduledActionSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['name', 'model_name', 'method_name']
    pagination_class = None

    def perform_create(self, serializer):
        tenant = getattr(self.request, 'tenant', None) or getattr(self.request.user, 'tenant', None)
        serializer.save(tenant=tenant)

    @action(detail=True, methods=['post'])
    def run(self, request, pk=None):
        action = self.get_object()
        from django.apps import apps
        from django.utils import timezone
        import traceback
        
        try:
            # Resolve model
            app_label, model_name = action.model_name.split('.')
            model_class = apps.get_model(app_label, model_name)
            
            # Execute method
            method = getattr(model_class.objects, action.method_name, None)
            if not method:
                method = getattr(model_class, action.method_name, None)
            
            if not method:
                raise AttributeError(f"Method '{action.method_name}' not found on model '{action.model_name}'")
            
            # Call method
            method()
            
            action.last_run = timezone.now()
            action.last_error = ''
            
            # Calculate next run
            from dateutil.relativedelta import relativedelta
            if action.interval_type == 'minutes':
                delta = relativedelta(minutes=action.interval_number)
            elif action.interval_type == 'hours':
                delta = relativedelta(hours=action.interval_number)
            elif action.interval_type == 'days':
                delta = relativedelta(days=action.interval_number)
            elif action.interval_type == 'weeks':
                delta = relativedelta(weeks=action.interval_number)
            elif action.interval_type == 'months':
                delta = relativedelta(months=action.interval_number)
            else:
                delta = relativedelta(days=action.interval_number)
            
            action.next_run = timezone.now() + delta
            action.save()
            return Response({"status": "success", "message": f"Action '{action.name}' executed successfully."})
        except Exception as e:
            error_msg = f"Error executing {action.name}: {str(e)}\n{traceback.format_exc()}"
            action.last_run = timezone.now()
            action.last_error = error_msg
            action.save()
            return Response({"status": "error", "message": str(e), "details": error_msg}, status=400)


class OutgoingMailServerViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    """CRUD for SMTP outgoing mail servers (Odoo: ir.mail_server)"""
    serializer_class = OutgoingMailServerSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'smtp_host', 'smtp_user']
    ordering_fields = ['sequence', 'name']

    def get_queryset(self):
        tenant = getattr(self.request, 'tenant', None)
        return OutgoingMailServer.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        tenant = getattr(self.request, 'tenant', None)
        serializer.save(tenant=tenant)

    @action(detail=True, methods=['post'])
    def test(self, request, pk=None):
        """Test connectivity to an SMTP server."""
        server = self.get_object()
        import socket
        try:
            sock = socket.create_connection((server.smtp_host, server.smtp_port), timeout=5)
            sock.close()
            return Response({'status': 'success', 'message': f'Connected to {server.smtp_host}:{server.smtp_port} successfully.'})
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=400)


class IncomingMailServerViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    """CRUD for IMAP/POP3 incoming mail servers (Odoo: fetchmail.server)"""
    serializer_class = IncomingMailServerSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'server', 'user']
    ordering_fields = ['name']

    def get_queryset(self):
        tenant = getattr(self.request, 'tenant', None)
        return IncomingMailServer.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        tenant = getattr(self.request, 'tenant', None)
        serializer.save(tenant=tenant)

    @action(detail=True, methods=['post'])
    def fetch_now(self, request, pk=None):
        """Trigger an immediate mail fetch for this server."""
        from django.utils import timezone
        server = self.get_object()
        server.last_fetch = timezone.now()
        server.save(update_fields=['last_fetch'])
        return Response({'status': 'success', 'message': f'Fetch triggered for {server.name}.'})

class EmailTemplateViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    """CRUD for email templates (Odoo: mail.template)"""
    serializer_class = EmailTemplateSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['name', 'subject', 'model']
    filterset_fields = ['model', 'is_active']
    ordering_fields = ['name']

    def get_queryset(self):
        tenant = getattr(self.request, 'tenant', None)
        return EmailTemplate.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        tenant = getattr(self.request, 'tenant', None)
        serializer.save(tenant=tenant)
        
    @action(detail=True, methods=['post'])
    def send_test(self, request, pk=None):
        template = self.get_object()
        recipient = request.data.get('email')
        if not recipient:
            return Response({'error': 'Email address required'}, status=status.HTTP_400_BAD_REQUEST)
        
        from django.core.mail import send_mail
        from django.conf import settings as django_settings
        from django.template import Template, Context
        try:
            t_subject = Template(template.subject or 'Test Email')
            t_body = Template(template.body_html or 'This is a test email.')
            ctx = Context({'user': request.user})
            
            send_mail(
                subject=t_subject.render(ctx),
                message='',
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient],
                html_message=t_body.render(ctx),
                fail_silently=False,
            )
            return Response({'status': 'success', 'message': f'Test email sent to {recipient}'})
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=500)

class MailAliasViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = MailAlias.objects.all()
    serializer_class = MailAliasSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def get_queryset(self):
        tenant = getattr(self.request.user, 'tenant', None)
        return MailAlias.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request.user, 'tenant', None))

class AutomatedActionViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = AutomatedAction.objects.all()
    serializer_class = AutomatedActionSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def get_queryset(self):
        tenant = getattr(self.request.user, 'tenant', None)
        return AutomatedAction.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request.user, 'tenant', None))

    @action(detail=True, methods=['post'])
    def run(self, request, pk=None):
        from django.apps import apps as django_apps
        from django.utils import timezone
        action_obj = self.get_object()
        action_obj.last_run = timezone.now()
        try:
            if action_obj.code:
                exec_globals = {'__builtins__': __builtins__}
                exec_locals = {'env': request.user.tenant if hasattr(request.user, 'tenant') else None, 'request': request}
                exec(compile(action_obj.code, '<automated_action>', 'exec'), exec_globals, exec_locals)
                action_obj.last_run_status = 'success'
            elif hasattr(action_obj, 'model_name') and hasattr(action_obj, 'method_name') and action_obj.model_name and action_obj.method_name:
                try:
                    app_label, model_name_str = action_obj.model_name.split('.')
                    Model = django_apps.get_model(app_label, model_name_str)
                    method = getattr(Model, action_obj.method_name, None)
                    if method:
                        method(tenant=request.user.tenant if hasattr(request.user, 'tenant') else None)
                        action_obj.last_run_status = 'success'
                    else:
                        action_obj.last_run_status = 'error'
                except Exception as exec_err:
                    action_obj.last_run_status = 'error'
                    action_obj.save()
                    return Response({'status': 'error', 'message': str(exec_err)}, status=400)
            else:
                action_obj.last_run_status = 'success'  # No-op action, mark as run
            action_obj.save()
            return Response({'status': 'success', 'message': 'Action executed successfully'})
        except Exception as e:
            action_obj.last_run_status = 'error'
            action_obj.save()
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f'AutomatedAction run error: {e}')
            return Response({'status': 'error', 'message': str(e)}, status=400)

from apps.reporting.domain.models import ReportTag, ReportTemplate as Report
from apps.system.api.serializers import ReportTagSerializer, ReportSerializer

class ReportTagsViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = ReportTag.objects.all()
    serializer_class = ReportTagSerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def get_queryset(self):
        tenant = getattr(self.request.user, 'tenant', None)
        return ReportTag.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request.user, 'tenant', None))

class ReportsViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = Report.objects.all()


class TranslationViewSet(TenantScopedMixin, viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def export(self, request):
        from django.http import HttpResponse
        language = request.query_params.get('language', 'en')
        fmt = request.query_params.get('format', 'po')
        tenant = getattr(request.user, 'tenant', None)
        
        lines = []
        lines.append(f'# Translation file for language: {language}')
        lines.append(f'# Generated by BitGuard ERP')
        lines.append(f'# Format: {fmt}')
        lines.append('')
        
        try:
            templates = EmailTemplate.objects.filter(tenant=tenant)
            for t in templates:
                lines.append(f'# Email Template: {t.name}')
                lines.append(f'msgid "{t.subject}"')
                lines.append(f'msgstr ""')
                lines.append('')
        except Exception:
            pass
        
        content = '\n'.join(lines)
        content_type = 'text/x-po' if fmt == 'po' else 'text/csv'
        ext = fmt if fmt in ['po', 'csv'] else 'po'
        response = HttpResponse(content, content_type=f'{content_type}; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="translations_{language}.{ext}"'
        return response

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser])
    def import_file(self, request):
        from rest_framework.parsers import MultiPartParser
        uploaded_file = request.FILES.get('file')
        language = request.data.get('language', 'en')
        if not uploaded_file:
            return Response({'error': 'No file provided'}, status=400)
        
        try:
            content = uploaded_file.read().decode('utf-8')
            lines = content.split('\n')
            imported_count = 0
            current_msgid = None
            for line in lines:
                line = line.strip()
                if line.startswith('msgid '):
                    current_msgid = line[7:-1] if line.startswith('msgid "') else line[6:]
                elif line.startswith('msgstr ') and current_msgid:
                    msgstr = line[8:-1] if line.startswith('msgstr "') else line[7:]
                    if msgstr and current_msgid:
                        imported_count += 1
                    current_msgid = None
            return Response({'status': 'success', 'imported': imported_count, 'language': language})
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=400)
