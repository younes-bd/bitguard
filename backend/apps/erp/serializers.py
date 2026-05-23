"""
ERP Serializers — Explicit field declarations (no __all__).
Covers full billing lifecycle: Invoices, Payments, Expenses, Delivery,
Vendors, Purchase Orders, Recurring Invoices, Ledger, Budget,
Chart of Accounts, Journal Entries, Banking, Credit Notes, Fixed Assets.
"""
from rest_framework import serializers
from .models import (
    Invoice, Payment, Expense, InternalProject, Risk,
    TaxConfig, InvoiceItem, DeliveryNote, GeneralLedger,
    BudgetLine, CostCenter,
    ErpVendor, ErpPurchaseOrder, ErpPurchaseOrderItem,
    RecurringInvoice, RecurringInvoiceItem,
    Account, JournalEntry, JournalEntryLine, BankAccount,
    BankTransaction, CreditNote, FixedAsset,
    PaymentTerms, InvoiceBranding, DeferredRevenue,
)

class PaymentTermsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTerms
        fields = '__all__'

class InvoiceBrandingSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceBranding
        fields = '__all__'

class DeferredRevenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeferredRevenue
        fields = '__all__'


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

class DeliveryNoteSerializer(serializers.ModelSerializer):
    client_name = serializers.ReadOnlyField(source='client.name')
    invoice_number = serializers.ReadOnlyField(source='invoice.invoice_number')

    class Meta:
        model = DeliveryNote
        fields = [
            'id', 'dn_number', 'invoice', 'invoice_number', 'client', 'client_name',
            'shipping_address', 'tracking_number', 'status', 'delivery_date',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


# ─── PAYMENTS ─────────────────────────────────────────────────────────────────

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
    user_name = serializers.SerializerMethodField()
    cost_center_name = serializers.ReadOnlyField(source='cost_center.name')

    class Meta:
        model = Expense
        fields = [
            'id', 'title', 'amount', 'incurred_date',
            'category', 'status', 'notes', 'receipt',
            'user', 'user_name', 'cost_center', 'cost_center_name',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

    def get_user_name(self, obj):
        if obj.user:
            full = obj.user.get_full_name()
            return full if full.strip() else obj.user.email
        return None


# ─── COST CENTERS & BUDGETS ──────────────────────────────────────────────────

class CostCenterSerializer(serializers.ModelSerializer):
    budget_count = serializers.SerializerMethodField()

    class Meta:
        model = CostCenter
        fields = ['id', 'name', 'code', 'description', 'budget_count']

    def get_budget_count(self, obj):
        return obj.budgets.count()


class BudgetLineSerializer(serializers.ModelSerializer):
    cost_center_name = serializers.ReadOnlyField(source='cost_center.name')
    utilization_pct = serializers.SerializerMethodField()
    remaining = serializers.SerializerMethodField()

    class Meta:
        model = BudgetLine
        fields = [
            'id', 'cost_center', 'cost_center_name', 'category',
            'allocated_amount', 'spent_amount', 'year',
            'utilization_pct', 'remaining'
        ]

    def get_utilization_pct(self, obj):
        if obj.allocated_amount == 0:
            return 0
        return round(float(obj.spent_amount / obj.allocated_amount) * 100, 1)

    def get_remaining(self, obj):
        return float(obj.allocated_amount - obj.spent_amount)


# ─── GENERAL LEDGER ──────────────────────────────────────────────────────────

class GeneralLedgerSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneralLedger
        fields = [
            'id', 'account_name', 'amount', 'entry_type',
            'reference_id', 'reference_type', 'transaction_date', 'description'
        ]


# ─── PROJECTS ─────────────────────────────────────────────────────────────────

class InternalProjectSerializer(serializers.ModelSerializer):
    client_name = serializers.ReadOnlyField(source='client.name')
    assigned_to_name = serializers.SerializerMethodField()
    days_remaining = serializers.SerializerMethodField()

    class Meta:
        model = InternalProject
        fields = [
            'id', 'name', 'description', 'client', 'client_name', 'deal_id',
            'status', 'budget', 'start_date', 'due_date',
            'assigned_to', 'assigned_to_name',
            'is_service_obligation', 'days_remaining',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'is_service_obligation', 'created_at', 'updated_at']

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            full = obj.assigned_to.get_full_name()
            return full if full.strip() else obj.assigned_to.email
        return None

    def get_days_remaining(self, obj):
        if obj.due_date:
            import datetime
            delta = (obj.due_date - datetime.date.today()).days
            return max(0, delta)
        return None


# ─── RISKS ────────────────────────────────────────────────────────────────────

class RiskSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    risk_score = serializers.SerializerMethodField()

    class Meta:
        model = Risk
        fields = [
            'id', 'summary', 'description', 'impact', 'probability',
            'status', 'mitigation_plan', 'owner', 'owner_name',
            'risk_score', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_owner_name(self, obj):
        if obj.owner:
            full = obj.owner.get_full_name()
            return full if full.strip() else obj.owner.email
        return None

    def get_risk_score(self, obj):
        impact_map = {'low': 1, 'medium': 2, 'high': 3, 'severe': 4}
        prob_map = {'unlikely': 1, 'possible': 2, 'likely': 3, 'certain': 4}
        return impact_map.get(obj.impact, 0) * prob_map.get(obj.probability, 0)


# ─── VENDOR / PURCHASE ORDER ─────────────────────────────────────────────────

class VendorSerializer(serializers.ModelSerializer):
    po_count = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()

    class Meta:
        model = ErpVendor
        fields = [
            'id', 'name', 'contact_name', 'email', 'phone', 'address',
            'vat_number', 'payment_terms', 'notes', 'is_active',
            'po_count', 'total_spent', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_po_count(self, obj):
        return obj.purchase_orders.count()

    def get_total_spent(self, obj):
        from django.db.models import Sum
        total = obj.purchase_orders.filter(
            status='received'
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        return float(total)


class PurchaseOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ErpPurchaseOrderItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'tax_rate', 'total']
        read_only_fields = ['id', 'total']


class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = PurchaseOrderItemSerializer(many=True, read_only=True)
    vendor_name = serializers.ReadOnlyField(source='vendor.name')
    approved_by_name = serializers.SerializerMethodField()

    class Meta:
        model = ErpPurchaseOrder
        fields = [
            'id', 'po_number', 'vendor', 'vendor_name', 'status',
            'issue_date', 'expected_delivery', 'notes', 'items',
            'subtotal', 'tax_total', 'total_amount',
            'received_at', 'approved_by', 'approved_by_name',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'subtotal', 'tax_total', 'total_amount', 'created_at', 'updated_at']

    def get_approved_by_name(self, obj):
        if obj.approved_by:
            full = obj.approved_by.get_full_name()
            return full if full.strip() else obj.approved_by.email
        return None


# ─── RECURRING INVOICES ──────────────────────────────────────────────────────

class RecurringInvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecurringInvoiceItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'tax_rate']


class RecurringInvoiceSerializer(serializers.ModelSerializer):
    items = RecurringInvoiceItemSerializer(many=True, read_only=True)
    client_name = serializers.ReadOnlyField(source='client.name')
    estimated_amount = serializers.SerializerMethodField()

    class Meta:
        model = RecurringInvoice
        fields = [
            'id', 'name', 'client', 'client_name', 'frequency',
            'next_run', 'end_date', 'is_active', 'notes',
            'payment_terms_days', 'items', 'estimated_amount',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_estimated_amount(self, obj):
        total = 0
        for item in obj.items.all():
            line = float(item.quantity * item.unit_price)
            tax = line * (float(item.tax_rate) / 100)
            total += line + tax
        return round(total, 2)


# ─── CHART OF ACCOUNTS ──────────────────────────────────────────────────────

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