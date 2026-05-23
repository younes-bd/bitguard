from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import ChangeRequest, ChangeTask, Problem, ServiceItem, ServiceRequest
from .serializers import ChangeRequestSerializer, ChangeTaskSerializer, ProblemSerializer, ServiceItemSerializer, ServiceRequestSerializer
from .services import ITSMService

class ProblemViewSet(viewsets.ModelViewSet):
    queryset = Problem.objects.all().order_by('-created_at')
    serializer_class = ProblemSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        problem = self.get_object()
        permanent_fix = request.data.get('permanent_fix')
        if not permanent_fix:
            return Response({"error": "Permanent fix details are required to resolve a problem."}, status=status.HTTP_400_BAD_REQUEST)
        
        problem.status = 'resolved'
        problem.permanent_fix = permanent_fix
        problem.save()
        return Response(self.get_serializer(problem).data)

class ChangeRequestViewSet(viewsets.ModelViewSet):
    queryset = ChangeRequest.objects.all().order_by('-created_at')
    serializer_class = ChangeRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(requester=self.request.user)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        cr = self.get_object()
        updated_cr = ITSMService.submit_change(cr)
        return Response(self.get_serializer(updated_cr).data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        cr = self.get_object()
        updated_cr = ITSMService.approve_change(cr, request.user)
        return Response(self.get_serializer(updated_cr).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        cr = self.get_object()
        updated_cr = ITSMService.reject_change(cr, request.user)
        return Response(self.get_serializer(updated_cr).data)

    @action(detail=True, methods=['post'])
    def start_work(self, request, pk=None):
        cr = self.get_object()
        updated_cr = ITSMService.progress_change(cr)
        return Response(self.get_serializer(updated_cr).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        cr = self.get_object()
        updated_cr = ITSMService.complete_change(cr)
        return Response(self.get_serializer(updated_cr).data)

    @action(detail=True, methods=['post'])
    def fail(self, request, pk=None):
        cr = self.get_object()
        updated_cr = ITSMService.fail_change(cr)
        return Response(self.get_serializer(updated_cr).data)

    @action(detail=True, methods=['post'])
    def rollback(self, request, pk=None):
        cr = self.get_object()
        updated_cr = ITSMService.rollback_change(cr)
        return Response(self.get_serializer(updated_cr).data)

class ChangeTaskViewSet(viewsets.ModelViewSet):
    queryset = ChangeTask.objects.all().order_by('change_request', 'created_at')
    serializer_class = ChangeTaskSerializer
    permission_classes = [permissions.IsAuthenticated]

class ServiceItemViewSet(viewsets.ModelViewSet):
    queryset = ServiceItem.objects.all().order_by('category', 'name')
    serializer_class = ServiceItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        tenant = ITSMService.get_tenant_context(self.request)
        return qs.filter(tenant=tenant, is_active=True)

    def perform_create(self, serializer):
        tenant = ITSMService.get_tenant_context(self.request)
        serializer.save(tenant=tenant)

class ServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequest.objects.all().order_by('-created_at')
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        tenant = ITSMService.get_tenant_context(self.request)
        qs = qs.filter(tenant=tenant)
        user = self.request.user
        if not user.is_staff and not getattr(user, 'is_tenant_admin', False):
            qs = qs.filter(requester=user)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        service_item = serializer.validated_data.get('service_item')
        form_data = serializer.validated_data.get('form_data', {})
        
        service_request = ITSMService.create_service_request(
            service_item=service_item,
            requester=request.user,
            form_data=form_data,
            request=request
        )
        
        return Response(self.get_serializer(service_request).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        service_request = self.get_object()
        updated = ITSMService.approve_service_request(service_request, request.user, request)
        return Response(self.get_serializer(updated).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        service_request = self.get_object()
        updated = ITSMService.reject_service_request(service_request, request.user, request)
        return Response(self.get_serializer(updated).data)

