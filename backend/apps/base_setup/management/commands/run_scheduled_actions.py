import traceback
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.core.domain.models import ScheduledAction
from django.apps import apps
from dateutil.relativedelta import relativedelta

class Command(BaseCommand):
    help = 'Executes scheduled actions (Cron Jobs) that are due to run.'

    def handle(self, *args, **options):
        now = timezone.now()
        actions = ScheduledAction.objects.filter(
            is_active=True,
            next_run__lte=now
        ) | ScheduledAction.objects.filter(
            is_active=True,
            next_run__isnull=True
        )

        if not actions.exists():
            self.stdout.write(self.style.SUCCESS(f"No scheduled actions due at {now}"))
            return

        for action in actions:
            self.stdout.write(f"Executing: {action.name} (ID: {action.id})")
            
            try:
                # Resolve model
                app_label, model_name = action.model_name.split('.')
                model_class = apps.get_model(app_label, model_name)
                
                # Execute method
                method = getattr(model_class.objects, action.method_name, None)
                if not method:
                    method = getattr(model_class, action.method_name, None)
                
                if not method:
                    raise AttributeError(f"Method '{action.method_name}' not found on model '{action.model_name}'")
                
                # Call method
                method()
                
                # Update tracking fields
                action.last_run = timezone.now()
                action.last_error = ''
                
                # Calculate next run
                if action.interval_type == 'minutes':
                    delta = relativedelta(minutes=action.interval_number)
                elif action.interval_type == 'hours':
                    delta = relativedelta(hours=action.interval_number)
                elif action.interval_type == 'days':
                    delta = relativedelta(days=action.interval_number)
                elif action.interval_type == 'weeks':
                    delta = relativedelta(weeks=action.interval_number)
                elif action.interval_type == 'months':
                    delta = relativedelta(months=action.interval_number)
                else:
                    delta = relativedelta(days=action.interval_number)
                
                action.next_run = timezone.now() + delta
                action.save()
                
                self.stdout.write(self.style.SUCCESS(f"Successfully executed: {action.name}"))
                
            except Exception as e:
                error_msg = f"Error executing {action.name}: {str(e)}\n{traceback.format_exc()}"
                self.stderr.write(self.style.ERROR(error_msg))
                action.last_run = timezone.now()
                action.last_error = error_msg
                action.save()
