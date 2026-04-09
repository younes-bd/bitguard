from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender='store.Order')
def sync_store_order_to_crm(sender, instance, created, **kwargs):
    """
    Auto-creates or updates a CRM Client profile when a new Store Order is placed.
    """
    if created and instance.customer:
        from apps.crm.models import Client, Contact
        
        customer = instance.customer
        client, _ = Client.objects.get_or_create(
            name=f"{customer.user.first_name} {customer.user.last_name}".strip() or customer.user.email.split('@')[0],
            defaults={
                'client_type': 'individual',
                'status': 'active'
            }
        )
        
        Contact.objects.get_or_create(
            client=client,
            email=customer.user.email,
            defaults={
                'first_name': customer.user.first_name,
                'last_name': customer.user.last_name,
                'is_primary': True
            }
        )

@receiver(post_save, sender='support.Ticket')
def link_support_to_crm(sender, instance, created, **kwargs):
    """
    Links Support Tickets dynamically to CRM scopes if an email address dictates a match.
    """
    if created and instance.requester:
        from apps.crm.models import Contact, Ticket as CRMTicket
        contact = Contact.objects.filter(email=instance.requester.email).first()
        if contact:
            # Sync to CRM Ticket ledger for sales visibility
            CRMTicket.objects.get_or_create(
                client=contact.client,
                summary=instance.title,
                defaults={
                    'description': instance.description,
                    'status': 'open',
                    'priority': instance.priority
                }
            )

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
        
        # Create the lead
        Lead.objects.create(
            title=f"Partnership Inquiry: {instance.company_name}",
            contact=contact,
            status='new',
            notes=f"Interest Areas: {', '.join(instance.interest_areas)}\n\nNotes: {instance.notes}"
        )
