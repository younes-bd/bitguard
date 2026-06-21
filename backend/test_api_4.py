import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.test import Client
from apps.users.domain.models import User
from apps.tenants.models import Tenant
from rest_framework_simplejwt.tokens import RefreshToken

tenant = Tenant.objects.first()
user = User.objects.filter(tenant_memberships__tenant=tenant).first()
refresh = RefreshToken.for_user(user)
client = Client(HTTP_X_TENANT_ID=str(tenant.id), HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
res1 = client.get('/api/scm/vendors/')
print('Vendors:', len(res1.json().get('results', res1.json())))
res2 = client.get('/api/scm/purchase-orders/')
print('POs:', len(res2.json().get('results', res2.json())))
