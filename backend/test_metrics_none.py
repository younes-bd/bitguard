import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.board.services.analytics import CommandCenterAnalyticsService

try:
    metrics = CommandCenterAnalyticsService.get_global_metrics(tenant=None)
    print("GLOBAL METRICS (tenant=None):")
    print(metrics)
except Exception as e:
    print("Error:", e)
