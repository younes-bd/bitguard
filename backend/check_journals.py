import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
django.setup()

from apps.accounting.domain.models import AccountJournal
print("Count:", AccountJournal.objects.count())
