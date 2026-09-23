import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.system.domain.models import CommandCenterSection
from apps.tenants.domain.models import Tenant

MENU_SEQUENCE = ['Overview', 'Sales', 'Discuss', 'Services', 'Finance', 'Inventory & MRP', 'Human Resources', 'Marketing', 'Intelligence', 'Website', 'Productivity', 'Administration', 'Other']

tenants = list(Tenant.objects.all()) or [None]

for t in tenants:
    for idx, name in enumerate(MENU_SEQUENCE):
        CommandCenterSection.objects.update_or_create(
            tenant=t,
            name=name,
            defaults={'sequence': (idx + 1) * 10}
        )

print('Successfully seeded CommandCenterSection weights!')
