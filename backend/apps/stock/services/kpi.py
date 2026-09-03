import logging
from django.db.models import Sum, F
logger = logging.getLogger(__name__)

def get_kpis(tenant=None, date_range='30days'):
    metrics = {"stock": {"low_stock_alerts": 0, "inventory_value": 0, "pending_transfers": 0}}
    try:
        from apps.product.services import ProductService
        from apps.stock.domain.models import StockPicking
        
        pickings = StockPicking.objects.filter(state__in=['draft', 'waiting', 'confirmed'])
        if tenant:
            pickings = pickings.filter(tenant=tenant)
            
        val = ProductService.calculate_total_valuation(tenant=tenant)
            
        metrics["stock"] = {
            "low_stock_alerts": 0,
            "inventory_value": val,
            "pending_transfers": pickings.count()
        }
    except Exception as e:
        logger.warning(f"Stock KPI error: {e}")
    return metrics
