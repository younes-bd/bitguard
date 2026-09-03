from datetime import timedelta
from django.utils import timezone
from apps.accounting.domain.models import Invoice, InvoiceLine

class InvoiceService:
    @staticmethod
    def generate_from_sales_order(order, user):
        invoice = Invoice.objects.create(
            tenant=order.tenant,
            client=order.client,
            status='draft',
            issue_date=timezone.now().date(),
            due_date=timezone.now().date() + timedelta(days=30),
            created_by=user,
            reference=order.order_number,
        )
        for line in order.lines.all():
            InvoiceLine.objects.create(
                invoice=invoice, description=line.name,
                quantity=line.product_uom_qty, unit_price=line.price_unit,
                tax_rate=line.tax_rate, subtotal=line.price_subtotal
            )
        return invoice
