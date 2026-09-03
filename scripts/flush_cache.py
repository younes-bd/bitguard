import os
import sys
sys.path.append(os.path.join(os.getcwd(), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
import django
django.setup()
from django.core.cache import cache
cache.clear()
print('Cache cleared!')
