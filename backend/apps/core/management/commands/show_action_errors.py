from django.core.management.base import BaseCommand
from apps.core.domain.models import ScheduledAction

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        self.stdout.write("=== LAST ERRORS OF ALL ACTIONS ===")
        for action in ScheduledAction.objects.all():
            if action.last_error:
                self.stdout.write(f"ID: {action.id}")
                self.stdout.write(f"Name: {action.name}")
                self.stdout.write(f"Model: {action.model_name}")
                self.stdout.write(f"Method: {action.method_name}")
                self.stdout.write(f"Error: {action.last_error}")
                self.stdout.write("-" * 40)
