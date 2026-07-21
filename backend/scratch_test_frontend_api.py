import os
import django
from django.urls import reverse

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.test.client import Client
from apps.users.domain.models import User
from apps.tenants.domain.models import Tenant

def audit_frontend_apis():
    print("=== STARTING FRONTEND API CONTRACT AUDIT ===")
    
    tenant, _ = Tenant.objects.get_or_create(domain='bitguard.test', defaults={'name': 'BitGuard Test'})
    user, _ = User.objects.get_or_create(email='admin@bitguard.test', defaults={'username': 'admin', 'is_superuser': True})
    
    client = Client()
    client.force_login(user)
    
    # Base Setup URLs mapping from settingsService.js
    base_endpoints = [
        ('GET', '/api/v1/base_setup/settings/', 'System Settings List'),
        ('GET', '/api/v1/base_setup/audit-logs/', 'Audit Logs List'),
        ('GET', '/api/v1/base_setup/api-keys/', 'API Keys List'),
        ('GET', '/api/v1/base_setup/webhooks/', 'Webhooks List'),
        ('GET', '/api/v1/base_setup/languages/', 'Languages List'),
        ('GET', '/api/v1/base_setup/scheduled-actions/', 'Scheduled Actions List'),
        ('GET', '/api/v1/base_setup/mail-servers-outgoing/', 'Outgoing Mail Servers List'),
        ('GET', '/api/v1/base_setup/mail-servers-incoming/', 'Incoming Mail Servers List'),
        ('GET', '/api/v1/base_setup/email-templates/', 'Email Templates List'),
        ('GET', '/api/v1/base_setup/modules/', 'ERP Modules List'),
    ]
    
    # IAM URLs mapping from iamService.js
    iam_endpoints = [
        ('GET', '/api/v1/iam/users/', 'IAM Users List'),
        ('GET', '/api/v1/iam/roles/', 'IAM Roles List'),
        ('GET', '/api/v1/iam/record-rules/', 'Record Rules List'),
        ('GET', '/api/v1/iam/security-policy/', 'Security Policy Details'),
    ]
    
    endpoints = base_endpoints + iam_endpoints
    failed = 0
    passed = 0
    
    for method, path, name in endpoints:
        response = getattr(client, method.lower())(path)
        if response.status_code in [200, 201, 204]:
            print(f"[PASS] {name} -> {method} {path} (Status: {response.status_code})")
            passed += 1
        else:
            print(f"[FAIL] {name} -> {method} {path} (Status: {response.status_code} - {response.content.decode('utf-8')})")
            failed += 1
            
    print(f"\n=== AUDIT RESULTS: {passed} PASSED, {failed} FAILED ===")

if __name__ == "__main__":
    audit_frontend_apis()
