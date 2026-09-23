from apps.core.validators import validate_document_file
from django.db import models
from apps.core.domain.models import TenantAwareModel

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

class ReportEngineSettings(TenantAwareModel):
    paper_format = models.CharField(max_length=20, default='A4')
    margin_top = models.IntegerField(default=15)
    margin_bottom = models.IntegerField(default=15)
    margin_left = models.IntegerField(default=15)
    margin_right = models.IntegerField(default=15)
    company_header_html = models.TextField(blank=True)
    company_footer_html = models.TextField(blank=True)

    def save(self, *args, **kwargs):
        # Ensure only one instance per tenant
        if not self.pk and ReportEngineSettings.objects.filter(tenant=self.tenant).exists():
            # If exists, update instead
            existing = ReportEngineSettings.objects.get(tenant=self.tenant)
            self.pk = existing.pk
        super().save(*args, **kwargs)

class ReportTag(TenantAwareModel):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=20, default='blue')

    def __str__(self):
        return self.name
