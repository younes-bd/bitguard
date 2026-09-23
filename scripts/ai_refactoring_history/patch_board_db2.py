from apps.core.domain.models import InstalledModule
count = InstalledModule.objects.filter(technical_name__in=['board', 'spreadsheet']).update(sequence=90, command_center_section='Productivity')
print(f'UPDATED {count} ROWS TO Productivity')
