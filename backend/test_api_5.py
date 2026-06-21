import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.core.domain.models import Partner
from apps.scm.domain.models import PurchaseOrder

print('Partners in DB:', Partner.objects.count())
print('Purchase Orders in DB:', PurchaseOrder.objects.count())
