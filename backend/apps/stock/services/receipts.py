from django.utils import timezone
from apps.stock.domain.models import GoodsReceipt

class ReceiptService:
    @staticmethod
    def generate_for_purchase_order(order, user):
        return GoodsReceipt.objects.create(
            tenant=order.tenant,
            purchase_order=order,
            status='draft',
            created_by=user,
            receipt_date=timezone.now().date()
        )
