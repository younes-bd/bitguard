from apps.core.domain.models import InstalledModule
for m in InstalledModule.objects.filter(technical_name__in=['discuss', 'whatsapp']):
    print(f'{m.technical_name}: {m.command_center_section}')
