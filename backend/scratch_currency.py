import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.accounting.domain.models import Currency

with open('currency_audit.txt', 'w') as f:
    f.write(f"Total Currencies: {Currency.objects.count()}\n")
    for c in Currency.objects.all()[:5]:
        f.write(f"Currency: {c.name}, Tenant: {c.tenant_id}\n")
