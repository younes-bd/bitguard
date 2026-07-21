import datetime
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.projects.domain.models import Milestone

@receiver(post_save, sender=Milestone)
def generate_invoice_from_milestone(sender, instance, created, **kwargs):
    """
    Generates an ERP invoice when a billable milestone is completed.
    """
    if instance.is_completed and instance.invoice_on_completion and instance.invoice_amount:
        from apps.accounting.domain.models import Invoice, InvoiceItem
        from django.utils import timezone
        
        if Invoice.objects.filter(reference=f"Milestone #{instance.id}").exists():
            return
            
        tenant = instance.tenant
        year = timezone.now().year
        count = Invoice.objects.filter(
            tenant=tenant,
            invoice_number__startswith=f"INV-MS-{year}-"
        ).count()
        inv_number = f"INV-MS-{year}-{str(count + 1).zfill(4)}"
        
        invoice = Invoice.objects.create(
            tenant=tenant,
            client=instance.project.client,
            invoice_number=inv_number,
            total_amount=instance.invoice_amount,
            subtotal=instance.invoice_amount,
            status='draft',
            issue_date=timezone.now().date(),
            due_date=timezone.now().date() + datetime.timedelta(days=30),
            reference=f"Milestone #{instance.id}",
            notes=f"Auto-generated from Project {instance.project.name} - Milestone {instance.name}"
        )
        
        InvoiceItem.objects.create(
            tenant=tenant,
            invoice=invoice,
            description=f"Milestone: {instance.name}",
            quantity=1,
            unit_price=instance.invoice_amount,
            tax_rate=0,
            discount=0,
            total=instance.invoice_amount
        )
