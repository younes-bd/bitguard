import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from apps.system.domain.models import InstalledModule
from apps.system.api.serializers import ErpModuleSerializer
mods = InstalledModule.objects.all()
print(f'Total modules: {mods.count()}')
print('Sample module:')
print(ErpModuleSerializer(mods.first()).data)
print('CRM module:')
print(ErpModuleSerializer(mods.filter(technical_name='crm').first()).data)
