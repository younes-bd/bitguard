from django.db.models import Count
from .domain.models import Product

class ProductService:
    @staticmethod
    def duplicate_product(product):
        product.pk = None
        product.name = f'Copy of {product.name}'
        product.slug = f'{product.slug}-copy-{Product.objects.count()}'
        product.status = 'draft'
        product.stripe_price_id = ''
        product.save()
        return product

    @staticmethod
    def get_stats(tenant=None):
        qs = Product.objects.all()
        if tenant:
            qs = qs.filter(tenant=tenant)
        total = qs.count()
        by_status = qs.values('status').annotate(count=Count('id'))
        by_type = qs.values('product_type').annotate(count=Count('id'))
        low_stock = qs.filter(track_stock=True, stock_quantity__lt=5).count()
        featured = qs.filter(is_featured=True).count()
        return {
            'total': total,
            'by_status': {item['status']: item['count'] for item in by_status},
            'by_type': {item['product_type']: item['count'] for item in by_type},
            'low_stock': low_stock,
            'featured': featured,
        }

    @staticmethod
    def calculate_total_valuation(tenant=None):
        from django.db.models import Sum, F
        qs = Product.objects.all()
        if tenant:
            qs = qs.filter(tenant=tenant)
            
        try:
            # We assume cost * qty_available, but since qty_available isn't explicitly on Product, 
            # we will just use stock_quantity * cost as a fallback for this demo
            val = float(qs.aggregate(t=Sum(F('stock_quantity') * F('cost')))['t'] or 0)
            return val
        except:
            return 0

