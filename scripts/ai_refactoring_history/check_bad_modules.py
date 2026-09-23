from apps.core.domain.models import InstalledModule
golden = ['Saless', 'Services', 'Accounting & Finance', 'Inventory', 'Manufacturing', 'Website', 'Journeys', 'Human Resources', 'Productivity', 'Administration']
mods = InstalledModule.objects.exclude(command_center_section__in=golden)
for m in mods:
    print(f'{m.technical_name}: {m.command_center_section}')
