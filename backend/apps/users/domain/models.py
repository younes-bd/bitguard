import uuid
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.core.domain.models import BaseModel, TenantAwareModel, UUIDModel
from django.contrib.contenttypes.models import ContentType

class Role(UUIDModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')
    permissions = models.JSONField(default=list, help_text="List of permission codes")
    category = models.CharField(max_length=100, blank=True, default='', help_text="e.g., Sales, Accounting, Human Resources")
    implied_ids = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='implied_by', help_text="Roles automatically granted with this role")

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return self.name

class RolePermission(BaseModel):
    role = models.ForeignKey('Role', on_delete=models.CASCADE, related_name='role_permissions')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, related_name='role_permissions')
    can_read   = models.BooleanField(default=False)
    can_write  = models.BooleanField(default=False)
    can_create = models.BooleanField(default=False)
    can_delete = models.BooleanField(default=False)

    class Meta:
        unique_together = ('role', 'content_type')
        verbose_name = 'Role Permission'

class RecordRule(BaseModel):
    name = models.CharField(max_length=255)
    role = models.ForeignKey('Role', on_delete=models.CASCADE, related_name='record_rules')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    domain_filter = models.JSONField(default=list, help_text="ORM-style filter list, e.g. [['user', '=', 'current_user']]")
    is_global = models.BooleanField(default=True, help_text="If False, only applies to this role")
    
    class Meta:
        verbose_name = 'Record Rule'

class User(AbstractUser, UUIDModel):
    email = models.EmailField(unique=True, default='')
    password = models.CharField(max_length=128, default='')
    username = models.CharField(max_length=150, unique=True, default='')
    first_name = models.CharField(max_length=150, blank=True, default='')
    last_name = models.CharField(max_length=150, blank=True, default='')
    
    user_type = models.CharField(
        max_length=20,
        choices=[('internal', 'Internal'), ('portal', 'Portal'), ('public', 'Public')],
        default='internal'
    )
    must_change_password = models.BooleanField(default=False)
    manager = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.SET_NULL, related_name='reports'
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    is_verified = models.BooleanField(default=False)
    
    mfa_enabled = models.BooleanField(default=False)
    mfa_secret = models.CharField(max_length=32, blank=True, null=True)
    
    is_locked = models.BooleanField(default=False)
    failed_login_attempts = models.IntegerField(default=0)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    
    roles = models.ManyToManyField(
        Role, 
        through='UserRole', 
        through_fields=('user', 'role'),
        related_name='users'
    )

    partner = models.OneToOneField('core.Partner', on_delete=models.CASCADE, null=True, blank=True, related_name='user')

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email

    @property
    def tenant(self):
        membership = self.tenant_memberships.filter(is_active=True).first()
        return membership.tenant if membership else None

class ApiKey(UUIDModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='api_keys')
    name = models.CharField(max_length=100)
    key = models.CharField(max_length=64, unique=True)
    last_used = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.user.email})"

class UserRole(UUIDModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'role')

class OTP(TenantAwareModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='otps')
    code = models.CharField(max_length=10)
    type = models.CharField(max_length=20, default='2fa') # '2fa', 'password_reset'
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"OTP for {self.user.email}"

class Device(TenantAwareModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='devices')
    name = models.CharField(max_length=255)
    fingerprint = models.CharField(max_length=255)
    is_trusted = models.BooleanField(default=False)
    last_login = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'fingerprint')

    def __str__(self):
        return f"{self.name} ({self.user.email})"

class LoginActivity(TenantAwareModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='login_activities')
    ip_address = models.GenericIPAddressField()
    user_agent = models.CharField(max_length=255)
    status = models.CharField(max_length=20) # 'success', 'failed', 'locked'
    
    class Meta:
        verbose_name_plural = 'Login Activities'

    def __str__(self):
        return f"{self.user.email} login {self.status} from {self.ip_address}"

class Connection(TenantAwareModel):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('blocked', 'Blocked'),
    ]
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='connections_sent')
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='connections_received')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    class Meta:
        unique_together = ('from_user', 'to_user')

    def __str__(self):
        return f"{self.from_user} -> {self.to_user} ({self.status})"

class SecurityPolicy(UUIDModel):
    tenant = models.OneToOneField('tenants.Tenant', on_delete=models.CASCADE, null=True, blank=True, related_name='security_policy')
    password_complexity = models.CharField(max_length=20, default='high')
    session_timeout = models.IntegerField(default=60) # Minutes
    mfa_required = models.BooleanField(default=True)
    api_key_rotation = models.IntegerField(default=90) # Days
    ip_whitelist = models.TextField(blank=True, help_text="Comma-separated CIDR ranges")
    failed_login_lock = models.IntegerField(default=5)
    lock_duration = models.IntegerField(default=30) # Minutes
    concurrent_sessions = models.CharField(max_length=20, default='1')

    class Meta:
        verbose_name = 'Security Policy'
        verbose_name_plural = 'Security Policies'

    def __str__(self):
        return f"Policy for {self.tenant.name if self.tenant else 'Global'}"

class TenantMembership(UUIDModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tenant_memberships')
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='memberships')
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('user', 'tenant')

    def __str__(self):
        return f"{self.user.email} -> {self.tenant.name}"

class ActiveSession(UUIDModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='active_sessions')
    refresh_token_jti = models.CharField(max_length=255, unique=True)
    device_name = models.CharField(max_length=255, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=500, blank=True)
    last_active = models.DateTimeField(auto_now=True)
    is_current = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-last_active']
