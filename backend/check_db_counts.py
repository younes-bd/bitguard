import os
import django
import sys

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.accounting.domain.models import Currency
from apps.core.domain.models import Country, State

print(f"Total Currencies: {Currency.objects.count()}")
print(f"Total Countries: {Country.objects.count()}")
print(f"Total States: {State.objects.count()}")

import zoneinfo
timezones = list(zoneinfo.available_timezones())
print(f"Total Timezones: {len(timezones)}")
