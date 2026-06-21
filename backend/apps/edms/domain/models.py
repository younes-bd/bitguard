from django.db import models
from django.conf import settings
import uuid
import logging
from apps.core.domain.models import TenantAwareModel, Attachment

logger = logging.getLogger(__name__)
from apps.core.domain.models import TenantAwareModel, Attachment

class DocumentWorkspace(TenantAwareModel):
    """
    EDMS Workspace (Folder) to isolate documents by department or category.
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    def __str__(self):
        return self.name

class Tag(TenantAwareModel):
    """
    EDMS Tags for dynamic categorization.
    """
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=20, default='blue')
    workspace = models.ForeignKey(DocumentWorkspace, on_delete=models.CASCADE, null=True, blank=True, related_name='tags')

    def __str__(self):
        return self.name

class Document(TenantAwareModel):
    """
    EDMS Document model. Sits on top of the generic Attachment model
    to add enterprise EDMS features.
    """
    attachment = models.OneToOneField(Attachment, on_delete=models.CASCADE, related_name='edms_document')
    workspace = models.ForeignKey(DocumentWorkspace, on_delete=models.SET_NULL, null=True, related_name='documents')
    tags = models.ManyToManyField(Tag, blank=True, related_name='documents')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='owned_documents')
    
    # EDMS specific metadata
    version = models.CharField(max_length=20, default='1.0')
    is_archived = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    ocr_text = models.TextField(blank=True, help_text="Extracted text for global search indexing")
    
    # Public Sharing
    is_public = models.BooleanField(default=False)
    share_token = models.UUIDField(default=uuid.uuid4, unique=True, null=True, blank=True, editable=False)

    # Source tracking for generated documents
    source_module = models.CharField(max_length=100, blank=True, null=True, help_text="e.g. 'accounting.Invoice'")
    source_id = models.CharField(max_length=255, blank=True, null=True, help_text="The primary key of the source record")
    expiry_date = models.DateField(null=True, blank=True, help_text="Optional expiration date for this document")
    
    def __str__(self):
        return f"{self.attachment.name} (v{self.version})"

    def extract_text(self):
        """Extract text from the attached file if it is a PDF using PyPDF2."""
        if not self.attachment or not self.attachment.file:
            return
        
        # Only try to extract from PDFs for now
        if not self.attachment.name.lower().endswith('.pdf'):
            return
            
        try:
            import PyPDF2
            self.attachment.file.open('rb')
            reader = PyPDF2.PdfReader(self.attachment.file)
            extracted_text = []
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text.append(text)
            self.ocr_text = "\n".join(extracted_text)
            self.save(update_fields=['ocr_text'])
        except Exception as e:
            logger.error(f"Failed to extract text from {self.attachment.name}: {str(e)}")
        finally:
            if not self.attachment.file.closed:
                self.attachment.file.close()

class DocumentVersion(TenantAwareModel):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='history')
    attachment = models.ForeignKey(Attachment, on_delete=models.CASCADE)
    version_number = models.CharField(max_length=20)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"v{self.version_number} of {self.document.attachment.name}"
