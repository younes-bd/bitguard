from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from apps.core.utils.response import standard_response
from apps.core.permissions import HasRole, IsSuperAdmin
from .models import User, Role
from .serializers import UserSerializer, RoleSerializer

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin | HasRole(['SUPER_ADMIN'])]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return standard_response(True, "Roles retrieved successfully", {"roles": serializer.data})

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.roles.filter(name='SUPER_ADMIN').exists():
            return User.objects.all()
        # Tenant admins can only see users of their tenant
        if user.roles.filter(name='TENANT_ADMIN').exists():
            return User.objects.filter(tenant=user.tenant)
        # Normal users can only see themselves
        return User.objects.filter(id=user.id)

    def perform_create(self, serializer):
        tenant = getattr(self.request.user, 'tenant', None)
        if tenant and not self.request.user.is_superuser:
            serializer.save(tenant=tenant)
        else:
            serializer.save()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return standard_response(True, "Users retrieved", {"users": serializer.data})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return standard_response(True, "User created", serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return standard_response(True, "User updated", serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return standard_response(True, "User deleted successfully", status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return standard_response(True, "Current user retrieved", serializer.data)