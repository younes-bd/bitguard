import os
import django
import sys

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.core.domain.models import Country, State
from apps.accounting.domain.models import Currency

print('DB Countries:', Country.all_objects.count())
print('DB States:', State.all_objects.count())
print('DB Currencies:', Currency.all_objects.count())
