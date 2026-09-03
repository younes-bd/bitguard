import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + '/../')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from apps.system.domain.models import InstalledModule
mods = InstalledModule.objects.filter(technical_name='ai_agent')
for mod in mods:
    mod.application = True
    mod.command_center_section = 'Administration'
    mod.is_installed = True
    mod.save()
    print('Updated ai_agent to application=True')
