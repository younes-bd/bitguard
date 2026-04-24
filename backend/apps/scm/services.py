from .models import Vendor, PurchaseOrder, InventoryItem

class SCMService:
    @staticmethod
    def fulfill_purchase_order(po_obj):
        """Executes strict ledger increments bridging physical stock with inbound Purchase Orders."""
        po_obj.status = 'fulfilled'
        po_obj.save()
        
        # Iterates across lines items moving stock allocations
        for line in po_obj.items.all():
            if line.inventory_item:
                inventory = line.inventory_item
                inventory.quantity_hand += line.quantity
                inventory.save()
        
        return po_obj
