from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from apps.base.api.mixins import TenantScopedMixin
from apps.system.domain.models import IntegrationKey
from apps.system.api.serializers import IntegrationKeySerializer
from apps.system.services.settings import SettingsService

class IsPlatformAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and (request.user.is_superuser or request.user.roles.filter(name__in=['SUPER_ADMIN', 'TENANT_ADMIN']).exists())

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


class IntegrationKeyViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = IntegrationKey.objects.all()
    serializer_class = IntegrationKeySerializer
    permission_classes = [permissions.IsAuthenticated, IsPlatformAdmin]

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()
        if not user.is_superuser and getattr(user, 'tenant', None):
            return qs.filter(tenant=getattr(request, 'tenant', None))
        return qs

    def create(self, request, *args, **kwargs):
        name = request.data.get('name', 'New Integration Key')
        service = SettingsService()
        tenant = getattr(request, 'tenant', None)
        api_key, raw_secret = service.create_integration_key(name, request.user, tenant)
        data = self.get_serializer(api_key).data
        data['raw_secret'] = raw_secret # Only returned once
        return Response(data, status=status.HTTP_201_CREATED)
