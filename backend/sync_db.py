from apps.base_setup.services.modules import sync_modules
from apps.base_setup.domain.models import ErpModule
from apps.tenants.domain.models import Tenant

t = Tenant.objects.first()
count = sync_modules(t)
print('Synced', count, 'modules.')
print('Count:', ErpModule.objects.count())
