from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps
from django.utils import timezone
from apps.scm.models import PurchaseOrder

@receiver(post_save, sender=PurchaseOrder)
def provision_assets_from_po(sender, instance, created, **kwargs):
    """
    Automatically creates ITAM Assets when a Purchase Order is received.
    """
    if instance.status == 'received':
        from apps.itam.models import Asset

        Expense = apps.get_model('erp', 'Expense')
        Expense.objects.create(
            tenant=instance.tenant,
            title=f"PO Fulfillment: {instance.po_number}",
            amount=instance.total_amount,
            incurred_date=timezone.now().date(),
            category='office',
            status='approved',
        )


        for line in instance.lines.all():
            product_name = line.inventory_item.product_name.lower()
            if 'hardware' in product_name or 'laptop' in product_name or 'server' in product_name:
                for _ in range(line.quantity_received or line.quantity_ordered):
                    Asset.objects.create(
                        name=line.inventory_item.product_name,
                        asset_type='hardware',
                        status='in_stock',
                        tenant=instance.tenant,
                        purchase_date=instance.received_date or instance.order_date,
                        purchase_price=line.unit_cost,
                        notes=f"Auto-provisioned from PO #{instance.id}"
                    )
