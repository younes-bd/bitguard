from rest_framework import viewsets, permissions, status, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from ..domain.models import ServiceCategory, ServiceItem, ServiceRequest
from .serializers import ServiceCategorySerializer, ServiceItemSerializer, ServiceRequestSerializer
from ..application.services import ITSMService

# class ProblemViewSet(viewsets.ModelViewSet):
#     queryset = Problem.objects.all().order_by('-created_at')
#     serializer_class = ProblemSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     @action(detail=True, methods=['post'])
#     def resolve(self, request, pk=None):
#         problem = self.get_object()
#         permanent_fix = request.data.get('permanent_fix')
#         if not permanent_fix:
#             return Response({"error": "Permanent fix details are required to resolve a problem."}, status=status.HTTP_400_BAD_REQUEST)
        
#         problem.status = 'resolved'
#         problem.permanent_fix = permanent_fix
#         problem.save()
#         return Response(self.get_serializer(problem).data)

# class ChangeRequestViewSet(viewsets.ModelViewSet):
#     queryset = ChangeRequest.objects.all().order_by('-created_at')
#     serializer_class = ChangeRequestSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def perform_create(self, serializer):
#         serializer.save(requester=self.request.user)

#     @action(detail=True, methods=['post'])
#     def submit(self, request, pk=None):
#         cr = self.get_object()
#         updated_cr = ITSMService.submit_change(cr)
#         return Response(self.get_serializer(updated_cr).data)

#     @action(detail=True, methods=['post'])
#     def approve(self, request, pk=None):
#         cr = self.get_object()
#         updated_cr = ITSMService.approve_change(cr, request.user)
#         return Response(self.get_serializer(updated_cr).data)

#     @action(detail=True, methods=['post'])
#     def reject(self, request, pk=None):
#         cr = self.get_object()
#         updated_cr = ITSMService.reject_change(cr, request.user)
#         return Response(self.get_serializer(updated_cr).data)

#     @action(detail=True, methods=['post'])
#     def start_work(self, request, pk=None):
#         cr = self.get_object()
#         updated_cr = ITSMService.progress_change(cr)
#         return Response(self.get_serializer(updated_cr).data)

#     @action(detail=True, methods=['post'])
#     def complete(self, request, pk=None):
#         cr = self.get_object()
#         updated_cr = ITSMService.complete_change(cr)
#         return Response(self.get_serializer(updated_cr).data)

#     @action(detail=True, methods=['post'])
#     def fail(self, request, pk=None):
#         cr = self.get_object()
#         updated_cr = ITSMService.fail_change(cr)
#         return Response(self.get_serializer(updated_cr).data)

#     @action(detail=True, methods=['post'])
#     def rollback(self, request, pk=None):
#         cr = self.get_object()
#         updated_cr = ITSMService.rollback_change(cr)
#         return Response(self.get_serializer(updated_cr).data)

# class ChangeTaskViewSet(viewsets.ModelViewSet):
#     queryset = ChangeTask.objects.all().order_by('change_request', 'created_at')
#     serializer_class = ChangeTaskSerializer
#     permission_classes = [permissions.IsAuthenticated]

class ServiceItemViewSet(viewsets.ModelViewSet):
    queryset = ServiceItem.objects.all().order_by('category', 'name')
    serializer_class = ServiceItemSerializer
    
    # Permissions: Only Staff/Tenant Admins can create/edit. Everyone authenticated can read.
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active', 'pricing_type', 'visibility']
    search_fields = ['name', 'description', 'sku', 'tags']
    ordering_fields = ['name', 'base_price', 'sort_order', 'created_at']

    def get_queryset(self):
        qs = super().get_queryset()
        tenant = ITSMService.get_tenant_context(self.request)
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        tenant = ITSMService.get_tenant_context(self.request)
        serializer.save(tenant=tenant)

class ServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequest.objects.all().order_by('-created_at')
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'urgency', 'impact', 'department_code']
    search_fields = ['service_item__name', 'requester__username', 'requester__email']
    ordering_fields = ['created_at', 'due_date', 'urgency', 'status']

    def get_queryset(self):
        qs = super().get_queryset()
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
        if not (request.user.is_staff or service_request.service_item.service_owner == request.user):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        updated = ITSMService.approve_service_request(service_request, request.user, request)
        return Response(self.get_serializer(updated).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        service_request = self.get_object()
        if not (request.user.is_staff or service_request.service_item.service_owner == request.user):
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        updated = ITSMService.reject_service_request(service_request, request.user, request)
        return Response(self.get_serializer(updated).data)

class ServiceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceCategory.objects.filter(is_active=True).order_by('sort_order')
    serializer_class = ServiceCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        tenant = ITSMService.get_tenant_context(self.request)
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

