from ..domain.models import Vendor, PurchaseOrder, InventoryItem

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

from ..domain.models import GoodsReceipt, GoodsReceiptLine, StockMove
from django.db import transaction

class ReceiptService:
    @staticmethod
    @transaction.atomic
    def validate_receipt(receipt: GoodsReceipt):
        if receipt.status != 'draft':
            raise ValueError("Only draft receipts can be validated.")
        
        receipt.status = 'done'
        receipt.save()

        for line in receipt.lines.all():
            if line.inventory_item:
                inventory = line.inventory_item
                inventory.quantity_on_hand += line.quantity_received
                inventory.save()

                # Create stock move
                StockMove.objects.create(
                    tenant=receipt.tenant,
                    inventory_item=inventory,
                    receipt_line=line,
                    quantity=line.quantity_received,
                    reference=receipt.receipt_number
                )
        return receipt
