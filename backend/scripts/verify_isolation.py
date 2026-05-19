import os
import uuid
import django
from django.contrib.auth import get_user_model
from apps.tenants.models import Tenant
from apps.crm.models import Client
from apps.support.models import Ticket
from apps.erp.models import Invoice
from django.test import RequestFactory

User = get_user_model()

def verify_isolation():
    print("🚀 Starting Tenant Isolation Verification...")
    
    suffix = uuid.uuid4().hex[:6]
    tenant_a = Tenant.objects.create(name=f"Tenant Alpha {suffix}", domain=f"alpha-{suffix}.bitguard.tech")
    tenant_b = Tenant.objects.create(name=f"Tenant Beta {suffix}", domain=f"beta-{suffix}.bitguard.tech")
    
    user_a = User.objects.create_user(username=f"alpha_user_{suffix}", email=f"a-{suffix}@test.com", password="password", tenant=tenant_a)
    user_b = User.objects.create_user(username=f"beta_user_{suffix}", email=f"b-{suffix}@test.com", password="password", tenant=tenant_b)
    
    # Create private data for Tenant A
    client_a = Client.objects.create(name="Secret Client A", tenant=tenant_a)
    ticket_a = Ticket.objects.create(title="Private Ticket A", description="Secret", tenant=tenant_a, customer=user_a)
    
    print(f"✅ Created test data for {tenant_a.name} and {tenant_b.name}")

    # 2. Test Model Layer (Implicit Filtering)
    print("🔍 Testing Model Layer Isolation...")
    # This should be handled by the developer using the manager or service
    # But let's check if our filter_by_context service works as expected
    
    from apps.core.services.base import BaseService
    factory = RequestFactory()
    
    # Mock request for User B
    request_b = factory.get('/')
    request_b.user = user_b
    request_b.tenant = tenant_b
    
    # Attempt to query Client A using User B's context
    clients_visible_to_b = BaseService.filter_by_context(Client.objects.all(), request_b)
    
    if client_a in clients_visible_to_b:
        print("❌ CRITICAL FAILURE: Tenant B can see Tenant A's Client!")
    else:
        print("✅ Success: Tenant B cannot see Tenant A's Client.")

    # Attempt to query Ticket A using User B's context
    tickets_visible_to_b = BaseService.filter_by_context(Ticket.objects.all(), request_b)
    if ticket_a in tickets_visible_to_b:
        print("❌ CRITICAL FAILURE: Tenant B can see Tenant A's Ticket!")
    else:
        print("✅ Success: Tenant B cannot see Tenant A's Ticket.")

    # 3. Test Ownership Validation
    print("🔍 Testing Ownership Validation (validate_ownership)...")
    try:
        BaseService.validate_ownership(client_a, request_b)
        print("❌ CRITICAL FAILURE: validate_ownership allowed cross-tenant access!")
    except Exception as e:
        print(f"✅ Success: validate_ownership blocked access (Caught: {type(e).__name__})")

    # 4. Cleanup
    client_a.delete()
    ticket_a.delete()
    user_a.delete()
    user_b.delete()
    tenant_a.delete()
    tenant_b.delete()
    print("🧹 Cleanup complete.")
    print("🎉 Verification Finished.")

verify_isolation()
