from django.core.management.base import BaseCommand
from apps.core.domain.models import ScheduledAction
from django.apps import apps
import traceback


class Command(BaseCommand):
    help = 'Debug a failing scheduled action run'

    def handle(self, *args, **kwargs):
        self.stdout.write('\n=== ALL SCHEDULED ACTIONS ===')
        for a in ScheduledAction.objects.all():
            self.stdout.write(f'  ID: {a.id}')
            self.stdout.write(f'  Name: {a.name}')
            self.stdout.write(f'  Model: {a.model_name!r}')
            self.stdout.write(f'  Method: {a.method_name!r}')
            self.stdout.write(f'  Active: {a.is_active}')
            self.stdout.write(f'  Last Error: {(a.last_error or "None")[:300]}')
            self.stdout.write('')

        self.stdout.write('\n=== SIMULATING run() FOR EACH ACTION ===')
        for action in ScheduledAction.objects.all():
            self.stdout.write(f'\n--- Action: {action.name} ({action.id}) ---')
            try:
                parts = action.model_name.split('.')
                if len(parts) != 2:
                    self.stdout.write(self.style.ERROR(
                        f'  [FAIL] model_name must be "app_label.ModelName", got: {action.model_name!r}'
                    ))
                    continue

                app_label, model_name = parts
                try:
                    model_class = apps.get_model(app_label, model_name)
                    self.stdout.write(self.style.SUCCESS(f'  [OK] Model resolved: {model_class}'))
                except LookupError as e:
                    self.stdout.write(self.style.ERROR(f'  [FAIL] Model not found: {e}'))
                    continue

                method = getattr(model_class.objects, action.method_name, None)
                if not method:
                    method = getattr(model_class, action.method_name, None)

                if method:
                    self.stdout.write(self.style.SUCCESS(f'  [OK] Method resolved: {method}'))
                else:
                    # Show available methods to help diagnose
                    mgr_methods = [m for m in dir(model_class.objects) if not m.startswith('_')]
                    self.stdout.write(self.style.ERROR(
                        f'  [FAIL] Method {action.method_name!r} NOT found on {model_class.__name__}'
                    ))
                    self.stdout.write(f'  Available manager methods: {mgr_methods}')

            except Exception as e:
                self.stdout.write(self.style.ERROR(f'  [EXCEPTION] {e}'))
                self.stdout.write(traceback.format_exc())

        self.stdout.write('\n=== DONE ===')
