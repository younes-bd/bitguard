import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.test import Client
from apps.users.domain.models import User
import json

c = Client()
user = User.objects.filter(is_superuser=True).first()
if not user:
    print("No superuser found.")
    exit()

c.force_login(user)
print("Testing with BitGuard tenant (internal)")
res = c.get('/api/dashboard/metrics/', HTTP_X_TENANT_ID='cfc72aac-52e3-44fb-847c-5041cbd1bda2')
print("Status:", res.status_code)
try:
    print(json.dumps(res.json(), indent=2)[:500])
except:
    print(res.content)

print("\nTesting with Demo Corp tenant")
res2 = c.get('/api/dashboard/metrics/', HTTP_X_TENANT_ID='0aff5946-c015-4cc6-9d06-416cdf204651')
print("Status:", res2.status_code)
try:
    print(json.dumps(res2.json(), indent=2)[:500])
except:
    print(res2.content)
