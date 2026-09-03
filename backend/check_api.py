import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from apps.system.domain.models import InstalledModule
from apps.system.api.serializers import ErpModuleSerializer
print(ErpModuleSerializer(InstalledModule.objects.first()).data.keys())
