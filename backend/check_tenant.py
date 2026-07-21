import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.tenants.domain.models import Tenant
from apps.base_setup.domain.models import ErpModule

t = Tenant.objects.filter(name__iexact='BitGuard').first()
if not t:
    print("BitGuard tenant not found!")
else:
    print("BitGuard tenant found:", t.id)
    count = ErpModule.objects.filter(tenant=t).count()
    print("ErpModules for BitGuard:", count)
