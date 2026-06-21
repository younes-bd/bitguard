import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.crm.domain.models import Client
print('Clients:', Client.objects.count())

from apps.tenants.models import Tenant
tenant = Tenant.objects.get(id='cfc72aac-52e3-44fb-847c-5041cbd1bda2')
print("Clients for tenant:", Client.objects.filter(tenant=tenant).count())
