import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + '/../')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from apps.system.domain.models import InstalledModule
from apps.users.domain.models import User

user = User.objects.first()
tenant = user.tenant

mod = InstalledModule.objects.filter(tenant=tenant, technical_name='ai_agent').first()
if mod:
    print(f'AI Agent found! is_installed: {mod.is_installed}')
else:
    print('AI Agent NOT FOUND in InstalledModule for the tenant!')
