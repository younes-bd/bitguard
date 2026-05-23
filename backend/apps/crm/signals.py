from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender='store.Order')
def sync_store_order_to_crm(sender, instance, created, **kwargs):
    """
    Auto-creates or updates a CRM Client profile when a new Store Order is placed.
    """
    if created and instance.user:
        from apps.crm.models import Client, Contact
        
        user = instance.user
        client, _ = Client.objects.get_or_create(
            email=user.email,
            tenant=instance.tenant,
            defaults={
                'name': f"{user.first_name} {user.last_name}".strip() or user.username,
                'client_type': 'individual',
                'status': 'active'
            }
        )
        
        Contact.objects.get_or_create(
            client=client,
            email=user.email,
            tenant=instance.tenant,
            defaults={
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_primary': True
            }
        )

@receiver(post_save, sender='support.Ticket')
def link_support_to_crm(sender, instance, created, **kwargs):
    """
    Links Support Tickets dynamically to CRM scopes if an email address dictates a match.
    """
    if created and instance.customer:
        from apps.crm.models import Contact
        contact = Contact.objects.filter(email=instance.customer.email, tenant=instance.tenant).first()
        if contact:
            # Sync to CRM - Ticket model not found in crm.models, skipping for now.
            # TODO: Define a CRMTicket or Activity if sales visibility is required.
            pass

@receiver(post_save, sender='store.PartnerRequest')
def sync_partner_request_to_crm(sender, instance, created, **kwargs):
    """
    Converts new Partnership inquiries into CRM Leads for the sales team.
    """
    if created:
        from apps.crm.models import Lead, Client, Contact
        
        # Create a prospect client
        client, _ = Client.objects.get_or_create(
            name=instance.company_name,
            defaults={'status': 'prospect', 'client_type': 'business'}
        )
        
        # Ensure contact exists
        contact, _ = Contact.objects.get_or_create(
            client=client,
            email=instance.email,
            defaults={'first_name': instance.contact_person, 'role': 'Decision Maker'}
        )
        
        Lead.objects.create(
            title=f"Partnership Inquiry: {instance.company_name}",
            contact=contact,
            status='new',
            description=f"Interest Areas: {', '.join(instance.interest_areas)}\n\nNotes: {instance.notes}"
        )

@receiver(post_save, sender='crm.Activity')
def trigger_lead_scoring_on_activity(sender, instance, created, **kwargs):
    """Recalculates lead score when a new activity is logged."""
    if instance.lead:
        from apps.crm.services import LeadScoringService
        LeadScoringService.update_lead_score(instance.lead.id)

@receiver(post_save, sender='crm.Lead')
def trigger_lead_scoring_on_lead_change(sender, instance, created, **kwargs):
    """Recalculates lead score when lead attributes change."""
    # Prevent recursion by only updating if score actually changes (handled in service)
    # and avoiding save loop if only score was updated.
    if not kwargs.get('update_fields') or 'score' not in kwargs.get('update_fields'):
        from apps.crm.services import LeadScoringService
        LeadScoringService.update_lead_score(instance.id)

@receiver(post_save, sender='crm.Deal')
def trigger_contract_on_deal_won(sender, instance, created, **kwargs):
    """
    Signal: CRM Deal 'Won' -> Generate baseline Service Contract & Initial Invoice.
    """
    # Check if the deal was just moved to 'won'
    if instance.stage == 'won':
        from apps.contracts.models import ServiceContract
        from apps.erp.models import Invoice
        import datetime
        from django.utils import timezone
        
        # Avoid creating duplicates if the signal fires multiple times
        contract_exists = ServiceContract.objects.filter(client=instance.client, start_date=timezone.now().date()).exists()
        if not contract_exists:
            # Find a default SLA tier (or create one)
            from apps.contracts.models import SLATier
            sla_tier = SLATier.objects.filter(name='Standard').first()
            if not sla_tier:
                sla_tier = SLATier.objects.create(
                    name='Standard',
                    first_response_hours=24,
                    resolution_hours=72,
                    uptime_percent=99.0
                )
            
            # Generate a basic Service Contract
            contract = ServiceContract.objects.create(
                tenant=instance.tenant,
                client=instance.client,
                contract_type='project',
                sla_tier=sla_tier,
                status='draft',
                start_date=timezone.now().date(),
                end_date=timezone.now().date() + datetime.timedelta(days=365),
                monthly_value=instance.amount / 12 if instance.amount else 0
            )
            
            # Generate Initial Invoice for the Deal
            invoice = Invoice.objects.create(
                tenant=instance.tenant,
                client=instance.client,
                invoice_number=f"INV-DEAL-{instance.id}-{timezone.now().strftime('%Y%m%d')}",
                type='standard',
                status='draft',
                issue_date=timezone.now().date(),
                due_date=timezone.now().date() + datetime.timedelta(days=15),
                amount=instance.amount
            )
            # Link to the deal notes or references if applicable
            invoice.notes = f"Initial invoice generated from Deal: {instance.title}"
            invoice.save(update_fields=['notes'])

