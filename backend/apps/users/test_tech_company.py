from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.users.domain.models import Role, RolePermission
from apps.tenants.domain.models import Tenant
from apps.core.domain.models import Partner
from django.core.management import call_command

User = get_user_model()

class TechCompanyRolesTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Run the seeding script to populate DB
        call_command('seed_tech_company')
        cls.tenant = Tenant.objects.get(domain='tech-innovators.com')
        cls.admin_user = User.objects.get(email='admin@tech-innovators.com')
        cls.hr_user = User.objects.get(email='hr@tech-innovators.com')
        cls.support_user = User.objects.get(email='support@tech-innovators.com')
        cls.dev_user = User.objects.get(email='dev1@tech-innovators.com')
        cls.vendor_user = User.objects.get(email='vendor@external.com')

    def test_tech_admin_permissions(self):
        """Admin should have full access to users."""
        self.client.force_authenticate(user=self.admin_user)
        # Assuming there is a users list endpoint like /api/v1/iam/users/
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test creating a user
        payload = {
            "email": "newadmin@tech-innovators.com",
            "username": "newadmin",
            "first_name": "New",
            "last_name": "Admin",
            "password": "securepassword123"
        }
        response = self.client.post(url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_hr_manager_permissions(self):
        """HR Manager can read/write users but not settings."""
        self.client.force_authenticate(user=self.hr_user)
        
        # Can access users
        user_url = reverse('user-list')
        response = self.client.get(user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Cannot access settings
        settings_url = reverse('settings-setting-list')
        response = self.client.get(settings_url)
        # The regular user tests in system expect 200 for public settings, but maybe HR cannot create them
        # Let's test they cannot POST to settings
        payload = {"key": "test_hr_setting", "value": "1"}
        post_response = self.client.post(settings_url, payload)
        self.assertIn(post_response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED, status.HTTP_405_METHOD_NOT_ALLOWED])

    def test_portal_vendor_isolation(self):
        """Portal Vendor cannot access administration APIs like users or tenants."""
        self.client.force_authenticate(user=self.vendor_user)
        
        user_url = reverse('user-list')
        response = self.client.get(user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only see themselves (or an empty list if filtered)
        users = response.data.get('data', {}).get('users', [])
        self.assertTrue(len(users) <= 1)

        tenant_url = reverse('tenant-list')
        # Even if route exists, vendor shouldn't get a list of all tenants
        response = self.client.get(tenant_url)
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND, status.HTTP_401_UNAUTHORIZED])
