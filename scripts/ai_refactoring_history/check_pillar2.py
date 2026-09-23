from apps.core.domain.models import InstalledModule
mods = InstalledModule.objects.filter(technical_name__in=['documents', 'sign', 'esg', 'hr_expense'])
for m in mods:
    print(f'{m.technical_name}: {m.command_center_section} (seq: {m.sequence})')
