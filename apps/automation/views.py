from rest_framework import viewsets, permissions
from .models import Workflow
from .serializers import WorkflowSerializer

class WorkflowViewSet(viewsets.ModelViewSet):
    queryset = Workflow.objects.all().order_by('-created_at')
    serializer_class = WorkflowSerializer
    permission_classes = [permissions.IsAuthenticated]