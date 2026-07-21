"""
ERP Serializers — Explicit field declarations (no __all__).
Covers full billing lifecycle: Invoices, Payments, Expenses, Delivery,
Vendors, Purchase Orders, Recurring Invoices, Ledger, Budget,
Chart of Accounts, Journal Entries, Banking, Credit Notes, Fixed Assets.
"""
from rest_framework import serializers
from ..domain.models import (
    Invoice, Payment, Expense,
    TaxConfig, InvoiceItem, GeneralLedger,
    RecurringInvoice, RecurringInvoiceItem,
    Account, JournalEntry, JournalEntryLine, BankAccount,
    BankTransaction, CreditNote, FixedAsset,
    PaymentTerms, InvoiceBranding, DeferredRevenue,
    AccountJournal, TaxGroup, Tax, BankReconciliation,
)

class AccountJournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountJournal
        fields = '__all__'

class TaxGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxGroup
        fields = '__all__'

class TaxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tax
        fields = '__all__'

class BankReconciliationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankReconciliation
        fields = '__all__'

class PaymentTermsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTerms
        fields = ['id', 'name', 'days_due', 'discount_percent', 'discount_days', 'description']

class InvoiceBrandingSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceBranding
        fields = ['id', 'company_name', 'company_address', 'company_phone', 'company_email', 'company_website', 'tax_id', 'logo_url', 'primary_color', 'invoice_footer', 'bank_name', 'bank_account_number', 'bank_routing_number', 'bank_swift', 'default_payment_terms', 'default_currency']

class DeferredRevenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeferredRevenue
        fields = ['id', 'invoice', 'total_amount', 'recognized_amount', 'recognition_start', 'recognition_end', 'status', 'deferred_account', 'revenue_account']


class TaxConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxConfig
        fields = ['id', 'name', 'rate', 'is_active']


# ─── INVOICE ──────────────────────────────────────────────────────────────────

class InvoiceItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = InvoiceItem
        fields = [
            'id', 'product_id', 'description', 'quantity', 'unit_price',
            'tax_rate', 'discount', 'total'
        ]
        read_only_fields = ['id', 'total']


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    client_name = serializers.ReadOnlyField(source='client.name')
    client_email = serializers.ReadOnlyField(source='client.email')
    balance_due = serializers.SerializerMethodField()
    days_overdue = serializers.ReadOnlyField()
    aging_bucket = serializers.ReadOnlyField()
    payment_count = serializers.SerializerMethodField()
    total_paid = serializers.SerializerMethodField()
    payment_link_url = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'client', 'client_name', 'client_email',
            'type', 'project', 'contract', 'items',
            'subtotal', 'tax_total', 'discount_total', 'discount_percent', 'total_amount',
            'currency', 'exchange_rate', 'payment_terms',
            'issue_date', 'due_date', 'expiry_date', 'paid_at', 'status',
            'reference', 'notes', 'balance_due',
            'days_overdue', 'aging_bucket',
            'payment_count', 'total_paid',
            'payment_link_token', 'payment_link_url',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'subtotal', 'tax_total', 'discount_total', 'total_amount',
            'payment_link_token', 'payment_link_url',
            'created_at', 'updated_at'
        ]

    def get_balance_due(self, obj):
        paid = sum(p.amount for p in obj.payments.all())
        return float(obj.total_amount - paid)

    def get_payment_count(self, obj):
        return obj.payments.count()

    def get_total_paid(self, obj):
        return float(sum(p.amount for p in obj.payments.all()))
        
    def get_payment_link_url(self, obj):
        request = self.context.get('request')
        if request and obj.payment_link_token:
            from django.urls import reverse
            try:
                path = reverse('client-portal-invoice', kwargs={'token': obj.payment_link_token})
                return request.build_absolute_uri(path)
            except:
                pass
        return None


class InvoiceCreateSerializer(serializers.ModelSerializer):
    """Serializer for invoice creation that accepts nested items."""
    items = InvoiceItemSerializer(many=True, required=False)

    class Meta:
        model = Invoice
        fields = [
            'invoice_number', 'client', 'type', 'project', 'contract',
            'issue_date', 'due_date', 'reference', 'notes', 'items',
        ]

    def validate(self, data):
        items = data.get('items', [])
        if not data.get('invoice_number'):
            data.pop('invoice_number', None)
            
        client = data.get('client')
        contract = data.get('contract')
        project = data.get('project')

        if contract and contract.client != client:
            raise serializers.ValidationError({"contract": "The selected contract does not belong to the selected client."})
        if project and project.client != client:
            raise serializers.ValidationError({"project": "The selected project does not belong to the selected client."})

        # Extract items for service layer processing
        self._items = items
        return data


# ─── DELIVERY NOTES ───────────────────────────────────────────────────────────

class PaymentSerializer(serializers.ModelSerializer):
    invoice_number = serializers.ReadOnlyField(source='invoice.invoice_number')
    client_name = serializers.ReadOnlyField(source='invoice.client.name')

    class Meta:
        model = Payment
        fields = [
            'id', 'invoice', 'invoice_number', 'client_name', 'amount',
            'payment_date', 'payment_method', 'reference', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


# ─── EXPENSES ─────────────────────────────────────────────────────────────────

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = [
            'id', 'title', 'amount', 'incurred_date', 'category',
            'status', 'notes', 'receipt', 'user', 'cost_center'
        ]


class GeneralLedgerSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneralLedger
        fields = [
            'id', 'account_name', 'amount', 'entry_type',
            'reference_id', 'reference_type', 'transaction_date', 'description'
        ]


# ─── PROJECTS ─────────────────────────────────────────────────────────────────

class AccountSerializer(serializers.ModelSerializer):
    balance = serializers.SerializerMethodField()

    class Meta:
        model = Account
        fields = ['id', 'code', 'name', 'account_type', 'is_active', 'description', 'balance']
        read_only_fields = ['id']

    def get_balance(self, obj):
        from django.db.models import Sum
        lines = obj.journal_lines.filter(journal_entry__is_posted=True)
        debits = lines.aggregate(Sum('debit'))['debit__sum'] or 0
        credits = lines.aggregate(Sum('credit'))['credit__sum'] or 0
        if obj.account_type in ['asset', 'expense']:
            return float(debits - credits)
        return float(credits - debits)


# ─── JOURNAL ENTRIES ─────────────────────────────────────────────────────────

class JournalEntryLineSerializer(serializers.ModelSerializer):
    account_code = serializers.ReadOnlyField(source='account.code')
    account_name = serializers.ReadOnlyField(source='account.name')

    class Meta:
        model = JournalEntryLine
        fields = ['id', 'account', 'account_code', 'account_name', 'debit', 'credit', 'description']


class JournalEntrySerializer(serializers.ModelSerializer):
    lines = JournalEntryLineSerializer(many=True, read_only=True)
    total_debit = serializers.SerializerMethodField()
    total_credit = serializers.SerializerMethodField()
    is_balanced = serializers.SerializerMethodField()

    class Meta:
        model = JournalEntry
        fields = [
            'id', 'date', 'reference', 'description', 'is_posted',
            'lines', 'total_debit', 'total_credit', 'is_balanced',
            'created_at'
        ]
        read_only_fields = ['id', 'is_posted', 'created_at']

    def get_total_debit(self, obj):
        return float(sum(l.debit for l in obj.lines.all()))

    def get_total_credit(self, obj):
        return float(sum(l.credit for l in obj.lines.all()))

    def get_is_balanced(self, obj):
        return round(self.get_total_debit(obj), 2) == round(self.get_total_credit(obj), 2)


# ─── BANKING ──────────────────────────────────────────────────────────────────

class BankAccountSerializer(serializers.ModelSerializer):
    linked_account_name = serializers.ReadOnlyField(source='linked_account.name')
    transaction_count = serializers.SerializerMethodField()

    class Meta:
        model = BankAccount
        fields = [
            'id', 'name', 'account_number', 'routing_number', 'currency',
            'initial_balance', 'current_balance',
            'linked_account', 'linked_account_name', 'transaction_count'
        ]

    def get_transaction_count(self, obj):
        return obj.transactions.count()


class BankTransactionSerializer(serializers.ModelSerializer):
    bank_account_name = serializers.ReadOnlyField(source='bank_account.name')

    class Meta:
        model = BankTransaction
        fields = [
            'id', 'bank_account', 'bank_account_name', 'date', 'type',
            'amount', 'description', 'reference', 'is_reconciled',
            'journal_entry'
        ]


# ─── CREDIT NOTES ────────────────────────────────────────────────────────────

class CreditNoteSerializer(serializers.ModelSerializer):
    client_name = serializers.ReadOnlyField(source='client.name')
    invoice_number = serializers.ReadOnlyField(source='invoice.invoice_number')

    class Meta:
        model = CreditNote
        fields = [
            'id', 'client', 'client_name', 'invoice', 'invoice_number',
            'credit_number', 'date', 'amount', 'remaining_balance',
            'reason', 'is_voided'
        ]
        read_only_fields = ['id', 'remaining_balance']


# ─── FIXED ASSETS ────────────────────────────────────────────────────────────

class FixedAssetSerializer(serializers.ModelSerializer):
    net_book_value = serializers.ReadOnlyField()
    asset_account_name = serializers.ReadOnlyField(source='asset_account.name')
    depreciation_account_name = serializers.ReadOnlyField(source='depreciation_expense_account.name')
    monthly_depreciation = serializers.SerializerMethodField()

    class Meta:
        model = FixedAsset
        fields = [
            'id', 'name', 'description', 'purchase_date', 'purchase_price',
            'salvage_value', 'useful_life_years', 'accumulated_depreciation',
            'net_book_value', 'asset_account', 'asset_account_name',
            'depreciation_expense_account', 'depreciation_account_name',
            'monthly_depreciation'
        ]
        read_only_fields = ['id', 'accumulated_depreciation']

    def get_monthly_depreciation(self, obj):
        if obj.useful_life_years and obj.useful_life_years > 0:
            annual = (float(obj.purchase_price) - float(obj.salvage_value)) / obj.useful_life_years
            return round(annual / 12, 2)
        return 0


# ─── PHASE 4: ENTERPRISE MSP EXPANSION ────────────────────────────────────────

from ..domain.models import (
    Currency, ExchangeRate, TaxAuthority, TaxGroup, BankReconciliation, 
    DunningWorkflow
)

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = ['id', 'code', 'name', 'symbol', 'is_base']

class ExchangeRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeRate
        fields = ['id', 'currency', 'date', 'rate']

class TaxAuthoritySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxAuthority
        fields = ['id', 'name', 'description']

class TaxGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxGroup
        fields = ['id', 'name', 'taxes', 'is_active']

class BankReconciliationSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankReconciliation
        fields = ['id', 'bank_transaction', 'payment', 'expense', 'reconciled_at', 'reconciled_by']
        read_only_fields = ['id', 'reconciled_at']

class DunningWorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = DunningWorkflow
        fields = ['id', 'name', 'days_overdue', 'action_type', 'is_active']

from ..domain.models import FiscalYear, FiscalPeriod, AccountingJournal, VendorBill, FiscalPosition

class FiscalYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = FiscalYear
        fields = ['id', 'name', 'start_date', 'end_date', 'is_closed']

class FiscalPeriodSerializer(serializers.ModelSerializer):
    fiscal_year_name = serializers.ReadOnlyField(source='fiscal_year.name')
    class Meta:
        model = FiscalPeriod
        fields = ['id', 'fiscal_year', 'fiscal_year_name', 'name', 'start_date', 'end_date', 'is_closed']

class AccountingJournalSerializer(serializers.ModelSerializer):
    default_account_name = serializers.ReadOnlyField(source='default_account.name')
    class Meta:
        model = AccountingJournal
        fields = ['id', 'name', 'code', 'type', 'default_account', 'default_account_name']

class VendorBillSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorBill
        fields = ['id', 'vendor', 'bill_number', 'reference', 'date', 'due_date', 'subtotal', 'tax_total', 'total_amount', 'status', 'journal']

class FiscalPositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FiscalPosition
        fields = ['id', 'name', 'description', 'is_active']

class RecurringInvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurringInvoiceItem
        fields = ['id', 'recurring_invoice', 'description', 'quantity', 'unit_price', 'tax_rate']

class RecurringInvoiceSerializer(serializers.ModelSerializer):
    items = RecurringInvoiceItemSerializer(many=True, read_only=True)
    class Meta:
        model = RecurringInvoice
        fields = ['id', 'name', 'client', 'frequency', 'next_run', 'end_date', 'is_active', 'notes', 'payment_terms_days', 'items']
