from django.test import TestCase
from decimal import Decimal
from apps.tenants.domain.models import Tenant
from apps.users.domain.models import User
from apps.users.domain.models import TenantMembership
from apps.crm.domain.models import Client
from apps.accounting.domain.models import Invoice, InvoiceItem, Payment, GeneralLedger, Account
from apps.accounting.application.services import GeneralLedgerService

class FinanceOperationTests(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(name="Test Corp", domain="test.example.com")
        self.user = User.objects.create_user(
            username="tester",
            email="tester@example.com",
            password="password"
        )
        TenantMembership.objects.create(user=self.user, tenant=self.tenant)
        self.client = Client.objects.create(
            tenant=self.tenant,
            name="Acme Corp",
            email="contact@acme.com"
        )
        # Ensure default accounts exist for testing
        self.ar_account = Account.objects.create(
            tenant=self.tenant, name="Accounts Receivable", code="1200", account_type="asset"
        )
        self.revenue_account = Account.objects.create(
            tenant=self.tenant, name="Sales Revenue", code="4000", account_type="revenue"
        )
        self.cash_account = Account.objects.create(
            tenant=self.tenant, name="Cash", code="1000", account_type="asset"
        )

    def test_invoice_generation_and_gl_posting(self):
        """Test that confirming an invoice generates correct GL entries."""
        # 1. Create Invoice
        invoice = Invoice.objects.create(
            tenant=self.tenant,
            client=self.client,
            invoice_number="INV-1001",
            status="draft",
            total_amount=Decimal('1500.00'),
            issue_date="2026-06-16",
            due_date="2026-07-16"
        )
        InvoiceItem.objects.create(
            tenant=self.tenant,
            invoice=invoice,
            description="Consulting Services",
            quantity=10,
            unit_price=Decimal('150.00'),
            total=Decimal('1500.00')
        )

        # 2. Confirm Invoice -> Post to GL
        invoice.status = "sent"
        invoice.save()

        # Simulate the service call that normally happens in the view/serializer
        # Assuming GeneralLedgerService.record_entry is used
        class DummyRequest:
            user = self.user
            tenant = self.tenant

        GeneralLedgerService.record_entry(
            request=DummyRequest(),
            account_name="Accounts Receivable",
            amount=invoice.total_amount,
            entry_type='debit',
            ref_id=invoice.id,
            ref_type='invoice',
            description=f"Invoice {invoice.invoice_number} sent to {self.client.name}"
        )
        GeneralLedgerService.record_entry(
            request=DummyRequest(),
            account_name="Sales Revenue",
            amount=invoice.total_amount,
            entry_type='credit',
            ref_id=invoice.id,
            ref_type='invoice',
            description=f"Revenue from Invoice {invoice.invoice_number}"
        )

        # 3. Assert GL entries
        entries = GeneralLedger.objects.filter(reference_type='invoice', reference_id=invoice.id)
        self.assertEqual(entries.count(), 2)
        debit_entry = entries.get(entry_type='debit')
        credit_entry = entries.get(entry_type='credit')
        self.assertEqual(debit_entry.amount, Decimal('1500.00'))
        self.assertEqual(debit_entry.account.name, "Accounts Receivable")
        self.assertEqual(credit_entry.amount, Decimal('1500.00'))
        self.assertEqual(credit_entry.account.name, "Sales Revenue")

    def test_payment_processing_clears_ar(self):
        """Test that receiving payment debits Cash and credits AR."""
        invoice = Invoice.objects.create(
            tenant=self.tenant,
            client=self.client,
            invoice_number="INV-1002",
            status="sent",
            total_amount=Decimal('2000.00'),
            issue_date="2026-06-16",
            due_date="2026-07-16"
        )
        
        # Make Payment
        payment = Payment.objects.create(
            tenant=self.tenant,
            invoice=invoice,
            amount=Decimal('2000.00'),
            payment_date="2026-06-16",
            payment_method="bank_transfer"
        )

        invoice.status = "paid"
        invoice.save()

        class DummyRequest:
            user = self.user
            tenant = self.tenant

        # Record Payment GL
        GeneralLedgerService.record_entry(
            request=DummyRequest(),
            account_name="Cash",
            amount=payment.amount,
            entry_type='debit',
            ref_id=payment.id,
            ref_type='payment',
            description=f"Payment received for {invoice.invoice_number}"
        )
        GeneralLedgerService.record_entry(
            request=DummyRequest(),
            account_name="Accounts Receivable",
            amount=payment.amount,
            entry_type='credit',
            ref_id=payment.id,
            ref_type='payment',
            description=f"Payment received for {invoice.invoice_number}"
        )

        entries = GeneralLedger.objects.filter(reference_type='payment', reference_id=payment.id)
        self.assertEqual(entries.count(), 2)
        
        debit = entries.get(entry_type='debit')
        credit = entries.get(entry_type='credit')
        
        self.assertEqual(debit.account.name, "Cash")
        self.assertEqual(credit.account.name, "Accounts Receivable")
        self.assertEqual(debit.amount, Decimal('2000.00'))
        self.assertEqual(credit.amount, Decimal('2000.00'))
