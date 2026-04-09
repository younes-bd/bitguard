from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

@receiver(post_save, sender='store.Order')
def generate_erp_invoice_from_order(sender, instance, created, **kwargs):
    """
    Intercepts Store purchases converting them into standard ERP ledgers automatically.
    """
    if created:
        from apps.erp.models import Invoice
        from apps.crm.models import Contact
        
        # Link CRM proxy if existing
        contact = Contact.objects.filter(email=instance.customer.user.email).first() if instance.customer else None
        client = contact.client if contact else None
        
        Invoice.objects.create(
            client=client,
            invoice_number=f"INV-ORD-{instance.id}",
            total=instance.total,
            status='paid' if instance.status == 'completed' else 'draft',
            issued_date=timezone.now(),
            due_date=timezone.now()
        )
