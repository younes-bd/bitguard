import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from apps.core.domain.models import InstalledModule
count = InstalledModule.objects.filter(technical_name__in=['documents', 'sign', 'esg', 'hr_expense']).update(sequence=30)
with open('../scratch/db_result.txt', 'w') as f:
    f.write(f'Updated {count} rows in DB.')
