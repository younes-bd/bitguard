import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()
user = User.objects.first()
print(f"Testing as user: {user.email} (superuser: {user.is_superuser})")
c = APIClient()
c.force_authenticate(user=user)
resp = c.get('/api/v1/iam/roles/')
print("Roles status:", resp.status_code)
print("Roles response:", resp.json() if resp.status_code == 200 else resp.content)
