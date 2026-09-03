import os
import sys
import django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
django.setup()
from django.core.cache import cache
cache.clear()
print('Cache cleared successfully!')
