from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps
from django.utils import timezone
from apps.purchase.domain.models import PurchaseOrder
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=PurchaseOrder)
def provision_assets_from_po(sender, instance, created, **kwargs):
    """
    Automatically creates ITAM Assets when a Purchase Order is received.
    """
    if instance.status != 'received':
        return
    try:
        from apps.itam.models import Asset

        po_ref = getattr(instance, 'po_number', None) or str(instance.id)[:8].upper()
        total = getattr(instance, 'total_amount', None) or getattr(instance, 'total_cost', 0)

        VendorBill = apps.get_model('accounting', 'VendorBill')
        VendorBill.objects.create(
            tenant=instance.tenant,
            vendor=instance.vendor,
            bill_number=f"BILL-{po_ref}",
            reference=po_ref,
            date=timezone.now().date(),
            due_date=timezone.now().date() + timezone.timedelta(days=30),
            total_amount=total,
            subtotal=total,
            status='draft',
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
                        purchase_date=getattr(instance, 'received_date', None) or instance.order_date,
                        purchase_price=line.unit_cost,
                        notes=f"Auto-provisioned from PO #{instance.id}"
                    )
    except Exception as e:
        logger.warning(f"provision_assets_from_po skipped for PO {instance.id}: {e}")

