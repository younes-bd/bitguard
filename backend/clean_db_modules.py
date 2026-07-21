import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.base_setup.domain.models import ErpModule
deleted, _ = ErpModule.objects.filter(technical_name__startswith='__').delete()
print(f"Deleted {deleted} invalid modules from DB.")
