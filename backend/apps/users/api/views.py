from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from apps.core.utils.response import standard_response
from apps.core.permissions import HasRole, IsSuperAdmin
from ..domain.models import User, Role, SecurityPolicy
from ..api.serializers import UserSerializer, RoleSerializer, SecurityPolicySerializer

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated, IsSuperAdmin | HasRole(['SUPER_ADMIN'])]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return standard_response(True, "Roles retrieved successfully", {"roles": serializer.data})

    @action(detail=False, methods=['get'])
    def permissions(self, request):
        # Aligned with frontend RoleEditor expectations
        perms = [
            {"id": 1, "code": "view_dashboard", "name": "View Dashboard", "product": "Core", "description": "Access to main system metrics"},
            {"id": 2, "code": "manage_users", "name": "Manage Users", "product": "IAM", "description": "Create, update and delete users"},
            {"id": 3, "code": "manage_roles", "name": "Manage Roles", "product": "IAM", "description": "Configure RBAC roles and permissions"},
            {"id": 4, "code": "view_audit_logs", "name": "View Audit Logs", "product": "IAM", "description": "Access security event archive"},
            {"id": 5, "code": "manage_billing", "name": "Manage Billing", "product": "Commerce", "description": "Manage subscriptions and invoices"},
            {"id": 6, "code": "manage_support", "name": "Manage Support", "product": "Customer", "description": "Handle support tickets and escalations"},
        ]
        return standard_response(True, "Permissions retrieved", perms)

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.roles.filter(name='SUPER_ADMIN').exists():
            return User.objects.all().order_by('-date_joined')
        if user.roles.filter(name='TENANT_ADMIN').exists():
            return User.objects.filter(tenant=user.tenant).order_by('-date_joined')
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

    @action(detail=True, methods=['post'])
    def lock(self, request, pk=None):
        from apps.core.services.audit import AuditService
        user = self.get_object()
        user.is_locked = True
        user.save()
        AuditService.log_action(request, action="ACCOUNT_LOCK", resource=f"users.User:{user.pk}")
        return standard_response(True, f"Account {user.email} has been locked.")

    @action(detail=True, methods=['post'])
    def unlock(self, request, pk=None):
        from apps.core.services.audit import AuditService
        user = self.get_object()
        user.is_locked = False
        user.failed_login_attempts = 0
        user.save()
        AuditService.log_action(request, action="ACCOUNT_UNLOCK", resource=f"users.User:{user.pk}")
        return standard_response(True, f"Account {user.email} has been unlocked.")

    # --- MFA Endpoints ---
    @action(detail=False, methods=['post'])
    def mfa_setup(self, request):
        import pyotp
        user = request.user
        if not user.mfa_secret:
            user.mfa_secret = pyotp.random_base32()
            user.save()
        
        totp = pyotp.TOTP(user.mfa_secret)
        provisioning_uri = totp.provisioning_uri(name=user.email, issuer_name="BitGuard")
        
        return standard_response(True, "MFA Setup initiated", {
            "secret": user.mfa_secret,
            "qr_uri": provisioning_uri
        })

    @action(detail=False, methods=['post'])
    def mfa_verify(self, request):
        import pyotp
        from apps.core.services.audit import AuditService
        user = request.user
        token = request.data.get('token')
        totp = pyotp.TOTP(user.mfa_secret)
        
        if totp.verify(token):
            user.mfa_enabled = True
            user.save()
            AuditService.log_action(request, action="MFA_ENABLED", resource=f"users.User:{user.pk}")
            return standard_response(True, "MFA enabled successfully")
        
        AuditService.log_action(request, action="MFA_VERIFY_FAILURE", resource=f"users.User:{user.pk}")
        return standard_response(False, "Invalid verification token", status=400)

    # --- API Key Endpoints ---
    @action(detail=False, methods=['get', 'post'])
    def api_keys(self, request):
        from ..domain.models import ApiKey
        import secrets
        
        if request.method == 'GET':
            keys = ApiKey.objects.filter(user=request.user)
            return standard_response(True, "API Keys retrieved", [{"id": k.id, "name": k.name, "key_prefix": k.key[:8] + "...", "last_used": k.last_used} for k in keys])
        
        name = request.data.get('name', 'Default Key')
        raw_key = secrets.token_urlsafe(32)
        ApiKey.objects.create(user=request.user, name=name, key=raw_key)
        return standard_response(True, "API Key created", {"name": name, "key": raw_key})

    @action(detail=False, methods=['delete'], url_path='api_keys/(?P<key_id>[^/.]+)')
    def delete_api_key(self, request, key_id=None):
        from ..domain.models import ApiKey
        ApiKey.objects.filter(user=request.user, id=key_id).delete()
        return standard_response(True, "API Key revoked")

    @action(detail=False, methods=['get'])
    def stats(self, request):
        qs = self.get_queryset()
        stats = {
            "total_users": qs.count(),
            "active_users": qs.filter(is_active=True).count(),
            "locked_users": qs.filter(is_locked=True).count(),
            "mfa_adoption": qs.filter(mfa_enabled=True).count(),
            "admin_count": qs.filter(roles__name__in=['SUPER_ADMIN', 'TENANT_ADMIN']).distinct().count(),
        }
        return standard_response(True, "IAM Stats retrieved", stats)

    @action(detail=False, methods=['get'])
    def policy(self, request):
        tenant = getattr(request.user, 'tenant', None)
        policy, created = SecurityPolicy.objects.get_or_create(tenant=tenant)
        serializer = SecurityPolicySerializer(policy)
        return standard_response(True, "Security Policy retrieved", serializer.data)

    @action(detail=False, methods=['post'])
    def update_policy(self, request):
        from apps.core.services.audit import AuditService
        tenant = getattr(request.user, 'tenant', None)
        policy, created = SecurityPolicy.objects.get_or_create(tenant=tenant)
        serializer = SecurityPolicySerializer(policy, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        AuditService.log_action(request, action="POLICY_UPDATE", resource="users.SecurityPolicy", payload=request.data)
        return standard_response(True, "Security Policy updated successfully", serializer.data)

    @action(detail=False, methods=['get'])
    def sessions(self, request):
        # In a real big-tech scenario, this would query a Redis session store or 
        # a Session model that tracks active tokens.
        # For BitGuard, we'll return the current session as a live record 
        # and simulated recent sessions if no session tracking model exists.
        import socket
        active_sessions = [
            {
                "id": "current",
                "device": request.META.get('HTTP_USER_AGENT', 'Unknown Device'),
                "ip": request.META.get('REMOTE_ADDR', '127.0.0.1'),
                "location": "Authorized Origin",
                "last_active": "Active Now",
                "is_current": True,
                "type": "desktop" if "Windows" in request.META.get('HTTP_USER_AGENT', '') else "mobile"
            }
        ]
        return standard_response(True, "Active sessions retrieved", active_sessions)