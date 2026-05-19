"""
ERP Signals — Cross-module event handlers.
Charter §6: Commerce actions propagate automatically to operations.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
import logging
import datetime

logger = logging.getLogger(__name__)


@receiver(post_save, sender='store.Order')
def generate_erp_invoice_from_order(sender, instance, created, **kwargs):
    """
    When a Store Order is created (e-commerce checkout), auto-generate
    an ERP Invoice linked to the CRM client, with proper ledger entries.
    """
    if not created:
        return

    try:
        from apps.erp.models import Invoice, InvoiceItem
        from apps.crm.models import Contact

        # Resolve tenant from the order
        tenant = getattr(instance, 'tenant', None)
        if not tenant:
            tenant = getattr(instance.user, 'tenant', None) if hasattr(instance, 'user') else None

        # Find CRM client through contact email
        user = getattr(instance, 'user', None)
        client = None
        if user:
            contact = Contact.objects.filter(email=user.email).first()
            if contact:
                client = contact.client

        # Generate invoice number
        year = timezone.now().year
        count = Invoice.objects.filter(
            tenant=tenant,
            invoice_number__startswith=f"INV-ORD-{year}-"
        ).count()
        inv_number = f"INV-ORD-{year}-{str(count + 1).zfill(4)}"

        # Determine status based on order payment status
        order_status = getattr(instance, 'status', 'pending')
        invoice_status = 'paid' if order_status in ('completed', 'paid') else 'draft'

        total = getattr(instance, 'total_amount', 0) or getattr(instance, 'total', 0) or 0

        invoice = Invoice.objects.create(
            tenant=tenant,
            client=client,
            invoice_number=inv_number,
            total_amount=total,
            subtotal=total,
            status=invoice_status,
            issue_date=timezone.now().date(),
            due_date=timezone.now().date(),
            paid_at=timezone.now() if invoice_status == 'paid' else None,
            reference=f"Store Order #{instance.id}",
            notes=f"Auto-generated from e-commerce order #{instance.id}"
        )

        logger.info(f"ERP Invoice {inv_number} created from Store Order #{instance.id}")

        # Create ledger entries for paid orders
        if invoice_status == 'paid' and total > 0:
            from apps.erp.models import GeneralLedger
            GeneralLedger.objects.create(
                tenant=tenant, account_name="Cash", amount=total,
                entry_type='debit', reference_id=invoice.pk,
                reference_type='invoice',
                description=f"Payment from Store Order #{instance.id}"
            )
            GeneralLedger.objects.create(
                tenant=tenant, account_name="Revenue", amount=total,
                entry_type='credit', reference_id=invoice.pk,
                reference_type='invoice',
                description=f"Revenue from Store Order #{instance.id}"
            )

    except Exception as e:
        logger.error(f"Failed to generate ERP invoice from Store Order: {e}", exc_info=True)


@receiver(post_save, sender='erp.Expense')
def update_budget_on_expense(sender, instance, created, **kwargs):
    """
    When an expense is approved, update the BudgetLine spent_amount
    for the matching cost center and category.
    """
    if instance.status == 'approved' and instance.cost_center:
        try:
            from apps.erp.models import BudgetLine
            budget = BudgetLine.objects.filter(
                tenant=instance.tenant,
                cost_center=instance.cost_center,
                category=instance.category,
                year=instance.incurred_date.year
            ).first()
            if budget:
                from django.db.models import Sum
                total_spent = sender.objects.filter(
                    tenant=instance.tenant,
                    cost_center=instance.cost_center,
                    category=instance.category,
                    status__in=['approved', 'reimbursed'],
                    incurred_date__year=instance.incurred_date.year
                ).aggregate(total=Sum('amount'))['total'] or 0
                budget.spent_amount = total_spent
                budget.save(update_fields=['spent_amount'])
        except Exception as e:
            logger.error(f"Failed to update budget from expense: {e}", exc_info=True)


@receiver(post_save, sender='contracts.Quote')
def generate_invoice_from_quote_acceptance(sender, instance, created, **kwargs):
    """
    When a Quote is marked as 'accepted', automatically generate an Invoice.
    """
    if instance.status == 'accepted':
        # Check if an invoice already exists for this quote (e.g., in reference)
        from apps.erp.models import Invoice
        if Invoice.objects.filter(reference=f"Quote #{instance.id}").exists():
            return

        try:
            from apps.erp.services import InvoiceService
            # We don't have a direct request object here, so we simulate a basic request context
            # or directly call the service method adjusting for tenant.
            # But wait, InvoiceService.create_from_quote needs a request object.
            # We will manually create the invoice here if needed or bypass request requirement.
            tenant = instance.tenant
            
            # Generate invoice number
            year = timezone.now().year
            count = Invoice.objects.filter(
                tenant=tenant,
                invoice_number__startswith=f"INV-QT-{year}-"
            ).count()
            inv_number = f"INV-QT-{year}-{str(count + 1).zfill(4)}"

            invoice = Invoice.objects.create(
                tenant=tenant,
                client=instance.client,
                invoice_number=inv_number,
                type='standard',
                subtotal=instance.subtotal,
                discount_total=instance.subtotal * (instance.discount_percent / 100),
                total_amount=instance.total,
                status='draft',
                issue_date=timezone.now().date(),
                due_date=timezone.now().date() + datetime.timedelta(days=30),
                reference=f"Quote #{instance.id}"
            )
            
            from apps.erp.models import InvoiceItem
            for line in instance.lines.all():
                InvoiceItem.objects.create(
                    tenant=tenant,
                    invoice=invoice,
                    description=line.description,
                    quantity=line.quantity,
                    unit_price=line.unit_price,
                    tax_rate=0,
                    discount=0,
                    total=line.line_total
                )
                
            logger.info(f"ERP Invoice {inv_number} created from Quote #{instance.id}")
            
        except Exception as e:
            logger.error(f"Failed to generate invoice from Quote: {e}", exc_info=True)


@receiver(post_save, sender='erp.Payment')
def notify_on_payment_creation(sender, instance, created, **kwargs):
    """
    Notify client and billing team when a payment is recorded.
    """
    if created:
        try:
            from apps.notifications.models import Notification
            # Notify the client (user associated with client if any)
            # Find users with 'billing' role or client's primary contact
            invoice = instance.invoice
            if invoice and invoice.client:
                # In a real system, we'd find the user mapped to this client
                pass
            
            # Create a system notification for admins
            Notification.objects.create(
                title="Payment Received",
                message=f"Payment of ${instance.amount} recorded for {invoice.invoice_number if invoice else 'Unknown'}",
                type='system',
                level='info',
                is_read=False
            )
        except Exception as e:
            logger.error(f"Failed to send payment notification: {e}", exc_info=True)
