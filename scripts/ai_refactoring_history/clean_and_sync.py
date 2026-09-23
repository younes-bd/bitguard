from apps.system.domain.models import InstalledModule
from apps.tenants.domain.models import Tenant

InstalledModule.objects.all().delete()
print('Deleted all old modules.')
