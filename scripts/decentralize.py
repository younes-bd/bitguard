import os
import shutil

# 1. Remove core/infrastructure/signals.py
core_signals_path = "backend/apps/core/infrastructure/signals.py"
if os.path.exists(core_signals_path):
    os.remove(core_signals_path)

core_apps_path = "backend/apps/core/apps.py"
with open(core_apps_path, "r") as f:
    core_apps = f.read()
core_apps = core_apps.replace("import apps.core.infrastructure.signals", "")
with open(core_apps_path, "w") as f:
    f.write(core_apps)

# 2. Add ecommerce/signals.py to define the generic events
ecommerce_signals_path = "backend/apps/ecommerce/signals.py"
os.makedirs("backend/apps/ecommerce", exist_ok=True)
with open(ecommerce_signals_path, "w") as f:
    f.write("""from django.dispatch import Signal
order_paid = Signal()
lifecycle_transition = Signal()
obligation_created = Signal()
""")
# Fix imports in ecommerce
ecommerce_services = "backend/apps/ecommerce/application/services.py"
if os.path.exists(ecommerce_services):
    with open(ecommerce_services, "r") as f:
        content = f.read()
    content = content.replace("from apps.core.infrastructure.signals import order_paid", "from apps.ecommerce.signals import order_paid")
    with open(ecommerce_services, "w") as f:
        f.write(content)

ecommerce_webhook = "backend/apps/ecommerce/webhook.py"
if os.path.exists(ecommerce_webhook):
    with open(ecommerce_webhook, "r") as f:
        content = f.read()
    content = content.replace("from apps.core.infrastructure.signals import order_paid", "from apps.ecommerce.signals import order_paid")
    with open(ecommerce_webhook, "w") as f:
        f.write(content)

# 3. Create projects/infrastructure/signals.py
os.makedirs("backend/apps/projects/infrastructure", exist_ok=True)
with open("backend/apps/projects/infrastructure/signals.py", "w") as f:
    f.write("""from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps
from django.db import transaction
import logging
logger = logging.getLogger(__name__)

@receiver(post_save, sender='crm.Deal')
def handle_deal_won(sender, instance, created, **kwargs):
    if instance.stage == 'won':
        Project = apps.get_model('projects', 'Project')
        try:
            with transaction.atomic():
                project, created_proj = Project.objects.get_or_create(
                    tenant=instance.tenant,
                    client=instance.client,
                    name=f"Project: {instance.title}",
                    defaults={
                        'status': 'planning',
                        'description': f"Auto-created from Deal {instance.id}",
                        'budget': instance.amount or 0,
                    }
                )
                if created_proj:
                    logger.info(f"Created Project from Deal {instance.id}")
        except Exception as e:
            logger.warning(f"Signal handle_deal_won skipped for Deal {instance.id}: {e}")
""")
with open("backend/apps/projects/apps.py", "r") as f:
    content = f.read()
if "import apps.projects.infrastructure.signals" not in content:
    content = content.replace("def ready(self):", "def ready(self):\n        import apps.projects.infrastructure.signals")
    with open("backend/apps/projects/apps.py", "w") as f:
        f.write(content)

# 4. Create crm/infrastructure/signals.py
os.makedirs("backend/apps/crm/infrastructure", exist_ok=True)
with open("backend/apps/crm/infrastructure/signals.py", "w") as f:
    f.write("""from django.dispatch import receiver
from django.apps import apps
from django.db import transaction
import logging
try:
    from apps.ecommerce.signals import order_paid
except ImportError:
    order_paid = None
logger = logging.getLogger(__name__)

if order_paid:
    @receiver(order_paid)
    def handle_order_paid(sender, order, request=None, **kwargs):
        Partner = apps.get_model('core', 'Partner')
        Client = apps.get_model('crm', 'Client')
        with transaction.atomic():
            partner, p_created = Partner.objects.update_or_create(
                email=order.user.email,
                defaults={
                    'name': f"{order.user.first_name} {order.user.last_name}".strip() or order.user.username,
                    'partner_type': 'customer'
                }
            )
            client, created = Client.objects.update_or_create(
                email=order.user.email,
                tenant=order.tenant,
                defaults={
                    'name': partner.name,
                    'partner': partner,
                    'status': 'active',
                }
            )
            logger.info(f"Synced core.Partner and crm.Client for paid Order {order.id}")
""")
with open("backend/apps/crm/apps.py", "r") as f:
    content = f.read()
if "import apps.crm.infrastructure.signals" not in content:
    content = content.replace("def ready(self):", "def ready(self):\n        import apps.crm.infrastructure.signals")
    with open("backend/apps/crm/apps.py", "w") as f:
        f.write(content)

# 5. Create inventory/infrastructure/signals.py
os.makedirs("backend/apps/inventory/infrastructure", exist_ok=True)
with open("backend/apps/inventory/infrastructure/signals.py", "w") as f:
    f.write("""from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps
import logging
logger = logging.getLogger(__name__)

@receiver(post_save, sender='inventory.InventoryItem')
def handle_low_stock(sender, instance, created, **kwargs):
    if instance.quantity_on_hand <= instance.reorder_level:
        Notification = apps.get_model('notifications', 'Notification')
        User = apps.get_model('users', 'User')
        admins = User.objects.filter(tenant=instance.tenant, role__name='TENANT_ADMIN')
        for admin in admins:
            Notification.objects.create(
                user=admin,
                tenant=instance.tenant,
                title="Low Stock Alert",
                message=f"Item {instance.sku} is below reorder level.",
                type="low_stock"
            )
""")
with open("backend/apps/inventory/apps.py", "r") as f:
    content = f.read()
if "import apps.inventory.infrastructure.signals" not in content:
    content = content.replace("def ready(self):", "def ready(self):\n        import apps.inventory.infrastructure.signals")
    with open("backend/apps/inventory/apps.py", "w") as f:
        f.write(content)

# 6. Create soc/infrastructure/signals.py
os.makedirs("backend/apps/soc/infrastructure", exist_ok=True)
with open("backend/apps/soc/infrastructure/signals.py", "w") as f:
    f.write("""from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps
import logging
logger = logging.getLogger(__name__)

@receiver(post_save, sender='subscriptions.servicecontract')
def handle_contract_created(sender, instance, created, **kwargs):
    if created:
        Workspace = apps.get_model('soc', 'Workspace')
        Workspace.objects.get_or_create(
            tenant=instance.tenant,
            defaults={
                'name': f"SOC Workspace: {instance.client.name}",
                'is_active': True
            }
        )
        logger.info(f"Created SOC Workspace for Contract {instance.id}")

@receiver(post_save, sender='helpdesk.slabreach')
def handle_sla_breach(sender, instance, created, **kwargs):
    if created:
        Alert = apps.get_model('soc', 'Alert')
        Alert.objects.create(
            tenant=instance.tenant,
            title=f"SLA Breach: {instance.get_breach_type_display()}",
            description=f"A breach occurred on contract {instance.contract} for ticket {instance.ticket_id}.",
            severity='high',
            source='SLA_MONITOR'
        )
        logger.info(f"Created SOC Alert for SLA Breach {instance.id}")
""")
with open("backend/apps/soc/apps.py", "r") as f:
    content = f.read()
if "import apps.soc.infrastructure.signals" not in content:
    content = content.replace("def ready(self):", "def ready(self):\n        import apps.soc.infrastructure.signals")
    with open("backend/apps/soc/apps.py", "w") as f:
        f.write(content)

print("Decentralization complete.")
