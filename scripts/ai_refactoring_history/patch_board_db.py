import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from apps.core.domain.models import InstalledModule
count = InstalledModule.objects.filter(technical_name__in=['board', 'spreadsheet']).update(sequence=90, command_center_section='Productivity')
with open('../scratch/board_db_result.txt', 'w') as f:
    f.write(f'Updated {count} rows in DB.')
