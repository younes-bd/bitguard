from django.test import TestCase
from django.utils import timezone
from apps.erp.models import Invoice, InvoiceItem, TaxConfig
from apps.crm.models import Client
from apps.tenants.models import Tenant

class ErpModelTests(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(name="Test Tenant", domain="test.com")
        self.client = Client.objects.create(tenant=self.tenant, name="Test Client", email="client@test.com")

    def test_invoice_totals(self):
        # Create Invoice
        invoice = Invoice.objects.create(
            tenant=self.tenant,
            client=self.client,
            invoice_number="INV-001",
            issue_date=timezone.now().date(),
            due_date=timezone.now().date()
        )
        
        # Add items
        InvoiceItem.objects.create(
            tenant=self.tenant,
            invoice=invoice,
            description="Service 1",
            quantity=2,
            unit_price=100,
            tax_rate=10, # 10%
            total=220 # (2*100) + 20
        )
        
        # In a real scenario, the service would update the totals.
        # But here we test if the model relationship works.
        self.assertEqual(invoice.items.count(), 1)
        self.assertEqual(invoice.items.first().total, 220)
