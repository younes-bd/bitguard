from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender='crm.Deal')
def create_project_agreement_from_deal(sender, instance, created, **kwargs):
    """
    When a Deal is marked as 'won', create a corresponding Project (InternalProject) in ERP
    if one doesn't exist.
    """
    if instance.stage == 'won':
        InternalProject = apps.get_model('erp', 'InternalProject')
        
        # Check if project already exists for this deal (by name or client logic)
        #Ideally Deal would have a 'project' field, but we can check by name convention for now
        project_name = f"Project: {instance.name}"
        
        project, created_proj = InternalProject.objects.get_or_create(
            name=project_name,
            client=instance.client,
            defaults={
                'status': 'planning',
                'description': f"Generated from Deal: {instance.name} (ID: {instance.id})",
                'budget': instance.value or 0
            }
        )
        if created_proj:
            logger.info(f"Created ERP Project '{project_name}' from Deal {instance.id}")

@receiver(post_save, sender='store.Order')
def sync_crm_client_from_order(sender, instance, created, **kwargs):
    """
    When a Store Order is created, ensure the User has a CRM Client profile.
    """
    if created and instance.user:
        Client = apps.get_model('crm', 'Client')
        Contact = apps.get_model('crm', 'Contact')
        
        # Check if Contact exists
        contact = Contact.objects.filter(email=instance.user.email).first()
        
        if not contact:
            # Create Client (Individual)
            client = Client.objects.create(
                name=f"{instance.user.first_name} {instance.user.last_name}" or instance.user.username,
                client_type='individual',
                status='active',
                email=instance.user.email
            )
            
            # Create Contact linked to User
            Contact.objects.create(
                client=client,
                email=instance.user.email,
                first_name=instance.user.first_name,
                last_name=instance.user.last_name,
                is_primary=True,
                role='Customer'
            )
            logger.info(f"Created CRM Client & Contact for Order User {instance.user.username}")
