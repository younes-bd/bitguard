from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ApprovalRequest, ApprovalStep
from .serializers import ApprovalRequestSerializer, ApprovalStepSerializer
from .services import ApprovalService

class ApprovalRequestViewSet(viewsets.ModelViewSet):
    queryset = ApprovalRequest.objects.all().order_by('-created_at')
    serializer_class = ApprovalRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Override to ensure requester is attached cleanly via the service layer
        ApprovalService.submit_request(self.request.data, self.request.user)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        approval = self.get_object()
        comments = request.data.get('comments', '')
        processed = ApprovalService.approve(approval, request.user, comments)
        return Response(self.get_serializer(processed).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        approval = self.get_object()
        comments = request.data.get('comments', '')
        processed = ApprovalService.reject(approval, request.user, comments)
        return Response(self.get_serializer(processed).data)

class ApprovalStepViewSet(viewsets.ModelViewSet):
    queryset = ApprovalStep.objects.all().order_by('approval_request', 'step_order')
    serializer_class = ApprovalStepSerializer
    permission_classes = [permissions.IsAuthenticated]
