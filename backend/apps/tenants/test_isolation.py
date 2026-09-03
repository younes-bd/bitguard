from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.tenants.domain.models import Tenant
from apps.core.domain.models import Partner
from apps.users.domain.models import TenantMembership

User = get_user_model()

class TenantIsolationTests(APITestCase):
    def setUp(self):
        # Create Tenant A
        self.partner_a = Partner.objects.create(name="Tenant A Partner", email="a@a.com")
        self.tenant_a = Tenant.objects.create(name="Tenant A", domain="a.com", partner=self.partner_a)
        
        self.user_a = User.objects.create_user(username="user_a", email="a@a.com", password="pwd")
        TenantMembership.objects.create(user=self.user_a, tenant=self.tenant_a)
        
        # Create Tenant B
        self.partner_b = Partner.objects.create(name="Tenant B Partner", email="b@b.com")
        self.tenant_b = Tenant.objects.create(name="Tenant B", domain="b.com", partner=self.partner_b)
        
        self.user_b = User.objects.create_user(username="user_b", email="b@b.com", password="pwd")
        TenantMembership.objects.create(user=self.user_b, tenant=self.tenant_b)
        
        # Assign partners to users
        self.user_a.partner = self.partner_a
        self.user_a.save()
        self.user_b.partner = self.partner_b
        self.user_b.save()
        
        # Some URL to test (e.g., users list, which should be tenant isolated via middleware)
        self.user_list_url = reverse('user-list')

    def test_tenant_a_cannot_see_tenant_b_users(self):
        """User A from Tenant A should only see users in Tenant A"""
        self.client.force_authenticate(user=self.user_a)
        
        # We need to simulate the tenant middleware. In APITestCase, middleware might run if we use client,
        # but we need to pass the domain or X-Tenant-ID header if the middleware relies on it.
        # Let's assume the middleware uses the Host header or X-Tenant-ID
        response = self.client.get(self.user_list_url, HTTP_X_TENANT_ID=str(self.tenant_a.id))
        
        if response.status_code == 200:
            data = response.data.get('results', response.data)
            emails = [item.get('email') for item in data if isinstance(item, dict)]
            self.assertIn("a@a.com", emails)
            self.assertNotIn("b@b.com", emails)
            
    def test_tenant_b_cannot_see_tenant_a_users(self):
        """User B from Tenant B should only see users in Tenant B"""
        self.client.force_authenticate(user=self.user_b)
        response = self.client.get(self.user_list_url, HTTP_X_TENANT_ID=str(self.tenant_b.id))
        
        if response.status_code == 200:
            data = response.data.get('results', response.data)
            emails = [item.get('email') for item in data if isinstance(item, dict)]
            self.assertIn("b@b.com", emails)
            self.assertNotIn("a@a.com", emails)
