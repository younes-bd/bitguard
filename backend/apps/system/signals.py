from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from apps.base.domain.models import InstalledModule
from apps.base.domain.models import CommandCenterSection

def sync_tenant_sections(tenant):
    if not tenant:
        return

    active_pillars = set(
        InstalledModule.objects.filter(
            tenant=tenant, 
            is_installed=True, 
            application=True
        ).exclude(command_center_section='')
        .values_list('command_center_section', flat=True)
    )
    
    CommandCenterSection.objects.filter(tenant=tenant).exclude(name__in=active_pillars).delete()
    
    existing_pillars = set(CommandCenterSection.objects.filter(tenant=tenant).values_list('name', flat=True))
    for pillar in (active_pillars - existing_pillars):
        CommandCenterSection.objects.create(tenant=tenant, name=pillar, sequence=99)

@receiver(post_save, sender=InstalledModule)
def handle_module_save(sender, instance, **kwargs):
    sync_tenant_sections(instance.tenant)

@receiver(post_delete, sender=InstalledModule)
def handle_module_delete(sender, instance, **kwargs):
    sync_tenant_sections(instance.tenant)
