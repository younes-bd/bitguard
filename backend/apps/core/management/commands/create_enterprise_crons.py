from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.core.domain.models import ScheduledAction
from apps.tenants.domain.models import Tenant

class Command(BaseCommand):
    help = 'Create enterprise ScheduledActions for testing'

    def handle(self, *args, **kwargs):
        self.stdout.write("Cleaning up old test actions...")
        # Delete the previous tests that were failing
        ScheduledAction.objects.filter(name__icontains="Test Count Partners").delete()
        ScheduledAction.objects.filter(name__icontains="Test Count Users").delete()
        ScheduledAction.objects.filter(name__icontains="Test Bad Method").delete()
        ScheduledAction.objects.filter(name__startswith="Test ").delete()
        
        now = timezone.now()
        tenant = Tenant.objects.first()

        self.stdout.write("Creating Action 1: Overdue Invoices...")
        ScheduledAction.objects.create(
            name="Check Overdue Invoices",
            model_name="accounting.Invoice",
            method_name="process_overdue_invoices",
            interval_number=1,
            interval_type="days",
            next_run=now,
            is_active=True,
            tenant=tenant
        )

        self.stdout.write("Creating Action 2: Prune Audit Logs...")
        ScheduledAction.objects.create(
            name="Prune Old Audit Logs",
            model_name="core.AuditTrail",
            method_name="prune_old_logs",
            interval_number=1,
            interval_type="weeks",
            next_run=now,
            is_active=True,
            tenant=tenant
        )
        
        self.stdout.write("Creating Action 3: Expiring HR Contracts...")
        ScheduledAction.objects.create(
            name="Check Expiring Contracts",
            model_name="hr.EmployeeContract",
            method_name="check_expiring_contracts",
            interval_number=1,
            interval_type="days",
            next_run=now,
            is_active=True,
            tenant=tenant
        )

        self.stdout.write("Successfully created the 3 Enterprise Scheduled Actions!")
