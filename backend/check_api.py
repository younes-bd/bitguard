import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.users.domain.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken

u = CustomUser.objects.first()
token = str(RefreshToken.for_user(u).access_token)

headers = {
    'Authorization': f'Bearer {token}',
    'X-Tenant-ID': 'BitGuard'
}
resp = requests.get('http://localhost:8000/api/v1/base_setup/modules/', headers=headers)
print("Status:", resp.status_code)
try:
    data = resp.json()
    if 'results' in data:
        print("Count:", data['count'])
        print("First few:", [x['name'] for x in data['results'][:3]])
    else:
        print("Data:", data)
except Exception as e:
    print(e)
