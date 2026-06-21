import os
import django
from django.core.management import call_command

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
    django.setup()

    print("--- Applying database migrations ---")
    call_command('makemigrations')
    call_command('migrate')

    print("--- Checking Internal Tenant ---")
    internal_tenant_uuid = "cfc72aac-52e3-44fb-847c-5041cbd1bda2"
    from apps.tenants.models import Tenant
    tenant, created = Tenant.objects.get_or_create(
        domain=internal_tenant_uuid,
        defaults={
            'name': 'BitGuard Internal System',
            'subscription_plan': 'enterprise',
            'is_active': True
        }
    )
    if created:
        print(f"Created missing internal tenant: {tenant.name} ({internal_tenant_uuid})")
    else:
        print(f"Internal tenant already exists: {tenant.name} ({internal_tenant_uuid})")

    print("\n--- Seeding Enterprise Data ---")
    call_command('seed_enterprise_data')

    print("\nSUCCESS! All tables are created and data has been seeded.")
