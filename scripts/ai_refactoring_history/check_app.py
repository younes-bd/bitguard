from apps.core.domain.models import InstalledModule
mods = InstalledModule.objects.filter(is_installed=True)
with open('../scratch/installed_apps.txt', 'w') as f:
    for m in mods:
        f.write(f'{m.technical_name}: {m.command_center_section} (app={m.application})\n')
