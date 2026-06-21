from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from ..domain.models import Notification
from ..api.serializers import NotificationSerializer

from ..application.services import NotificationService

class NotificationViewSet(viewsets.ModelViewSet):
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
