from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.tenants.models import Tenant
from .models import AuditLog

User = get_user_model()

class AuditLogTest(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(name="Audit Tenant", domain="audit.bitguard.local")
        self.user = User.objects.create_user(username="auditor", password="password", email="auditor@test.com")

    def test_log_creation(self):
        """Verify that audit logs can be created and persisted."""
        log = AuditLog.objects.create(
            tenant=self.tenant,
            user=self.user,
            action='login',
            resource_type='User',
            resource_id=str(self.user.id),
            details={'method': 'mfa_totp'},
            ip_address='127.0.0.1'
        )
        
        self.assertEqual(AuditLog.objects.count(), 1)
        retrieved = AuditLog.objects.first()
        self.assertEqual(retrieved.action, 'login')
        self.assertEqual(retrieved.details['method'], 'mfa_totp')
