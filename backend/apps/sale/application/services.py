from ..domain.models import SaleOrder, SaleOrderLine
from django.db import transaction

class SaleOrderService:
    @staticmethod
    @transaction.atomic
    def confirm_sale_order(order: SaleOrder):
        """
        Confirms a quotation into a sales order.
        """
        if order.status != 'draft':
            raise ValueError("Only draft quotations can be confirmed.")
        order.status = 'sale'
        order.save()
        # In the future: generate DeliveryNote from sale order lines
        return order
