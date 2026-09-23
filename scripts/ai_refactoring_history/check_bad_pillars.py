from apps.core.domain.models import InstalledModule
mods = InstalledModule.objects.filter(command_center_section__in=['Finance', 'Chat', 'Inventory & MRP', 'Intelligence'])
for m in mods:
    print(f'{m.technical_name}: {m.command_center_section}')
