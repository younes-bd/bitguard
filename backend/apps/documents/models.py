from django.db import models
from django.conf import settings
from apps.core.models import TenantAwareModel, TimeStampedModel, UUIDPrimaryKeyModel

class Document(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    CATEGORY_CHOICES = (
        ('policy', 'Company Policy'),
        ('contract', 'Legal Contract'),
        ('invoice', 'Supplier Invoice'),
        ('manual', 'Technical Manual'),
        ('other', 'Other'),
    )

    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='vault/documents/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='uploaded_documents')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    version = models.CharField(max_length=20, default='1.0')
    is_archived = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} (v{self.version})"


class DocumentVersion(TenantAwareModel, UUIDPrimaryKeyModel, TimeStampedModel):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='history')
    version_number = models.CharField(max_length=20)
    file = models.FileField(upload_to='vault/documents/archive/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    notes = models.TextField(blank=True)
    

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.document.title} - v{self.version_number}"
