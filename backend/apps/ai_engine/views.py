from rest_framework import viewsets
from .models import AISettings, AIUsageLog
from .serializers import AISettingsSerializer, AIUsageLogSerializer

class AISettingsViewSet(viewsets.ModelViewSet):
    queryset = AISettings.objects.all()
    serializer_class = AISettingsSerializer
    
    def get_queryset(self):
        if hasattr(self.request.user, 'tenant'):
            return self.queryset.filter(tenant=self.request.user.tenant)
        return self.queryset.none()

class AIUsageLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AIUsageLog.objects.all().order_by('-created_at')
    serializer_class = AIUsageLogSerializer
    
    def get_queryset(self):
        if hasattr(self.request.user, 'tenant'):
            return self.queryset.filter(tenant=self.request.user.tenant)
        return self.queryset.none()
