import pytest
from tests.factories import DealFactory, TenantFactory, UserFactory
from apps.crm.models import Deal
from apps.accounting.domain.models import Invoice
from apps.contracts.models import ServiceContract

pytestmark = pytest.mark.django_db

class TestCrossModuleWorkflows:
    def test_crm_deal_won_triggers_erp_project(self):
        # Create a Deal in the prospect stage
        deal = DealFactory(stage='prospect')
        
        # Transition the deal to won
        deal.stage = 'won'
        deal.save()
        
        # Verify that a ServiceContract and Invoice were automatically created via Signals
        contract = ServiceContract.objects.filter(client=deal.client).first()
        invoice = Invoice.objects.filter(client=deal.client).first()
        
        assert contract is not None
        assert invoice is not None
        assert invoice.total_amount == deal.amount

class TestTenantIsolation:
    def test_tenant_data_isolation(self, api_client):
        tenant_a = TenantFactory()
        tenant_b = TenantFactory()
        
        user_a = UserFactory(is_staff=False)
        
        deal_b = DealFactory(tenant=tenant_b, title="Secret Deal B")
        
        # Authenticate as User A
        api_client.force_authenticate(user=user_a)
        
        # Try to access Deals API with Tenant A headers
        response = api_client.get('/api/crm/deals/', HTTP_X_TENANT_ID=tenant_a.domain)
        
        # Verify the response succeeds but DOES NOT contain deal_b
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 0 # Should be 0 since Tenant A has no deals

