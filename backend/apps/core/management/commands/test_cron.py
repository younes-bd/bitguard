from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.core.domain.models import ScheduledAction
from apps.core.tasks import run_due_scheduled_actions
import logging

class Command(BaseCommand):
    help = 'Test the ScheduledAction engine'

    def handle(self, *args, **kwargs):
        self.stdout.write("Cleaning up old test actions...")
        ScheduledAction.objects.filter(name__startswith="Test ").delete()

        now = timezone.now()

        # Create dummy tasks that call safe manager methods like count()
        self.stdout.write("Creating Test Action 1: Count Partners...")
        ScheduledAction.objects.create(
            name="Test Count Partners",
            model_name="core.Partner",
            method_name="count",
            interval_number=1,
            interval_type="minutes",
            next_run=now,
            is_active=True
        )

        self.stdout.write("Creating Test Action 2: Count Users...")
        ScheduledAction.objects.create(
            name="Test Count Users",
            model_name="users.User",
            method_name="count",
            interval_number=1,
            interval_type="minutes",
            next_run=now,
            is_active=True
        )
        
        # Test a method that doesn't exist (to test error handling)
        self.stdout.write("Creating Test Action 3: Bad Method...")
        ScheduledAction.objects.create(
            name="Test Bad Method",
            model_name="core.Partner",
            method_name="this_method_does_not_exist",
            interval_number=1,
            interval_type="minutes",
            next_run=now,
            is_active=True
        )

        self.stdout.write(f"Added {ScheduledAction.objects.filter(name__startswith='Test ').count()} test scheduled actions.")
        
        self.stdout.write("Triggering master engine...")
        # Since run_due_scheduled_actions is a Celery task, call .delay() to queue it, 
        # or call it directly as a function for testing. We'll call it directly.
        result = run_due_scheduled_actions()
        
        self.stdout.write(f"Master Engine Output: {result}")
        
        self.stdout.write("\nVerification:")
        for action in ScheduledAction.objects.filter(name__startswith="Test "):
            status = "SUCCESS" if action.last_run and not action.last_error else "FAILED"
            self.stdout.write(f"[{status}] Action '{action.name}'")
            self.stdout.write(f"    Last Run: {action.last_run}")
            self.stdout.write(f"    Next Run: {action.next_run}")
            if action.last_error:
                self.stdout.write(f"    Error: {action.last_error.splitlines()[0]}")
