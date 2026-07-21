import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from apps.tenants.domain.models import Tenant

User = get_user_model()
u = User.objects.first()
if not u:
    print("No user found!")
else:
    token = str(RefreshToken.for_user(u).access_token)

    for tenant_name in ['BitGuard', 'BitGuard Demo Corp', 'E2E Test Corp']:
        print(f"\n--- API Call for Tenant: {tenant_name} ---")
        headers = {
            'Authorization': f'Bearer {token}',
            'X-Tenant-ID': tenant_name
        }
        resp = requests.get('http://localhost:8000/api/v1/base_setup/modules/', headers=headers)
        print("Status:", resp.status_code)
        try:
            data = resp.json()
            if 'results' in data:
                print("Count:", data['count'])
            else:
                print("Data:", data)
        except Exception as e:
            print("Error parsing JSON:", e)
