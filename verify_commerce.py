import os
import django
from decimal import Decimal
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bitguard.settings')
django.setup()

from apps.store.models import Product, Order
from apps.erp.models import Service, Invoice
from apps.crm.models import Client, Quote, QuoteItem, Deal
from django.contrib.auth import get_user_model
from workflow_logic import explode_bundle, convert_quote_to_invoice

User = get_user_model()

def run_verification():
    print("=========================================")
    print("VERIFICATION: COMMERCE WORKFLOW")
    print("=========================================")
    
    # 1. Setup Data
    user, _ = User.objects.get_or_create(username='test_user', defaults={'email': 'test@example.com'})
    client, _ = Client.objects.get_or_create(name="MegaCorp", client_type='company')
    
    # Create Services
    soc_service, _ = Service.objects.get_or_create(name="SOC Monitoring", base_price=5000, service_type='subscription')
    
    # Create Products
    prod_digital, _ = Product.objects.get_or_create(
        name="Antivirus Key", slug='av-key', product_type='digital', price=50
    )
    prod_service_wrapper, _ = Product.objects.get_or_create(
        name="SOC Subscription", slug='soc-sub', product_type='subscription', price=6000,
        service=soc_service
    )
    
    # Create Bundle
    bundle, _ = Product.objects.get_or_create(
        name="Secure Office Bundle", slug='office-bundle', product_type='service_bundle', price=5500
    )
    bundle.components.add(prod_digital, prod_service_wrapper)
    bundle.save()
    print("  - Setup Complete: Created Bundle + Components.")

    # ---------------------------------------------------------
    # SCENARIO 1: Quote to Cash
    # ---------------------------------------------------------
    print("\n[SCENARIO 1] Quote -> Proforma Invoice")
    quote = Quote.objects.create(client=client, status='draft')
    QuoteItem.objects.create(quote=quote, product=bundle, quantity=1, unit_price=bundle.price, amount=bundle.price)
    quote.save()
    print(f"  - Created Quote {quote.id} (Status: {quote.status})")
    
    # Accept
    quote.status = 'accepted'
    quote.save()
    
    # Convert
    inv = convert_quote_to_invoice(quote)
    if inv and inv.status == 'proforma':
        print(f"  - SUCCESS: Invoice {inv.id} created with status 'proforma'.")
    else:
        print("  - FAIL: Invoice creation failed.")

    # ---------------------------------------------------------
    # SCENARIO 2: Bundle Explosion
    # ---------------------------------------------------------
    print("\n[SCENARIO 2] Bundle Order Fulfillment")
    order = Order.objects.create(user=user, product=bundle, status='paid', amount=bundle.price)
    
    # Link Order to Invoice (to simulate full flow)
    if inv:
        inv.order = order
        inv.save()
        
    explode_bundle(order)
    
    print("\n=========================================")
    print("VERIFICATION COMPLETE")
    print("=========================================")

if __name__ == '__main__':
    run_verification()
