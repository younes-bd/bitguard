"""
ERP Signals — Cross-module event handlers.
Charter §6: Commerce actions propagate automatically to operations.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from django.db.models import Sum
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


@receiver(post_save, sender='erp.Payment')
def update_invoice_on_payment(sender, instance, created, **kwargs):
    if created and instance.invoice:
        total_paid = instance.invoice.payment_set.aggregate(Sum('amount'))['amount__sum'] or 0
        if total_paid >= instance.invoice.total_amount:
            instance.invoice.status = 'paid'
        else:
            instance.invoice.status = 'partially_paid'
        instance.invoice.save()

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
