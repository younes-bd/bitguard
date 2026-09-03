from apps.system.domain.models import InstalledModule
count = InstalledModule.objects.update(is_installed=True)
print(f'Set {count} modules to is_installed=True.')
