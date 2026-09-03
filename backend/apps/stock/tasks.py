from celery import shared_task
from django.utils import timezone
from apps.stock.domain.models import ReorderRule, InventoryItem
from apps.purchase.domain.models import PurchaseOrder, PurchaseOrderLine
from apps.core.domain.models import Tenant

@shared_task
def run_reordering_rules():
    """
    Scans all ReorderRules for all tenants.
    If an InventoryItem's available quantity is <= the rule's min_quantity,
    auto-generates a draft PurchaseOrder for the missing amount.
    """
    rules = ReorderRule.objects.filter(is_active=True).select_related('inventory_item', 'inventory_item__vendor')
    
    for rule in rules:
        item = rule.inventory_item
        if not item.vendor:
            continue
            
        if item.quantity_available <= rule.min_quantity:
            # Calculate how much to order
            # (e.g. up to max_quantity, rounded up to multiple_quantity)
            target = rule.max_quantity if rule.max_quantity > 0 else rule.min_quantity * 2
            needed = target - item.quantity_available
            
            if needed <= 0:
                continue
                
            # Round up to multiple_quantity
            if rule.multiple_quantity > 1:
                remainder = needed % rule.multiple_quantity
                if remainder > 0:
                    needed += (rule.multiple_quantity - remainder)
                    
            # Check if there's already a draft PO for this vendor to append to,
            # otherwise create a new one.
            po, created = PurchaseOrder.objects.get_or_create(
                tenant=item.tenant,
                vendor=item.vendor,
                status='draft',
                defaults={
                    'order_date': timezone.now().date(),
                    'reference': f"AUTO-REORDER-{timezone.now().strftime('%Y%m%d')}"
                }
            )
            
            # Check if line already exists on this PO
            line, line_created = PurchaseOrderLine.objects.get_or_create(
                po=po,
                product_id=item.product_id,
                defaults={
                    'description': item.product_name,
                    'quantity': needed,
                    'unit_price': item.unit_cost,
                    'tenant': item.tenant
                }
            )
            
            if not line_created:
                line.quantity += needed
                line.save()
