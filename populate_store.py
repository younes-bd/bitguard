
import os
import django
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bitguard.settings")
django.setup()

from apps.store.models import Product, Order, LicenseKey, Plan, Subscription
from apps.core.models import Tenant
from django.contrib.auth import get_user_model

User = get_user_model()

def populate():
    print("Populating Store Data...")
    
    # Get Admin User
    user = User.objects.filter(email='admin@bitguard.com').first()
    if not user:
        user = User.objects.filter(is_superuser=True).first()
    
    if not user:
        print("No user found. Create a superuser first.")
        return

    print(f"Using User: {user.email}")
    
    # 1. Create Products
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
        if created:
            print(f"Created Product: {product.name}")

    # 2. Create Orders for this User
    # Clean old orders
    # Order.objects.filter(user=user).delete()

    enterprise_license = Product.objects.get(name='BitGuard Enterprise License')
    laptop = Product.objects.get(name='Dell Latitude 5540')
    
    orders_data = [
        {'product': enterprise_license, 'amount': 1200.00, 'status': 'completed', 'days_ago': 5},
        {'product': laptop, 'amount': 5500.00, 'status': 'processing', 'days_ago': 2}, # 5 laptops
         {'product': Product.objects.get(name='Cloud Storage 50TB'), 'amount': 450.00, 'status': 'active', 'days_ago': 10},

    ]

    for o_data in orders_data:
        order, created = Order.objects.get_or_create(
            user=user,
            product=o_data['product'],
            amount=o_data['amount'],
            status=o_data['status']
        )
        # Update date
        order.created_at = timezone.now() - timedelta(days=o_data['days_ago'])
        order.save()
        print(f"Created Order: {order}")

    # 3. Create Licenses
    if not LicenseKey.objects.filter(user=user, product=enterprise_license).exists():
        LicenseKey.objects.create(
            product=enterprise_license,
            key='BG-ENT-2025-XXXX-YYYY-ZZZZ',
            user=user,
            is_used=True,
            assigned_at=timezone.now()
        )
        print("Created License Key")
        
    print("Done!")

if __name__ == '__main__':
    populate()
