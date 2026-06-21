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

endpoints = [
    '/api/edms/documents/',
    '/api/edms/folders/',
    '/api/edms/templates/',
    '/api/crm/deals/',
    '/api/itsm/tickets/',
]

for endpoint in endpoints:
    res = client.get(endpoint)
    print(f'{endpoint}: Status {res.status_code}')
    if res.status_code == 500:
        print(f'ERROR: {res.content}')
