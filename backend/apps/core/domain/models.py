import uuid
from django.db import models
from django.utils import timezone
from django.conf import settings
from apps.core.middleware import get_current_tenant
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class UUIDModel(models.Model):
    """
    Standard base model for global BitGuard entities (like Users and Tenants).
    Includes UUID PK, soft-delete, and audit timestamps.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='%(app_label)s_%(class)s_created')

    class Meta:
        abstract = True

class BaseModel(UUIDModel):
    """
    Tenant-aware base model for all isolated BitGuard entities.
    """
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.PROTECT, null=True, blank=True, related_name='%(class)s_set')

    def save(self, *args, **kwargs):
        if not getattr(self, 'tenant_id', None):
            current_tenant = get_current_tenant()
            if current_tenant:
                self.tenant = current_tenant
        super().save(*args, **kwargs)

    class Meta:
        abstract = True

class TenantAwareManager(models.Manager):
    def get_queryset(self):
        # Initial filter for soft-delete (if needed) and tenant
        tenant = get_current_tenant()
        qs = super().get_queryset().filter(is_deleted=False)
        if tenant:
            return qs.filter(tenant=tenant)
        return qs

class TenantAwareModel(BaseModel):
    """
    Specialized model that automatically filters queries by the current tenant context.
    """
    objects = TenantAwareManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

# Core app now serves as a utility belt and middleware container.
# All business logic models have been moved to domain-specific apps:
# - Identity -> apps.users
# - Identity Access (RBAC) -> apps.auth
# - Tenancy -> apps.tenants
# - Notifications -> apps.notifications

# AuditLog has been moved to apps.audit to align with domain-driven design.
# See apps.audit.models.AuditLog for the centralized implementation.

class Partner(TenantAwareModel):
    PARTNER_TYPES = [
        ('customer', 'Customer'),
        ('supplier', 'Supplier'),
        ('both', 'Customer & Supplier'),
        ('internal', 'Internal'),
    ]
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    address = models.TextField(blank=True)
    country = models.CharField(max_length=100, blank=True)
    tax_id = models.CharField(max_length=100, blank=True)
    partner_type = models.CharField(max_length=20, choices=PARTNER_TYPES, default='customer')
    payment_terms = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    credit_limit = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.name} ({self.get_partner_type_display()})"

class Attachment(TenantAwareModel):
    """
    Generic model for attaching files to ANY record in the database.
    (Odoo ir.attachment equivalent)
    """
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='attachments/%Y/%m/')
    res_model = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    res_id = models.CharField(max_length=255)  # Stored as string to support UUIDs and Ints
    content_object = GenericForeignKey('res_model', 'res_id')
    mimetype = models.CharField(max_length=100, blank=True)
    file_size = models.IntegerField(default=0)

    def __str__(self):
        return f"Attachment: {self.name} for {self.res_model.model} ({self.res_id})"

class Sequence(TenantAwareModel):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=50)
    prefix = models.CharField(max_length=20)
    padding = models.IntegerField(default=5)
    next_number = models.IntegerField(default=1)

    class Meta:
        unique_together = ('tenant', 'code')

    def __str__(self):
        return f"{self.name} ({self.code})"

class UoMCategory(TenantAwareModel):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class UoM(TenantAwareModel):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(UoMCategory, on_delete=models.CASCADE, related_name='uoms')
    factor = models.FloatField(default=1.0, help_text="Ratio to reference UoM in this category")
    is_reference = models.BooleanField(default=False, help_text="Is this the base unit for this category?")

    def __str__(self):
        return f"{self.name} ({self.category.name})"

class CompanySettings(TenantAwareModel):
    company_name = models.CharField(max_length=255)
    fiscal_year_end_month = models.IntegerField(default=12)
    default_currency = models.ForeignKey('accounting.Currency', on_delete=models.SET_NULL, null=True, blank=True)
    enable_multicurrency = models.BooleanField(default=False)
    setup_completed = models.BooleanField(default=False)
