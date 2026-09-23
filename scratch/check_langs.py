import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from apps.system.domain.models import Language
print(list(Language.objects.values('name', 'code')))
