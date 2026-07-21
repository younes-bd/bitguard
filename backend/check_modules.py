from apps.base_setup.domain.models import ErpModule
from apps.tenants.domain.models import Tenant

print("Total modules:", ErpModule.objects.count())

print("\nTenants:")
for t in Tenant.objects.all():
    print(t.id, t.name)
    print("  Modules:", ErpModule.objects.filter(tenant=t).count())
