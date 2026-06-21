import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.crm.domain.models import Client
print("Clients:")
for c in Client.objects.all():
    print(c.name, c.tenant_id)
