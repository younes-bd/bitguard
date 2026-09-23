import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.system.domain.models import InstalledModule

KERNEL_MODULES = ['core', 'system', 'auth', 'tenants', 'automation', 'apps', 'users']

# Force install all kernel modules for all tenants
modules = InstalledModule.objects.filter(technical_name__in=KERNEL_MODULES)
count = 0
for mod in modules:
    if not mod.is_installed:
        mod.is_installed = True
        mod.save(update_fields=['is_installed'])
        count += 1
        print(f'Restored {mod.technical_name} for tenant {mod.tenant}')

print(f'Total restored: {count}')
