import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from apps.tenants.domain.models import Tenant
from apps.system.services.modules import sync_modules

tenant = Tenant.objects.first()
print("Starting manual sync for tenant:", tenant.name)
try:
    count = sync_modules(tenant)
    print("Count:", count)
except Exception as e:
    print("Error:", e)
