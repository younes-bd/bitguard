from ..domain.models import SalesOrder, SalesOrderLine
from django.db import transaction

class SalesOrderService:
    @staticmethod
    @transaction.atomic
    def confirm_sale_order(order: SalesOrder):
        """
        Confirms a quotation into a sales order.
        """
        if order.status != 'draft':
            raise ValueError("Only draft quotations can be confirmed.")
        order.status = 'sale'
        order.save()
        # In the future: generate DeliveryNote from sale order lines
        return order
