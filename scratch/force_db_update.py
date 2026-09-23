import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
import sys
sys.path.append(os.path.join(os.getcwd(), 'backend'))
os.chdir('backend')
django.setup()

from apps.system.domain.models import InstalledModule
count = InstalledModule.objects.filter(technical_name__in=['documents', 'sign', 'esg', 'hr_expense']).update(sequence=30)
with open('../scratch/db_result.txt', 'w') as f:
    f.write(f'Updated {count} rows in DB.')
