"""
ITAM — IT Asset Management Models.
Tracks hardware/software assets for BitGuard and managed clients.
"""
from django.db import models
from django.conf import settings
from apps.core.domain.models import BaseModel, TenantAwareModel


class Asset(TenantAwareModel):
    """Physical or software asset owned or managed by BitGuard."""
    TYPE_CHOICES = [
        ('vehicle', 'Vehicle'),
        ('equipment', 'Equipment'),
        ('property', 'Property'),
        ('machinery', 'Machinery'),
        ('hardware', 'Hardware'),
        ('printer', 'Printer'),
        ('software', 'Software License'),
        ('cloud', 'Cloud Resource'),
        ('other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('spare', 'In Spare Pool'),
        ('maintenance', 'Under Maintenance'),
        ('retired', 'Retired'),
        ('lost', 'Lost / Stolen'),
    ]

    name = models.CharField(max_length=255)
    asset_tag = models.CharField(max_length=100, unique=True, blank=True, null=True)
    asset_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='hardware')
    make = models.CharField(max_length=100, blank=True, help_text='Manufacturer (e.g. Dell, Apple)')
    model = models.CharField(max_length=100, blank=True)
    serial_number = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    # Ownership
    client = models.ForeignKey(
        'crm.Client', on_delete=models.SET_NULL, null=True, blank=True, related_name='maintenance',
        help_text='Client this asset belongs to. Null = BitGuard internal.'
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='itam_assets'
    )

    # Financial
    purchase_date = models.DateField(null=True, blank=True)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    warranty_expires = models.DateField(null=True, blank=True)

    # Location
    location = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Asset'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} [{self.asset_tag or self.serial_number or self.id}]'

    @property
    def is_warranty_active(self):
        from django.utils import timezone
        if not self.warranty_expires:
            return None
        return self.warranty_expires >= timezone.now().date()


class AssetAssignment(BaseModel):
    """Tracks who has been assigned an asset and when."""
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='assignments')
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='itam_assignments'
    )
    assigned_at = models.DateTimeField(auto_now_add=True)
    returned_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Asset Assignment'
        ordering = ['-assigned_at']

    def __str__(self):
        return f'{self.asset} → {self.assigned_to}'


class MaintenanceRecord(BaseModel):
    """Log of maintenance events on an asset."""
    TYPE_CHOICES = [
        ('repair', 'Repair'),
        ('upgrade', 'Upgrade'),
        ('inspection', 'Inspection'),
        ('cleaning', 'Cleaning'),
        ('software_update', 'Software Update'),
        ('replacement', 'Component Replacement'),
    ]

    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='maintenance_records')
    maintenance_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='itam_maintenance'
    )
    performed_at = models.DateField()
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Maintenance Record'
        ordering = ['-performed_at']

    def __str__(self):
        return f'{self.maintenance_type} on {self.asset} ({self.performed_at})'

class SoftwareLicense(TenantAwareModel):
    SOFTWARE_CHOICES = [
        ('perpetual', 'Perpetual'),
        ('subscription', 'Subscription'),
        ('open_source', 'Open Source'),
        ('trial', 'Trial'),
    ]
    software_name = models.CharField(max_length=255)
    vendor = models.CharField(max_length=255)
    license_key = models.CharField(max_length=500, blank=True)
    license_type = models.CharField(max_length=20, choices=SOFTWARE_CHOICES, default='subscription')
    seats_total = models.IntegerField(default=1)
    seats_used = models.IntegerField(default=0)
    purchase_date = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    cost_per_seat = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Software License'
        ordering = ['software_name']

    def __str__(self):
        return f"{self.software_name} ({self.seats_used}/{self.seats_total} seats)"

    @property
    def seats_available(self):
        return self.seats_total - self.seats_used

    @property
    def days_until_expiry(self):
        if not self.expiry_date:
            return None
        from django.utils import timezone
        delta = self.expiry_date - timezone.now().date()
        return delta.days
