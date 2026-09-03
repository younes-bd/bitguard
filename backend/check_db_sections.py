from apps.system.domain.models import InstalledModule
for m in InstalledModule.objects.all():
    if m.application:
        print(f'{m.technical_name}: {m.command_center_section}')
