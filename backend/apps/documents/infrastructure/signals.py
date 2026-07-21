from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.core.domain.models import Attachment
from apps.documents.domain.models import Document, DocumentWorkspace
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Attachment)
def auto_sync_attachment_to_edms(sender, instance, created, **kwargs):
    """
    Automatically creates an EDMS Document when an Attachment is created
    for a supported module (like Invoice, Employee, Client).
    """
    if created and instance.res_model:
        model_name = instance.res_model.model
        app_label = instance.res_model.app_label
        
        # Don't create an EDMS document if this attachment is ALREADY
        # created *for* an EDMS Document! That would cause an infinite loop.
        if app_label == 'documents' and model_name == 'document':
            return
            
        try:
            # Try to find or create a default "Auto-Imported" workspace
            tenant = getattr(instance, 'tenant', None)
            workspace, _ = DocumentWorkspace.objects.get_or_create(
                name=f"{app_label.capitalize()} Imports",
                tenant=tenant,
                defaults={'description': f'Auto-imported from {app_label} module'}
            )
            
            doc = Document.objects.create(
                attachment=instance,
                workspace=workspace,
                tenant=tenant,
                source_module=f"{app_label}.{model_name}",
                source_id=instance.res_id
            )
            
            # Extract text automatically if it's a PDF
            doc.extract_text()
            logger.info(f"Auto-imported attachment {instance.name} to EDMS.")
        except Exception as e:
            logger.error(f"Failed to auto-sync attachment {instance.name} to EDMS: {str(e)}")
