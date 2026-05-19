import datetime
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.erp.models import RecurringInvoice
from apps.erp.services import RecurringInvoiceService

class Command(BaseCommand):
    help = 'Processes active recurring invoices and generates new invoices'

    def handle(self, *args, **options):
        today = timezone.now().date()
        
        # Find active recurring invoices that are due to run today or earlier
        due_invoices = RecurringInvoice.objects.filter(
            is_active=True,
            next_run__lte=today
        ).exclude(
            end_date__lt=today # Skip if past end date
        )
        
        # Simulate a request object for the service
        from django.test import RequestFactory
        factory = RequestFactory()
        request = factory.post('/')
        
        count = 0
        for recurring in due_invoices:
            # We need to set request.user for audit logging if possible, 
            # or pass a flag to service to bypass user audit logging.
            # We'll just pass None or system user if available.
            request.user = None
            try:
                # Our service needs a tenant context from request, let's inject it
                request.tenant = recurring.tenant
                request.user = type('SystemUser', (), {'tenant': recurring.tenant, 'is_authenticated': True})()
                
                RecurringInvoiceService.run_now(request, recurring)
                count += 1
                self.stdout.write(f"Generated invoice from recurring config: {recurring.name}")
            except Exception as e:
                self.stderr.write(f"Error processing recurring invoice {recurring.name}: {e}")
            
        self.stdout.write(self.style.SUCCESS(f"Successfully processed {count} recurring invoices."))
