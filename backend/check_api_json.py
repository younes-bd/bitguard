import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()
u = User.objects.first()
token = str(RefreshToken.for_user(u).access_token)
headers = {
    'Authorization': f'Bearer {token}',
    'X-Tenant-ID': 'BitGuard'
}
resp = requests.get('http://localhost:8000/api/v1/base_setup/modules/', headers=headers)
import json
print(json.dumps(resp.json(), indent=2)[:500])
