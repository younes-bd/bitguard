from apps.core.domain.models import InstalledModule
sections = InstalledModule.objects.values_list('command_center_section', flat=True).distinct()
with open('../scratch/pillars.txt', 'w') as f:
    f.write('\n'.join(sections))
