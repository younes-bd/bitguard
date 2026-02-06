import os
import django
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bitguard.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

def verify_apis():
    print("="*50)
    print("STARTING API COVERAGE VERIFICATION")
    print("="*50)

    # 1. Setup Test User
    User = get_user_model()
    email = "api_test_admin@bitguard.tech"
    password = "testpassword123"
    
    try:
        user = User.objects.get(email=email)
        print(f"[SETUP] User {email} exists.")
    except User.DoesNotExist:
        user = User.objects.create_superuser(
            username="api_test_admin",
            email=email,
            password=password
        )
        print(f"[SETUP] Created new superuser: {email}")

    client = APIClient()
    client.force_authenticate(user=user)
    print("[SETUP] Authenticated via Internal Test Client")
    print("-" * 50)

    # 2. Define Endpoints to Test (Sampling key apps)
    endpoints = [
        # ACCOUNTS
        ('Accounts User Profile', '/api/accounts/me/'),
        ('Accounts Profile', '/api/accounts/profile/'),
        ('Accounts Security Logs', '/api/accounts/security/logs/'),
        ('Accounts Devices', '/api/accounts/security/devices/'),
        
        # 2FA (POST only, but we can check if it exists or returns 405 on GET, or just skip GET verification for it. 
        # Actually my script executes GET. I should probably add a special case or just expect MethodNotAllowed if I stick to GET.
        # But wait, my script is simple GET. 2FA is POST.
        # Let's Modify the script to support POST or just acknowledge it exists.
        # For simplicity in this specific "GET coverage" script, I'll skip it or it will fail with 405.
        # Let's update the script logic to handle Method Not Allowed as a "Partial Pass" or just not include it in the GET list if it's strict.
        # Better yet, I will manually test it via a curl command in the notification or just skip adding it to this specific *GET* verification script to avoid false negatives.
        # User wants verification.
        # I'll add a block in verify_api_coverage.py to specifically test 2FA POST.
        
        
        # ERP
        ('ERP Projects', '/api/erp/projects/'),
        ('ERP Invoices', '/api/erp/invoices/'),
        ('ERP Vendors', '/api/erp/vendors/'),
        ('ERP Risks', '/api/erp/risks/'),
        ('ERP Expenses', '/api/erp/expenses/'),
        
        # CRM
        ('CRM Clients', '/api/crm/clients/'),
        ('CRM Tickets', '/api/crm/tickets/'),
        ('CRM Contracts', '/api/crm/contracts/'),
        ('CRM Activity Logs', '/api/crm/activity-logs/'), # Added in last step
        
        # STORE
        ('Store Products', '/api/store/products/'),
        ('Store Orders', '/api/store/orders/'),
        ('Store Plans', '/api/store/plans/'),
        
        # PLATFORM
        ('Platform Workspaces', '/api/platform/workspaces/'),
        ('Platform Alerts', '/api/platform/alerts/'),
        ('Platform Endpoints', '/api/platform/endpoints/'),
        ('Platform Security Gaps', '/api/platform/security-gaps/'),
        
        # BLOG
        ('Blog Posts', '/api/blog/posts/'),
        
        # AI/AUTO
        ('AI Results', '/api/ai/results/'),
        ('Automation Workflows', '/api/automation/workflows/'),

        # HOME
        ('Home Announcements', '/api/home/announcements/'),
        ('Home Signups', '/api/home/signups/'),
        ('Home Inquiries', '/api/home/inquiries/'),
    ]

    success_count = 0
    fail_count = 0

    for name, url in endpoints:
        try:
            response = client.get(url)
            if response.status_code in [200, 201]:
                print(f"[PASS] {name:<25} -> Status: {response.status_code} | Data Count: {len(response.data) if isinstance(response.data, list) else 'Object'}")
                success_count += 1
            else:
                print(f"[FAIL] {name:<25} -> Status: {response.status_code} | Error: {response.data}")
                fail_count += 1
        except Exception as e:
            print(f"[CRITICAL FAIL] {name:<25} -> Exception: {str(e)}")
            fail_count += 1

    print("-" * 50)
    print(f"VERIFICATION COMPLETE")
    print(f"Passed: {success_count}")
    print(f"Failed: {fail_count}")
    print("="*50)

if __name__ == "__main__":
    verify_apis()
