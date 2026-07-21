import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()
from django.test import Client
from apps.users.domain.models import User
c = Client()
u = User.objects.get(email='admin@bitguard.tech')
c.force_login(u)
res = c.get('/api/v1/iam/roles/')
print('ROLES STATUS:', res.status_code)
print('ROLES DATA:', res.json())
res2 = c.get('/api/v1/iam/role-permissions/matrix/')
print('MATRIX STATUS:', res2.status_code)
try:
    print('MATRIX DATA:', res2.json())
except Exception as e:
    print('MATRIX ERR:', e)
