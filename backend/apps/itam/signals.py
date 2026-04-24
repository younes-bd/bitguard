from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

@receiver(post_save, sender='store.Order')
def provision_assets_from_order(sender, instance, created, **kwargs):
    """
    Automatically creates ITAM Assets when a Hardware order is completed.
    """
    # Only process completed orders to avoid ghost assets
    if instance.status == 'completed':
        from apps.itam.models import Asset
        from apps.crm.models import Contact
        
        # Identify CRM client
        contact = Contact.objects.filter(email=instance.customer.user.email).first() if instance.customer else None
        client = contact.client if contact else None

        for item in instance.items.all():
            # Check if product is hardware
            if item.product.product_type == 'hardware' or 'hardware' in item.product.name.toLowerCase():
                # Provision the asset
                Asset.objects.create(
                    name=item.product.name,
                    asset_type='other', # Default, manually refine
                    make=getattr(item.product, 'brand', ''),
                    model=item.product.name,
                    status='active',
                    client=client,
                    assigned_to=instance.customer.user if instance.customer else None,
                    purchase_date=instance.created_at.date(),
                    purchase_price=item.price,
                    notes=f"Auto-provisioned from Order #{instance.id}"
                )
