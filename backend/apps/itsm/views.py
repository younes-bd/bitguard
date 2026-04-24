from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ChangeRequest, ChangeTask
from .serializers import ChangeRequestSerializer, ChangeTaskSerializer
from .services import ITSMService

class ChangeRequestViewSet(viewsets.ModelViewSet):
    queryset = ChangeRequest.objects.all().order_by('-created_at')
    serializer_class = ChangeRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        cr = self.get_object()
        updated_cr = ITSMService.approve_change(cr, request.user)
        return Response(self.get_serializer(updated_cr).data)

    @action(detail=True, methods=['post'])
    def start_work(self, request, pk=None):
        cr = self.get_object()
        updated_cr = ITSMService.progress_change(cr)
        return Response(self.get_serializer(updated_cr).data)

class ChangeTaskViewSet(viewsets.ModelViewSet):
    queryset = ChangeTask.objects.all().order_by('change_request', 'created_at')
    serializer_class = ChangeTaskSerializer
    permission_classes = [permissions.IsAuthenticated]
