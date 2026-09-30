from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import permissions
from apps.core.api.permissions import IsPlatformAdmin
from apps.inbox.domain.models import IncomingMailServer, OutgoingMailServer, EmailTemplate, MailAlias
from apps.inbox.api.serializers import IncomingMailServerSerializer, OutgoingMailServerSerializer, EmailTemplateSerializer, MailAliasSerializer
from apps.core.api.mixins import TenantScopedMixin
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from ..domain.models import Notification
from ..api.serializers import NotificationSerializer

from ..services import NotificationService

class NotificationViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        tenant = getattr(self.request, 'tenant', None)
        if not tenant:
            return Notification.objects.none()
        return Notification.objects.filter(tenant=tenant, user=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        tenant = getattr(request, 'tenant', None)
        if tenant:
            NotificationService.mark_all_as_read(request.user, tenant)
            return Response({'status': 'marked read'})
        return Response({'error': 'No tenant context'}, status=400)

    @action(detail=False, methods=['get', 'put'])
    def preferences(self, request):
        from ..domain.models import NotificationPreference
        from ..api.serializers import NotificationPreferenceSerializer
        
        if request.method == 'GET':
            # Initialize default preferences if missing
            for type_code, _ in Notification.TYPES:
                NotificationPreference.objects.get_or_create(user=request.user, type=type_code)
            
            prefs = NotificationPreference.objects.filter(user=request.user)
            return Response(NotificationPreferenceSerializer(prefs, many=True).data)
            
        elif request.method == 'PUT':
            prefs_data = request.data
            if not isinstance(prefs_data, list):
                return Response({'error': 'Expected a list of preferences'}, status=400)
                
            for pref_data in prefs_data:
                try:
                    pref = NotificationPreference.objects.get(user=request.user, id=pref_data.get('id'))
                    if 'in_app_enabled' in pref_data: pref.in_app_enabled = pref_data['in_app_enabled']
                    if 'email_enabled' in pref_data: pref.email_enabled = pref_data['email_enabled']
                    if 'sms_enabled' in pref_data: pref.sms_enabled = pref_data['sms_enabled']
                    pref.save()
                except NotificationPreference.DoesNotExist:
                    pass
            
            prefs = NotificationPreference.objects.filter(user=request.user)
            return Response(NotificationPreferenceSerializer(prefs, many=True).data)

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
        tenant = getattr(self.request, 'tenant', None)
        return MailAlias.objects.filter(tenant=tenant)

    def perform_create(self, serializer):
        serializer.save(tenant=getattr(self.request, 'tenant', None))

