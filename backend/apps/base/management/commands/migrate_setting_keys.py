from django.core.management.base import BaseCommand
from apps.base.domain.models import SystemParameter

class Command(BaseCommand):
    help = 'Migrates legacy setting keys (e.g., crm_lead_scoring) to dot notation (crm.lead_scoring)'

    def handle(self, *args, **options):
        # We define the mappings from old to new explicitly to avoid accidental renames
        mappings = {
            'crm_lead_scoring': 'crm.lead_scoring',
            'crm_auto_assign': 'crm.auto_assign',
            'crm_pipeline_stages': 'crm.pipeline_stages',
            'crm_email_alias': 'crm.email_alias',
            'crm_activity_reminders': 'crm.activity_reminders',
            # You can add more mappings here for other apps as they get migrated
        }

        updated_count = 0
        for old_key, new_key in mappings.items():
            params = SystemParameter.objects.filter(key=old_key)
            for param in params:
                param.key = new_key
                param.save()
                updated_count += 1
                self.stdout.write(self.style.SUCCESS(f'Migrated: {old_key} -> {new_key}'))

        self.stdout.write(self.style.SUCCESS(f'Successfully migrated {updated_count} legacy settings keys.'))
