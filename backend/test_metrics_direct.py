import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.dashboard.services.analytics import CommandCenterAnalyticsService
from apps.tenants.models import Tenant

try:
    demo_tenant = Tenant.objects.get(id='0aff5946-c015-4cc6-9d06-416cdf204651')
    metrics = CommandCenterAnalyticsService.get_global_metrics(tenant=demo_tenant)
    print("DEMO TENANT METRICS:")
    print(metrics)
except Exception as e:
    print("Error:", e)

try:
    internal_tenant = Tenant.objects.get(id='cfc72aac-52e3-44fb-847c-5041cbd1bda2')
    metrics2 = CommandCenterAnalyticsService.get_global_metrics(tenant=internal_tenant)
    print("\nINTERNAL TENANT METRICS:")
    print(metrics2)
except Exception as e:
    print("Error:", e)
