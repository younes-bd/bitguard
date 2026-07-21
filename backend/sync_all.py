from apps.base_setup.services.modules import sync_modules
from apps.tenants.domain.models import Tenant

for t in Tenant.objects.all():
    print(f"Syncing for {t.name} (id: {t.id})...")
    sync_modules(t)

print("Done syncing all tenants.")
