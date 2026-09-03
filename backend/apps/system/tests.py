from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.system.domain.models import SystemSetting
from apps.core.domain.models import AuditTrail
from apps.tenants.domain.models import Tenant
from apps.users.domain.models import TenantMembership

User = get_user_model()

class SysadminAPITests(APITestCase):
    def setUp(self):
        # Create tenant
        self.tenant = Tenant.objects.create(name="Platform Admin Tenant", domain="admin_tenant")
        
        # Create users
        self.admin_user = User.objects.create_superuser(
            email="platformadmin@bitguard.tech",
            username="platformadmin",
            password="adminpassword"
        )
        TenantMembership.objects.create(user=self.admin_user, tenant=self.tenant)

        self.regular_user = User.objects.create_user(
            email="employee@bitguard.tech",
            username="employee",
            password="employeepassword"
        )
        TenantMembership.objects.create(user=self.regular_user, tenant=self.tenant)

        # Seed initial setting
        self.setting = SystemSetting.objects.create(
            tenant=self.tenant,
            key="company_name",
            value="BitGuard Corp",
            setting_type="string",
            is_public=True
        )
        
        self.private_setting = SystemSetting.objects.create(
            tenant=self.tenant,
            key="smtp_password",
            value="super_secret_smtp_pass",
            setting_type="string",
            is_public=False
        )

        # URLs
        self.settings_list_url = reverse('settings-setting-list')
        self.metrics_url = reverse('settings-setting-metrics')
        self.clear_cache_url = reverse('settings-setting-clear-cache')
        self.sync_indexes_url = reverse('settings-setting-sync-indexes')
        self.toggle_maintenance_url = reverse('settings-setting-toggle-maintenance')
        self.batch_update_url = reverse('settings-setting-batch-update')
        self.generate_report_url = reverse('settings-setting-generate-report')
        self.audit_list_url = reverse('settings-audit-list')
        self.export_csv_url = reverse('settings-audit-export-csv')

    def test_settings_public_access(self):
        """Unauthenticated / regular users should only see public settings."""
        # Unauthenticated
        response = self.client.get(self.settings_list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Authenticated regular user
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(self.settings_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify only public settings are returned
        data_list = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        keys = [item['key'] for item in data_list]
        self.assertIn("company_name", keys)
        self.assertNotIn("smtp_password", keys)

    def test_settings_admin_access(self):
        """Platform admins should see all settings (public & private)."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.settings_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data_list = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        keys = [item['key'] for item in data_list]
        self.assertIn("company_name", keys)
        self.assertIn("smtp_password", keys)

    def test_batch_update_settings(self):
        """Admins can bulk update multiple settings at once."""
        self.client.force_authenticate(user=self.admin_user)
        payload = {
            "settings": {
                "company_name": "New BitGuard",
                "default_currency": "EUR"
            }
        }
        response = self.client.post(self.batch_update_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check DB
        self.assertEqual(SystemSetting.objects.get(key="company_name").value, "New BitGuard")
        self.assertEqual(SystemSetting.objects.get(key="default_currency").value, "EUR")

        # Verify audit logging
        self.assertTrue(AuditTrail.objects.filter(resource_type="SystemSetting", resource_id="company_name").exists())

    def test_system_metrics(self):
        """Admins can fetch system telemetry/metrics."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.metrics_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("active_users", response.data)
        self.assertIn("cpu_load", response.data)

    def test_toggle_maintenance_mode(self):
        """Admins can toggle maintenance mode."""
        self.client.force_authenticate(user=self.admin_user)
        
        # Initially toggle
        response = self.client.post(self.toggle_maintenance_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Maintenance mode is now true", response.data['status'])
        
        # Verify it can toggle back
        response = self.client.post(self.toggle_maintenance_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Maintenance mode is now false", response.data['status'])

    def test_generate_report(self):
        """Admins can generate system health status reports."""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.generate_report_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'text/plain')
        self.assertIn(b"BITGUARD PLATFORM STATUS REPORT", response.content)

    def test_audit_logs_csv_export(self):
        """Admins can export global audit logs in CSV format."""
        # Create an audit event first
        AuditTrail.objects.create(
            tenant=self.tenant,
            user=self.admin_user,
            action="update",
            resource_type="Invoice",
            resource_id="123",
            ip_address="127.0.0.1",
            details={"message": "Invoice 123 updated"}
        )

        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.export_csv_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'text/csv')
        self.assertIn(b"Timestamp,User,Action,Resource,IP Address,Details", response.content)
        self.assertIn(b"Invoice", response.content)
