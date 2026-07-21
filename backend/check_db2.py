from apps.base_setup.domain.models import ErpModule
from apps.tenants.domain.models import Tenant

print("Tenants:")
for t in Tenant.objects.all():
    print("-", t.id, t.name, t.domain_name)

print("\nErpModules grouped by tenant:")
from django.db.models import Count
for row in ErpModule.objects.values('tenant__name', 'tenant__id').annotate(count=Count('id')):
    print(row)
