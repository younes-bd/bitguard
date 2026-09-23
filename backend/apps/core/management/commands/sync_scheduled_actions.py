from django.core.management.base import BaseCommand
from apps.core.domain.models import ScheduledAction
from apps.core.registry import get_registered_scheduled_actions

class Command(BaseCommand):
    help = 'Syncs scheduled actions from apps.py blueprints to the database'

    def handle(self, *args, **options):
        actions = get_registered_scheduled_actions()
        for action in actions:
            # We don't overwrite user-modified fields like is_active or interval if the record exists
            obj, created = ScheduledAction.objects.get_or_create(
                blueprint_key=action['key'],
                defaults={
                    'name': action['title'],
                    'model_name': action['model_name'],
                    'method_name': action['method_name'],
                    'interval_number': action.get('interval_number', 1),
                    'interval_type': action.get('interval_type', 'days'),
                    'is_active': False  # Default to False like Odoo until a user toggles it
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created scheduled action: {action['title']}"))
            else:
                # Always ensure model_name and method_name stay perfectly bound to the blueprint
                obj.model_name = action['model_name']
                obj.method_name = action['method_name']
                obj.save(update_fields=['model_name', 'method_name'])
                self.stdout.write(self.style.WARNING(f"Updated scheduled action core bindings: {action['title']}"))