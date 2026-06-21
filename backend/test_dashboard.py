import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

import logging
logging.basicConfig(level=logging.WARNING)

from apps.dashboard.services.analytics import CommandCenterAnalyticsService
from apps.tenants.models import Tenant

tenant_id = 'cfc72aac-52e3-44fb-847c-5041cbd1bda2'
try:
    tenant = Tenant.objects.get(id=tenant_id)
    print("Found tenant:", tenant)
    print("--- TENANT METRICS ---")
    print(CommandCenterAnalyticsService.get_global_metrics(tenant=tenant))
except Exception as e:
    print("Error:", e)
