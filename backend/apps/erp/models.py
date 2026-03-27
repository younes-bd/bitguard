from django.db import models
from apps.core.models import UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel, TenantAwareModel
from django.conf import settings

class Invoice(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
        ('cancelled', 'Cancelled')
    ]
    invoice_number = models.CharField(max_length=100)
    client = models.ForeignKey('crm.Client', on_delete=models.CASCADE, related_name='invoices')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    issue_date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='draft')

    class Meta:
        verbose_name = 'Invoice'
        verbose_name_plural = 'Invoices'
        unique_together = ('tenant', 'invoice_number')

    def __str__(self):
        return f"{self.invoice_number} - {self.client.name}"

class Payment(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    METHOD_CHOICES = [
        ('credit_card', 'Credit Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('paypal', 'PayPal'),
        ('cash', 'Cash')
    ]
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateField()
    payment_method = models.CharField(max_length=50, choices=METHOD_CHOICES)
    reference = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Payment {self.id} for {self.invoice.invoice_number}"

class Expense(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    CATEGORY_CHOICES = [
        ('software', 'Software'),
        ('hardware', 'Hardware'),
        ('travel', 'Travel'),
        ('office', 'Office Supplies'),
        ('other', 'Other')
    ]
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    incurred_date = models.DateField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    receipt = models.FileField(upload_to='expenses/%Y/%m/', blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.title


class InternalProject(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    """
    Charter §16: Service delivery obligation created when a Deal is won.
    Tracks execution status and responsible parties.
    """
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('active', 'Active'),
        ('suspended', 'Suspended'),
        ('completed', 'Completed'),
        ('breached_sla', 'SLA Breached'),
        ('cancelled', 'Cancelled'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    client = models.ForeignKey('crm.Client', on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    # Optional link back to the originating Deal
    deal_id = models.UUIDField(null=True, blank=True, help_text="UUID of originating CRM Deal")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    budget = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    start_date = models.DateField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_projects'
    )
    # Charter §16: is_service_obligation used by WorkflowEngine to identify SERVICE type
    is_service_obligation = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Internal Project'
        verbose_name_plural = 'Internal Projects'

    def __str__(self):
        return self.name
