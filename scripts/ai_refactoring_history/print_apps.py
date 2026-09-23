import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
from django.conf import settings
print(settings.INSTALLED_APPS)
