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
print('User:', user.email, 'Tenant:', tenant.name)

refresh = RefreshToken.for_user(user)
access_token = str(refresh.access_token)

client = Client(HTTP_X_TENANT_ID=str(tenant.id), HTTP_AUTHORIZATION=f'Bearer {access_token}')

for endpoint in ['/api/reporting/templates/', '/api/scm/vendors/', '/api/scm/inventory/', '/api/scm/purchase-orders/', '/api/scm/dashboard/']:
    res = client.get(endpoint)
    print(f'\\nEndpoint: {endpoint}')
    print(f'Status: {res.status_code}')
    if res.status_code != 200:
        print(f'Content: {res.content.decode()}')

