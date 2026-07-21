from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from apps.users.domain.models import Role
from apps.tenants.domain.models import Tenant

User = get_user_model()

class PermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(name="Test Tenant", schema_name="test_tenant")
        
        # Create roles
        self.super_admin_role = Role.objects.create(name='SUPER_ADMIN')
        self.tenant_admin_role = Role.objects.create(name='TENANT_ADMIN')
        self.employee_role = Role.objects.create(name='EMPLOYEE')
        
        # Create users
        self.superuser = User.objects.create_superuser('super@test.com', 'pass', tenant=self.tenant)
        self.superuser.roles.add(self.super_admin_role)
        
        self.tenant_admin = User.objects.create_user('admin@test.com', 'pass', tenant=self.tenant)
        self.tenant_admin.roles.add(self.tenant_admin_role)
        
        self.employee = User.objects.create_user('emp@test.com', 'pass', tenant=self.tenant)
        self.employee.roles.add(self.employee_role)

    def test_tenant_admin_can_view_roles(self):
        self.client.force_authenticate(user=self.tenant_admin)
        response = self.client.get(reverse('role-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.json()['success'])

    def test_tenant_admin_can_create_role(self):
        self.client.force_authenticate(user=self.tenant_admin)
        response = self.client.post(reverse('role-list'), {'name': 'CUSTOM_ROLE', 'description': 'Test'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_employee_cannot_create_role(self):
        self.client.force_authenticate(user=self.employee)
        response = self.client.post(reverse('role-list'), {'name': 'BAD_ROLE', 'description': 'Test'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
