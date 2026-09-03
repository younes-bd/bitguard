from apps.system.domain.models import InstalledModule
from apps.users.domain.models import User
tenant = User.objects.first().tenant
mod = InstalledModule.objects.filter(tenant=tenant, technical_name='ai_agent').first()
if mod:
    print(f'is_installed: {mod.is_installed}')
    if not mod.is_installed:
        mod.is_installed = True
        mod.save()
        print('Forced to True')
else:
    print('NOT FOUND')
    InstalledModule.objects.create(
        tenant=tenant, 
        technical_name='ai_agent',
        name='AI Agent',
        is_installed=True,
        application=True,
        command_center_section='Administration',
        sequence=98
    )
    print('Created and set to True')
