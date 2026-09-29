import os
import django
import sys

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client
from apps.users.domain.models import User
from apps.tenants.domain.models import Tenant

c = Client()
user = User.objects.first()
tenant = Tenant.objects.first()
user.tenant = tenant
user.save()

c.force_login(user)

response = c.get('/api/v1/core/states/?country=27976738-c560-4741-a765-4541d506198b', HTTP_X_TENANT_ID=str(tenant.id))
print("STATUS:", response.status_code)
print("CONTENT:", response.content)
