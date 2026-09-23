import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from apps.system.domain.models import InstalledModule

mods = InstalledModule.objects.filter(technical_name__in=['documents', 'sign', 'esg', 'hr_expense'])
count = mods.update(sequence=30)
print(f'Updated {count} modules to sequence 30 (Finance).')

from apps.system.domain.models import CommandCenterSection
for m in mods:
    print(f'Moved {m.technical_name} to Finance')
