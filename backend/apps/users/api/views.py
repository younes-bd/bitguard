from apps.core.api.mixins import TenantScopedMixin
from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from apps.core.utils.response import standard_response
from apps.core.permissions import HasRole, IsSuperAdmin, IsPlatformAdmin
from django.contrib.contenttypes.models import ContentType
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from ..domain.models import User, Role, SecurityPolicy, RolePermission, RecordRule
from ..api.serializers import (
    UserSerializer, RoleSerializer, SecurityPolicySerializer,
    RolePermissionSerializer, ContentTypeSerializer, RecordRuleSerializer
)

class RoleViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = RoleSerializer
    permission_classes = [IsPlatformAdmin]

    def get_queryset(self):
        from django.db.models import Count
        return Role.objects.annotate(user_count=Count('users')).order_by('category', 'name')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return standard_response(True, "Roles retrieved successfully", {"roles": serializer.data})

    @action(detail=True, methods=['get'])
    def users(self, request, pk=None):
        role = self.get_object()
        users = role.users.all()
        serializer = UserSerializer(users, many=True)
        return standard_response(True, "Users retrieved", serializer.data)

    @action(detail=True, methods=['post'])
    def assign_users(self, request, pk=None):
        role = self.get_object()
        user_ids = request.data.get('user_ids', [])
        # Set the users for this role
        users = User.objects.filter(id__in=user_ids)
        role.users.set(users)
        return standard_response(True, "Users assigned successfully")

    @action(detail=False, methods=['get'])
    def permissions(self, request):
        from django.contrib.auth.models import Permission
        from django.contrib.contenttypes.models import ContentType
        perms = Permission.objects.select_related('content_type').all()
        data = [{
            'id': p.id,
            'codename': p.codename,
            'name': p.name,
            'app_label': p.content_type.app_label,
            'model': p.content_type.model,
        } for p in perms]
        return Response(data)

class UserViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.roles.filter(name='SUPER_ADMIN').exists():
            qs = User.objects.all().order_by('-date_joined')
        elif user.roles.filter(name='TENANT_ADMIN').exists():
            qs = User.objects.filter(tenant=user.tenant).order_by('-date_joined')
        else:
            qs = User.objects.filter(id=user.id)
            
        user_type = self.request.query_params.get('user_type')
        status_param = self.request.query_params.get('status')
        
        if status_param == 'pending':
            qs = qs.filter(is_active=True, last_login__isnull=True, must_change_password=True)
            return qs
            
        if user_type == 'archived':
            return qs.filter(is_active=False)
        elif user_type in ['internal', 'portal', 'public']:
            return qs.filter(is_active=True, user_type=user_type)
        return qs.filter(is_active=True)

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

    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def invite(self, request):
        from ..application.services import IdentityService
        email = request.data.get('email')
        if not email:
            return Response({'detail': 'Email is required'}, status=400)
            
        success, msg, user = IdentityService.invite_user(
            request, email, 
            request.data.get('first_name', ''), 
            request.data.get('last_name', ''), 
            request.data.get('role_ids', []), 
            request.data.get('user_type', 'internal')
        )
        if not success:
            return Response({'detail': msg}, status=400)
        return Response({'detail': msg, 'user_id': str(user.id)}, status=201)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def reset_password(self, request, pk=None):
        user = self.get_object()
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_url = f"{settings.FRONTEND_URL}/auth/set-password/{uid}/{token}/"
        
        send_mail(
            subject="Password Reset Request",
            message=f"Click here to reset your password: {reset_url}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )
        return Response({'detail': f'Reset link sent to {user.email}'})

    @action(detail=False, methods=['get'], url_path='invitations', permission_classes=[IsAdminUser])
    def list_invitations(self, request):
        qs = self.get_queryset().filter(is_active=True, last_login__isnull=True, must_change_password=True)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='invitations/(?P<invitation_id>[^/.]+)/resend', permission_classes=[IsAdminUser])
    def resend_invitation(self, request, invitation_id=None):
        user = get_object_or_404(User, pk=invitation_id)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        invite_url = f"{settings.FRONTEND_URL}/auth/set-password/{uid}/{token}/"
        
        tenant_name = getattr(user, 'tenant', None)
        tenant_name = tenant_name.name if tenant_name else 'our platform'

        send_mail(
            subject=f"You've been invited to {tenant_name}",
            message=f"Click here to set your password and activate your account: {invite_url}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )
        return Response({'detail': f'Invitation resent to {user.email}'})

    @action(detail=False, methods=['delete'], url_path='invitations/(?P<invitation_id>[^/.]+)', permission_classes=[IsAdminUser])
    def revoke_invitation(self, request, invitation_id=None):
        user = get_object_or_404(User, pk=invitation_id)
        user.delete()
        return Response(status=204)

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

    @action(detail=False, methods=['get', 'patch'], parser_classes=[MultiPartParser, FormParser, JSONParser])
    def me(self, request):
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return standard_response(True, "Current user retrieved", serializer.data)
        
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return standard_response(True, "Profile updated successfully", serializer.data)

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

    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
    
        if not user.check_password(current_password):
            return standard_response(False, "Incorrect current password", status=400)
    
        user.set_password(new_password)
        user.save()
    
        # Optionally log out other sessions here
        return standard_response(True, "Password updated successfully")

    @action(detail=False, methods=['get'])
    def activity(self, request):
        from apps.core.domain.models import AuditTrail
        from apps.system.api.serializers import AuditTrailSerializer
        
        logs = AuditTrail.objects.filter(user=request.user).order_by('-created_at')[:20]
        serializer = AuditTrailSerializer(logs, many=True)
        return standard_response(True, "User activity retrieved", serializer.data)

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
        from django.db.models import Count
        tenant = getattr(request.user, 'tenant', None)
        if not tenant:
            return Response({'total_users': 0, 'active_users': 0, 'mfa_adoption_pct': 0.0, 'admin_count': 0})
        qs = self.get_queryset()
        total = qs.count()
        active = qs.filter(is_active=True).count()
        mfa_enabled = qs.filter(mfa_enabled=True).count() if hasattr(qs.model, 'mfa_enabled') else 0
        admin_count = qs.filter(is_staff=True).count()
        return Response({
            'total_users': total,
            'active_users': active,
            'mfa_adoption_pct': round((mfa_enabled / total * 100) if total else 0, 1),
            'admin_count': admin_count,
        })

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
        try:
            from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
            tokens = OutstandingToken.objects.filter(
                user=request.user
            ).exclude(blacklistedtoken__isnull=False).order_by('-created_at')
            
            data = [{
                'id': str(t.id),
                'jti': t.jti,
                'created_at': t.created_at,
                'expires_at': t.expires_at,
                'last_used': t.created_at,
            } for t in tokens]
            return Response(data)
        except Exception:
            return Response([])

    @action(detail=False, methods=['delete'], url_path='sessions/(?P<session_jti>[^/.]+)')
    def revoke_session(self, request, session_jti=None):
        try:
            from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
            token = OutstandingToken.objects.get(jti=session_jti, user=request.user)
            BlacklistedToken.objects.get_or_create(token=token)
            return Response({'detail': 'Session revoked'})
        except Exception:
            return Response({'detail': 'Session not found'}, status=404)

class RolePermissionViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = RolePermission.objects.all()
    serializer_class = RolePermissionSerializer
    permission_classes = [IsPlatformAdmin]
    
    @action(detail=False, methods=['get'])
    def matrix(self, request):
        qs = self.get_queryset()
        serializer = self.get_serializer(qs, many=True)
        matrix_data = {}
        for item in serializer.data:
            role_id = str(item['role'])
            ct_id = str(item['content_type'])
            if role_id not in matrix_data:
                matrix_data[role_id] = {'permissions': {}}
            matrix_data[role_id]['permissions'][ct_id] = {
                'can_read': item['can_read'],
                'can_write': item['can_write'],
                'can_create': item['can_create'],
                'can_delete': item['can_delete'],
            }
        return standard_response(True, "Permission Matrix", matrix_data)

class ContentTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ContentType.objects.all()
    serializer_class = ContentTypeSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        # Grouping by app_label to match expected format
        from collections import defaultdict
        grouped = defaultdict(list)
        for item in serializer.data:
            grouped[item['app_label']].append(item)
        return standard_response(True, "Content Types", dict(grouped))

class RecordRuleViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = RecordRule.objects.all()
    serializer_class = RecordRuleSerializer
    permission_classes = [IsPlatformAdmin]

class SecurityPolicyViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    queryset = SecurityPolicy.objects.all().order_by('id')
    serializer_class = SecurityPolicySerializer
    permission_classes = [IsPlatformAdmin]
