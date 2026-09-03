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
        from apps.maintenance.domain.models import Asset

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


from django.dispatch import receiver
try:
    from apps.sale.infrastructure.signals import sale_order_confirmed_signal
    @receiver(sale_order_confirmed_signal)
    def reserve_stock_on_sale(sender, instance, **kwargs):
        from apps.stock.domain.models import StockMove, StorageLocation
        warehouse = StorageLocation.objects.filter(tenant=instance.tenant, location_type='internal').first()
        customer_loc = StorageLocation.objects.filter(tenant=instance.tenant, location_type='customer').first()
        
        if warehouse and customer_loc:
            for line in instance.lines.all():
                StockMove.objects.get_or_create(
                    tenant=instance.tenant,
                    inventory_item_id=line.product_id,
                    quantity=line.product_uom_qty,
                    reference=f"SO-{getattr(instance, 'name', instance.order_number)}"
                )
except ImportError:
    pass
