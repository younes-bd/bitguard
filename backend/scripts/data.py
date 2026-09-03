import os
import django
import sys
import random
from datetime import timedelta
from decimal import Decimal

# Setup Django Environment
# Get the backend root directory
import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db import transaction

from apps.tenants.models import Tenant
from apps.users.models import Role, UserRole
from apps.core.models import Partner
from apps.crm.models import Client, Contact, Lead, Deal, Activity
from apps.accounting.models import Invoice, Payment, Expense
from apps.soc.models import Alert, Incident, ThreatIntelligence, LogAnalysis
from apps.ecommerce.models import Product, Order, LicenseKey

User = get_user_model()

def create_tenant():
    print("Creating Tenant...")
    tenant, created = Tenant.objects.get_or_create(
        domain="bitguard.tech",
        defaults={
            "name": "BitGuard Enterprise",
            "subscription_plan": "enterprise"
        }
    )
    return tenant

def create_users_and_roles(tenant):
    print("Creating Roles and Users...")
    role_admin, _ = Role.objects.get_or_create(name="SUPER_ADMIN", defaults={"description": "Super Administrator"})
    role_soc, _ = Role.objects.get_or_create(name="SOC_ADMIN", defaults={"description": "SOC Administrator"})
    
    # Admin User
    admin, created = User.objects.get_or_create(
        email="admin@bitguard.tech",
        defaults={
            "username": "admin@bitguard.tech",
            "first_name": "Admin",
            "last_name": "User",
            "is_staff": True,
            "is_superuser": True
        }
    )
    # Important update since email is primary, reset password if exists
    admin.set_password("admin")
    admin.save()
    UserRole.objects.get_or_create(user=admin, role=role_admin)
    partner, _ = Partner.objects.get_or_create(
        tenant=tenant,
        email=admin.email,
        defaults={"name": "Admin User", "bio": "Chief Executive Officer"}
    )
    admin.partner = partner
    admin.save()
    
    # Create tenant membership
    from apps.users.domain.models import TenantMembership
    TenantMembership.objects.get_or_create(
        user=admin,
        tenant=tenant,
        defaults={"is_active": True}
    )
        
    return admin

def create_crm_data(tenant, admin):
    print("Creating CRM Data...")
    from apps.crm.domain.models import Client, Contact, Deal, Activity, CrmStage
    
    # Create Stages
    stage_new, _ = CrmStage.objects.get_or_create(tenant=tenant, name="New", defaults={"sequence": 10})
    stage_qualified, _ = CrmStage.objects.get_or_create(tenant=tenant, name="Qualified", defaults={"sequence": 20})
    stage_negotiation, _ = CrmStage.objects.get_or_create(tenant=tenant, name="Negotiation", defaults={"sequence": 30})
    stage_won, _ = CrmStage.objects.get_or_create(tenant=tenant, name="Won", defaults={"sequence": 40, "is_won": True})
    
    clients = []
    for i, comp in enumerate(["TechCorp", "GlobalFlow", "DataSystems"]):
        # Client
        client = Client.objects.create(
            tenant=tenant,
            name=comp,
            industry="Technology",
            website=f"www.{comp.lower()}.com"
        )
        clients.append(client)
        
        # Contact
        contact = Contact.objects.create(
            tenant=tenant,
            client=client,
            first_name="John",
            last_name=f"Doe {i}",
            email=f"john.doe{i}@{comp.lower()}.com",
            phone=f"+1555000{i}{i}{i}"
        )
        
        # Deals
        deal = Deal.objects.create(
            tenant=tenant,
            client=client,
            title=f"{comp} Q3 Expansion",
            amount=Decimal("120000.00"),
            stage=stage_negotiation,
            expected_close_date=timezone.now().date() + timedelta(days=30),
            assigned_to=admin
        )
        
        # Activities
        Activity.objects.create(
            tenant=tenant,
            activity_type="meeting",
            description="Initial discovery call",
            deal=deal,
            created_by=admin
        )

    return clients

def create_erp_data(tenant, clients, admin):
    print("Creating ERP Data...")
    Invoice.objects.all().delete()
    Expense.objects.all().delete()
    
    for client in clients:
        invoice = Invoice.objects.create(
            tenant=tenant,
            invoice_number=f"INV-{random.randint(1000, 9999)}",
            client=client,
            total_amount=Decimal("15000.00"),
            issue_date=timezone.now().date(),
            due_date=timezone.now().date() + timedelta(days=30),
            status="sent"
        )
        
        Payment.objects.create(
            tenant=tenant,
            invoice=invoice,
            amount=Decimal("5000.00"),
            payment_date=timezone.now().date(),
            payment_method="bank_transfer",
            reference="TXN12345"
        )
        
    for _ in range(5):
        Expense.objects.create(
            tenant=tenant,
            title="Software Subscription",
            amount=Decimal("299.99"),
            incurred_date=timezone.now().date() - timedelta(days=random.randint(1, 10)),
            category="software",
            user=admin
        )

def create_soc_data(tenant, admin):
    print("Creating SOC Data...")
    Alert.objects.all().delete()
    Incident.objects.all().delete()
    
    alerts = []
    for i in range(5):
        alert = Alert.objects.create(
            tenant=tenant,
            title=f"Suspicious Login Activity {i}",
            description="Multiple failed login attempts detected.",
            severity=random.choice(["low", "medium", "high", "critical"]),
            source="Firewall",
        )
        alerts.append(alert)
        
    incident = Incident.objects.create(
        tenant=tenant,
        title="Ransomware containment",
        description="Isolated 3 endpoints",
        status="investigating",
        assigned_to=admin
    )
    incident.alerts.add(alerts[0], alerts[1])
    
    ThreatIntelligence.objects.create(
        indicator="192.168.1.100",
        indicator_type="IP Address",
        confidence=95,
        description="Known malicious IP from Emotet botnet"
    )
    
    LogAnalysis.objects.create(
        tenant=tenant,
        source_system="Windows Event Log",
        raw_log="Event 4624: An account was successfully logged on.",
        flagged_anomalous=False
    )

def create_store_data(tenant, admin):
    print("Creating Store Data...")
    Product.objects.all().delete()
    Order.objects.all().delete()
    LicenseKey.objects.all().delete()

    products_data = [
        {
            'name': 'BitGuard Enterprise License',
            'product_type': 'digital',
            'price': 1200.00,
            'description': 'Full enterprise security suite with 24/7 support.',
            'stock_quantity': 999
        },
        {
            'name': 'Dell Latitude 5540',
            'product_type': 'physical',
            'price': 1100.00,
            'description': 'Business laptop, i7, 16GB RAM, 512GB SSD.',
            'stock_quantity': 50
        },
        {
            'name': 'Cloud Storage 50TB',
            'product_type': 'subscription',
            'price': 450.00,
            'description': 'Secure encrypted cloud storage.',
            'stock_quantity': 999
        },
        {
            'name': 'Cisco Meraki MS120',
            'product_type': 'physical',
            'price': 1299.00,
            'description': 'Cloud-managed network switch.',
            'stock_quantity': 12
        }
    ]

    created_products = {}
    for p_data in products_data:
        product, created = Product.objects.get_or_create(
            name=p_data['name'],
            defaults={
                'slug': p_data['name'].lower().replace(' ', '-'),
                'product_type': p_data['product_type'],
                'price': p_data['price'],
                'description': p_data['description'],
                'stock_quantity': p_data['stock_quantity']
            }
        )
        created_products[product.name] = product

    enterprise_license = created_products['BitGuard Enterprise License']
    laptop = created_products['Dell Latitude 5540']
    cloud = created_products['Cloud Storage 50TB']
    
    orders_data = [
        {'product': enterprise_license, 'amount': 1200.00, 'status': 'completed', 'days_ago': 5},
        {'product': laptop, 'amount': 5500.00, 'status': 'processing', 'days_ago': 2}, 
        {'product': cloud, 'amount': 450.00, 'status': 'active', 'days_ago': 10},
    ]

    for o_data in orders_data:
        order = Order.objects.create(
            user=admin,
            product=o_data['product'],
            total_amount=o_data['amount'],
            status=o_data['status']
        )
        order.created_at = timezone.now() - timedelta(days=o_data['days_ago'])
        order.save()

    LicenseKey.objects.create(
        product=enterprise_license,
        key='BG-ENT-2025-XXXX-YYYY-ZZZZ',
        user=admin,
        is_used=True,
        assigned_at=timezone.now()
    )

def main():
    print("==========================================")
    print("INITIALIZING ENTERPRISE DATA POPULATION")
    print("==========================================")
    with transaction.atomic():
        tenant = create_tenant()
        
        # Set thread local tenant for abstract TenantAwareModels
        from apps.core.middleware import _thread_locals
        _thread_locals.tenant = tenant

        admin = create_users_and_roles(tenant)
        clients = create_crm_data(tenant, admin)
        create_erp_data(tenant, clients, admin)
        create_soc_data(tenant, admin)
        create_store_data(tenant, admin)
        
    print("==========================================")
    print("DATA POPULATION COMPLETE")
    print("Tenant Domain: bitguard.tech")
    print("User: admin@bitguard.tech / admin")
    print("==========================================")

if __name__ == '__main__':
    main()
