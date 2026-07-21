import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()
user = User.objects.filter(is_superuser=True).first()
if not user:
    print("No superuser found!")
    sys.exit(1)

print(f"Testing as user: {user.email}")
c = APIClient()
c.force_authenticate(user=user)

roles_resp = c.get('/api/v1/iam/roles/')
print("Roles status:", roles_resp.status_code)
print("Roles response:", roles_resp.json() if roles_resp.status_code == 200 else roles_resp.content)

settings_resp = c.get('/api/v1/base_setup/settings/')
print("Settings status:", settings_resp.status_code)
print("Settings response:", settings_resp.json() if settings_resp.status_code == 200 else settings_resp.content)
