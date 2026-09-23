from apps.core.domain.models import InstalledModule
count = InstalledModule.objects.filter(technical_name='iot').update(sequence=90, command_center_section='Productivity')
print(f'UPDATED {count} ROWS TO Productivity')
