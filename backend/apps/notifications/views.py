from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer

from .services import NotificationService

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
