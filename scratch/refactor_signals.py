import os

BACKEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')

# 1. Sale Signals
sale_signals = os.path.join(BACKEND_DIR, 'apps', 'sale', 'infrastructure', 'signals.py')

new_sale_content = '''fromdjango.db.models.signals import post_save
from django.dispatch import receiver, Signal
from apps.sale.domain.models import SaleOrder
from apps.notifications.application.services import NotificationService

sale_order_confirmed_signal = Signal()

@receiver(post_save, sender=SaleOrder)
def sale_order_confirmed(sender, instance, created, **kwargs):
    if instance.status == 'sale' or instance.status == 'confirmed':
        if getattr(instance, '_signal_sent', False):
            return
        instance._signal_sent = True
        
        # Dispatch to other apps using Rule 12B!
        sale_order_confirmed_signal.send(sender=SaleOrder, instance=instance)
        
        if instance.assigned_to:
            NotificationService.create_notification(
                user=instance.assigned_to,
                tenant=instance.tenant,
               (n_type='erp',
                title='Sale Order Confirmed',
                message=f'Sale order {instance.order_number} has been confirmed.'
            )
'''
with open(sale_signals, 'w') as f:
    f.write(new_sale_content)

# 2. Stock listening to Sale
stock_signals = os.path.join(BACKEND_DIR, 'apps', 'stock', 'infrastructure', 'signals.py')

new_stock_listener = '''
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
'''
with open(stock_signals, 'a') as f:
    f.write(new_stock_listener)

# 3. Projects listening to Sale
projects_signals = os.path.join(BACKEND_DIR, 'apps', 'projects', 'infrastructure', 'signals.py')
os.makedirs(os.path.dirname(projects_signals), exist_ok=True)
with open(projects_signals, 'w') as f:
    f.write('''from django.dispatch import receiver

try:
    from apps.sale.infrastructure.signals import sale_order_confirmed_signal
    @receiver(sale_order_confirmed_signal)
    def create_project_tasks_on_sale(sender, instance, **kwargs):
        from apps.projects.domain.models import Project, Task
        project = None
        for line in instance.lines.all():
            if line.product and getattr(line.product, 'product_type', '') in ['service', 'subscription', 'service_bundle']:
                if not project:
                    project, _ = Project.objects.get_or_create(
                        tenant=instance.tenant,
                        name=f\{instance.order_number} - \{instance.client.name}",
                        defaults={
                            'client': instance.client,
                            'project_type': 'client',
                            'status': 'planning'
                        }
                    )
                
                Task.objects.get_or_create(
                    tenant=instance.tenant,
                    project=project,
                    title=f"{line.product.name}",
                    defaults={
                        'description': getattr(line, 'name', line.product.name),
                        'status': 'todo',
                        'estimated_hours': line.product_uom_qty
                    }
                )
except ImportError:
    pass
''')

# 4. Make sure projects signals are loaded
projects_apps = os.path.join(BACKEND_DIR, 'apps', 'projects', 'apps.py')
if os.path.exists(projects_apps):
    with open(projects_apps, 'r') as f:
        p_content = f.read()
    if 'import apps.projects.infrastructure.signals' not in p_content:
        p_content = p_content.replace('def ready(self):', 'def ready(self):\n        try:\n            import apps.projects.infrastructure.signals\n        except ImportError:\n            pass')
        with open(projects_apps, 'w') as f:
            f.write(p_content)

print('Signal refactoring completed.')