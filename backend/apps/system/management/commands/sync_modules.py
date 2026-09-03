from django.core.management.base import BaseCommand
from apps.system.services.modules import sync_modules
from apps.tenants.domain.models import Tenant

class Command(BaseCommand):
    help = 'Scans all app __manifest__.py files and syncs them to the InstalledModule registry for all tenants.'

    def handle(self, *args, **options):
        tenants = Tenant.objects.all()
        if not tenants.exists():
            self.stdout.write(self.style.WARNING('No tenants found. Create a tenant first.'))
            return
        
        for tenant in tenants:
            count = sync_modules(tenant)
            self.stdout.write(self.style.SUCCESS(f'Synced {count} modules for tenant: {tenant.name}'))
