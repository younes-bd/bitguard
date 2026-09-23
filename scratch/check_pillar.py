import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from apps.system.domain.models import InstalledModule
mods = InstalledModule.objects.filter(technical_name__in=['documents', 'sign', 'esg', 'hr_expense'])
for m in mods:
    print(f'{m.technical_name}: sequence {m.sequence}')
