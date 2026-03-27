"""
ITAM — IT Asset Management Models.
Tracks hardware/software assets for BitGuard and managed clients.
"""
from django.db import models
from django.conf import settings
from apps.core.models import UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel, TenantAwareModel


class Asset(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel, SoftDeleteModel):
    """Physical or software asset owned or managed by BitGuard."""
    TYPE_CHOICES = [
        ('laptop', 'Laptop'),
        ('desktop', 'Desktop'),
        ('server', 'Server'),
        ('network', 'Network Device'),
        ('mobile', 'Mobile Device'),
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
    asset_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='laptop')
    make = models.CharField(max_length=100, blank=True, help_text='Manufacturer (e.g. Dell, Apple)')
    model = models.CharField(max_length=100, blank=True)
    serial_number = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    # Ownership
    client = models.ForeignKey(
        'crm.Client', on_delete=models.SET_NULL, null=True, blank=True, related_name='assets',
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


class AssetAssignment(UUIDPrimaryKeyModel, TimeStampedModel):
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


class MaintenanceRecord(UUIDPrimaryKeyModel, TimeStampedModel):
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
