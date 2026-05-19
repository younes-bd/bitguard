import datetime
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.erp.models import Invoice

class Command(BaseCommand):
    help = 'Detects and transitions invoices past their due_date to overdue status'

    def handle(self, *args, **options):
        today = timezone.now().date()
        
        # Find invoices that are sent or partially paid and past due date
        overdue_invoices = Invoice.objects.filter(
            status__in=['sent', 'partially_paid'],
            due_date__lt=today
        )
        
        count = 0
        for invoice in overdue_invoices:
            invoice.status = 'overdue'
            invoice.save(update_fields=['status', 'updated_at'])
            count += 1
            self.stdout.write(f"Marked Invoice {invoice.invoice_number} as overdue.")
            
        self.stdout.write(self.style.SUCCESS(f"Successfully processed {count} overdue invoices."))
