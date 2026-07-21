import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
django.setup()

from apps.board.services.analytics import CommandCenterAnalyticsService

try:
    metrics = CommandCenterAnalyticsService.get_global_metrics()
    print("Metrics fetched successfully!")
except Exception as e:
    print(f"Error fetching metrics: {e}")
