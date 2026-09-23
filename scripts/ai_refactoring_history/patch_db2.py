from apps.core.domain.models import InstalledModule
count = InstalledModule.objects.filter(technical_name__in=['documents', 'sign', 'esg', 'hr_expense']).update(command_center_section='Accounting & Finance')
print(f'UPDATED {count} ROWS TO Accounting & Finance')
