import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.system.domain.models import InstalledModule
for m in InstalledModule.objects.filter(technical_name__in=['board', 'whatsapp', 'livechat']):
    print(f'App: {m.technical_name} | Section: {m.command_center_section} | Display: {m.display_name}')
