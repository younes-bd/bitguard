from .models import Vendor, PurchaseOrder, InventoryItem

class SCMService:
    @staticmethod
    def fulfill_purchase_order(po_obj):
        """Executes strict ledger increments bridging physical stock with inbound Purchase Orders."""
        po_obj.status = 'received'
        po_obj.save()
        
        # Iterates across lines items moving stock allocations
        for line in po_obj.lines.all():
            if line.inventory_item:
                inventory = line.inventory_item
                inventory.quantity_on_hand += line.quantity_ordered
                inventory.save()
                line.quantity_received = line.quantity_ordered
                line.save()
        
        return po_obj
