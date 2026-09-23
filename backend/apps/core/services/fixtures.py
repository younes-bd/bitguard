import uuid
from apps.core.domain.models import CommandCenterSection, InstalledModule
from django.db import transaction

# Tier-1 Master ERP Pillars (Sequence strictly dictates rendering order)
MASTER_PILLARS = [
    ("Sales", 10),
    ("Services", 20),
    ("Accounting", 30),
    ("Inventory", 40),
    ("Manufacturing", 50),
    ("Website", 60),
    ("Marketing", 70),
    ("Human Resources", 80),
    ("Discuss", 85),
    ("Productivity", 90),
    ("Administration", 100),
    ("Other", 999)
]

# Absolute Kernel Modules that are protected and always installed
KERNEL_MODULES = [
    'core', 'system', 'auth', 'tenants', 'apps', 'users', 'automation', 'reports', 'inbox'
]

def seed_master_sections(tenant):
    """
    Deterministically seeds the Master ERP Pillars for a given tenant.
    Never uses lazy get_or_create with arbitrary fallback sequences.
    """
    for name, seq in MASTER_PILLARS:
        # We manually update or create to enforce strict tier-1 sequencing
        section = CommandCenterSection.objects.filter(tenant=tenant, name=name).first()
        if section:
            section.sequence = seq
            section.is_deleted = False
            section.save(update_fields=['sequence', 'is_deleted'])
        else:
            CommandCenterSection.objects.create(
                tenant=tenant,
                name=name,
                sequence=seq,
            )

@transaction.atomic
def bootstrap_tenant(tenant):
    """
    The Master Entrypoint for initializing a pristine Tier-1 ERP tenant.
    Runs fixtures, then syncs the App Store catalog.
    """
    # 1. Seed Fixtures
    seed_master_sections(tenant)
    
    # 2. Discover App Store Modules
    from apps.core.services.modules import sync_modules
    sync_modules(tenant)
    
    # 3. Force-install Kernel Modules
    InstalledModule.objects.filter(
        tenant=tenant, 
        technical_name__in=KERNEL_MODULES
    ).update(is_installed=True)
