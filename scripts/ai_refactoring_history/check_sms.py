from apps.system.domain.models import InstalledModule
m = InstalledModule.objects.filter(technical_name='sms').first()
print(f'SMS Module: application={m.application}, section={m.command_center_section}') if m else print('SMS not found')
