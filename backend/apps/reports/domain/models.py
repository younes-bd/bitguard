from apps.base.validators import validate_document_file
from django.db import models
from apps.base.domain.models import TenantAwareModel

class ReportTemplate(TenantAwareModel):
    """
    Odoo-style QWeb equivalent: Defines an HTML/CSS template to generate a PDF.
    """
    name = models.CharField(max_length=255)
    model = models.CharField(max_length=100, help_text="e.g., 'accounting.Invoice' or 'ecommerce.Order'")
    html_content = models.TextField(help_text="Jinja2 or Django template syntax for the report")
    css_content = models.TextField(blank=True, help_text="Custom styling for the report")
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.model})"

class GeneratedReport(TenantAwareModel):
    template = models.ForeignKey(ReportTemplate, on_delete=models.SET_NULL, null=True, related_name='reports')
    record_model = models.CharField(max_length=100)
    record_id = models.CharField(max_length=255)
    file = models.FileField(upload_to='reports/%Y/%m/', null=True, blank=True, validators=[validate_document_file])
    status = models.CharField(max_length=20, default='pending')
    
    def __str__(self):
        return f"Report {self.id} for {self.record_model}"

class PaperFormat(TenantAwareModel):
    """
    Tier-1 ERP Master Data Model defining physical paper dimensions and margins.
    Odoo equivalent: report.paperformat
    """
    name = models.CharField(max_length=100, help_text="e.g. A4, US Letter, Zebra 4x6")
    page_height = models.IntegerField(default=297, help_text="Height in mm")
    page_width = models.IntegerField(default=210, help_text="Width in mm")
    margin_top = models.IntegerField(default=15, help_text="Top margin in mm")
    margin_bottom = models.IntegerField(default=15, help_text="Bottom margin in mm")
    margin_left = models.IntegerField(default=15, help_text="Left margin in mm")
    margin_right = models.IntegerField(default=15, help_text="Right margin in mm")
    orientation = models.CharField(
        max_length=20, 
        choices=[('Portrait', 'Portrait'), ('Landscape', 'Landscape')], 
        default='Portrait'
    )
    dpi = models.IntegerField(default=90)
    is_global = models.BooleanField(default=False, help_text="If true, available to all tenants (tenant=None)")

    class Meta:
        ordering = ['name']
        verbose_name = "Paper Format"
        verbose_name_plural = "Paper Formats"

    def __str__(self):
        return f"{self.name} ({self.page_width}x{self.page_height}mm)"

class ReportTag(TenantAwareModel):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=20, default='blue')

    def __str__(self):
        return self.name
