import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from apps.system.domain.models import InstalledModule
categories = InstalledModule.objects.values_list('category', flat=True).distinct()
print('Categories:', list(categories))
for c in categories:
    count = InstalledModule.objects.filter(category=c).count()
    print(f'{c}: {count}')
