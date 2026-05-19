from django.test import TestCase, RequestFactory
from django.utils import timezone
from unittest.mock import MagicMock
from apps.erp.models import Invoice, Payment, GeneralLedger
from apps.erp.services import InvoiceService, PaymentService
from apps.crm.models import Client
from apps.tenants.models import Tenant
from django.contrib.auth import get_user_model

User = get_user_model()

class ErpServiceTests(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.tenant = Tenant.objects.create(name="Test Tenant", domain="test.com")
        self.user = User.objects.create_user(username="testuser", email="test@test.com", password="password")
        self.client_obj = Client.objects.create(tenant=self.tenant, name="Test Client", email="client@test.com")
        
        # Mock request with tenant context
        self.request = self.factory.get('/')
        self.request.user = self.user
        self.request.tenant = self.tenant

    def test_create_invoice_with_items(self):
        invoice_data = {
            "invoice_number": "INV-100",
            "client": self.client_obj,
            "issue_date": timezone.now().date(),
            "due_date": timezone.now().date(),
        }
        items = [
            {"description": "Consulting", "quantity": 10, "unit_price": 100, "tax_rate": 20},
            {"description": "Hardware", "quantity": 1, "unit_price": 500, "tax_rate": 0},
        ]
        
        invoice = InvoiceService.create_invoice(self.request, invoice_data, items)
        
        # Verify totals
        # Consulting: 10 * 100 = 1000 + 200 (20% tax) = 1200
        # Hardware: 1 * 500 = 500 + 0 tax = 500
        # Grand Total: 1700
        self.assertEqual(invoice.total_amount, 1700)
        self.assertEqual(invoice.items.count(), 2)
        
        # Verify General Ledger entries
        # Two entries per invoice (AR and Revenue)
        self.assertEqual(GeneralLedger.objects.filter(reference_id=invoice.pk).count(), 2)
        
        ar_entry = GeneralLedger.objects.get(account_name="Accounts Receivable", reference_id=invoice.pk)
        self.assertEqual(ar_entry.amount, 1700)
        self.assertEqual(ar_entry.entry_type, 'debit')

    def test_record_payment_updates_invoice(self):
        invoice = Invoice.objects.create(
            tenant=self.tenant,
            client=self.client_obj,
            invoice_number="INV-200",
            issue_date=timezone.now().date(),
            due_date=timezone.now().date(),
            total_amount=1000
        )
        
        payment_data = {
            "amount": 1000,
            "payment_date": timezone.now().date(),
            "payment_method": "bank_transfer"
        }
        
        PaymentService.record_payment(self.request, invoice, payment_data)
        
        invoice.refresh_from_db()
        self.assertEqual(invoice.status, 'paid')
        self.assertIsNotNone(invoice.paid_at)
        
        # Verify Ledger
        self.assertTrue(GeneralLedger.objects.filter(account_name="Cash", entry_type="debit").exists())
