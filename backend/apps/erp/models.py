import uuid
from django.db import models
from django.utils import timezone
from apps.core.models import BaseModel, TenantAwareModel
from django.conf import settings
import datetime


# ─────────────────────────────────────────
# PAYMENT TERMS
# ─────────────────────────────────────────

class PaymentTerms(TenantAwareModel):
    """
    Named payment term rules (e.g. Net 30, 2/10 Net 30, COD, Due on Receipt).
    Automatically calculates due date when applied to an invoice.
    """
    name = models.CharField(max_length=100, help_text="e.g. Net 30, 2/10 Net 30")
    days_due = models.IntegerField(default=30, help_text="Days until payment is due from invoice date")
    discount_percent = models.DecimalField(
        max_digits=5, decimal_places=2, default=0,
        help_text="Early-pay discount % (e.g. 2 for 2/10 Net 30)"
    )
    discount_days = models.IntegerField(
        default=0, help_text="Days within which the early-pay discount applies"
    )
    description = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = 'Payment Terms'
        verbose_name_plural = 'Payment Terms'

    def calculate_due_date(self, from_date=None):
        base = from_date or timezone.now().date()
        return base + datetime.timedelta(days=self.days_due)

    def __str__(self):
        return self.name



# ─────────────────────────────────────────
# INVOICE BRANDING
# ─────────────────────────────────────────

class InvoiceBranding(TenantAwareModel):
    """
    Per-tenant branding applied when generating invoice PDFs.
    Modelled after Zoho Invoice's company settings.
    """
    company_name = models.CharField(max_length=255)
    company_address = models.TextField(blank=True)
    company_phone = models.CharField(max_length=50, blank=True)
    company_email = models.EmailField(blank=True)
    company_website = models.URLField(blank=True)
    tax_id = models.CharField(max_length=100, blank=True, help_text="VAT/Tax registration number")
    logo_url = models.URLField(blank=True, help_text="Company logo displayed on PDF invoices")
    primary_color = models.CharField(max_length=7, default='#1a56db', help_text="Hex color for PDF header")
    invoice_footer = models.TextField(
        blank=True,
        help_text="Footer text shown on every invoice (e.g. banking details, thank-you message)"
    )
    bank_name = models.CharField(max_length=255, blank=True)
    bank_account_number = models.CharField(max_length=100, blank=True)
    bank_routing_number = models.CharField(max_length=100, blank=True)
    bank_swift = models.CharField(max_length=50, blank=True)
    default_payment_terms = models.ForeignKey(
        PaymentTerms, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='branding_defaults'
    )
    default_currency = models.CharField(max_length=10, default='USD')

    class Meta:
        verbose_name = 'Invoice Branding'

    def __str__(self):
        return f"Branding for {self.company_name}"


class TaxConfig(TenantAwareModel):
    name = models.CharField(max_length=50)
    rate = models.DecimalField(max_digits=5, decimal_places=2)  # Percentage, e.g., 20.00
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.rate}%)"

class Invoice(TenantAwareModel):
    TYPE_CHOICES = [
        ('standard', 'Standard Invoice'),
        ('proforma', 'Proforma Invoice'),
        ('quotation', 'Quotation / Devis'),
        ('credit_note', 'Credit Note / Avoir'),
        ('receipt', 'Payment Receipt'),
    ]
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('paid', 'Paid'),
        ('partially_paid', 'Partially Paid'),
        ('overdue', 'Overdue'),
        ('void', 'Void'),
        ('cancelled', 'Cancelled')
    ]
    
    invoice_number = models.CharField(max_length=100)
    client = models.ForeignKey('crm.Client', on_delete=models.CASCADE, related_name='invoices')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='standard')

    project = models.ForeignKey('erp.InternalProject', on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')
    contract = models.ForeignKey('contracts.ServiceContract', on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')

    # Financial Totals (computed)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    discount_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0, help_text="Invoice-level discount percentage")
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # Multi-currency support (Odoo/Zoho standard)
    currency = models.CharField(max_length=10, default='USD')
    exchange_rate = models.DecimalField(max_digits=12, decimal_places=6, default=1.000000, help_text="Rate vs base currency")

    # Payment terms
    payment_terms = models.ForeignKey(
        'PaymentTerms', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='invoices'
    )

    issue_date = models.DateField()
    due_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True, help_text="For quotations: the date the quote expires")
    paid_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='draft')

    # PDF and Reference
    reference = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)

    # Secure client self-service portal token (Zoho-style pay link)
    payment_link_token = models.UUIDField(default=uuid.uuid4, editable=False)
    pdf_generated_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Invoice'
        verbose_name_plural = 'Invoices'
        unique_together = ('tenant', 'invoice_number')

    @property
    def days_overdue(self):
        if self.status in ('paid', 'void', 'cancelled', 'draft'):
            return 0
        delta = (datetime.date.today() - self.due_date).days
        return max(0, delta)

    @property
    def aging_bucket(self):
        days = self.days_overdue
        if days == 0:
            return 'current'
        elif days <= 30:
            return '1-30'
        elif days <= 60:
            return '31-60'
        elif days <= 90:
            return '61-90'
        return '90+'

    def __str__(self):
        return f"{self.invoice_number} - {self.client.name if self.client else 'Unknown'}"

class InvoiceItem(TenantAwareModel):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('store.Product', on_delete=models.SET_NULL, null=True, blank=True, related_name='erp_invoice_items')
    description = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.description} (x{self.quantity})"

class DeliveryNote(TenantAwareModel):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('returned', 'Returned'),
    ]
    dn_number = models.CharField(max_length=100)
    invoice = models.ForeignKey(Invoice, on_delete=models.SET_NULL, null=True, blank=True, related_name='delivery_notes')
    client = models.ForeignKey('crm.Client', on_delete=models.CASCADE)
    shipping_address = models.TextField()
    tracking_number = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    delivery_date = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ('tenant', 'dn_number')

    def __str__(self):
        return self.dn_number

class Payment(TenantAwareModel):
    METHOD_CHOICES = [
        ('credit_card', 'Credit Card'),
        ('bank_transfer', 'Bank Transfer'),
        ('paypal', 'PayPal'),
        ('stripe', 'Stripe'),
        ('cash', 'Cash')
    ]
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateField()
    payment_method = models.CharField(max_length=50, choices=METHOD_CHOICES)
    reference = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Payment {self.id} for {self.invoice.invoice_number}"

class Expense(TenantAwareModel):
    CATEGORY_CHOICES = [
        ('software', 'Software'),
        ('hardware', 'Hardware'),
        ('travel', 'Travel'),
        ('office', 'Office Supplies'),
        ('marketing', 'Marketing'),
        ('utilities', 'Utilities'),
        ('other', 'Other')
    ]
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('reimbursed', 'Reimbursed'),
    ]
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    incurred_date = models.DateField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    notes = models.TextField(blank=True)
    receipt = models.FileField(upload_to='expenses/%Y/%m/', blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    cost_center = models.ForeignKey('CostCenter', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.title

class CostCenter(TenantAwareModel):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

class BudgetLine(TenantAwareModel):
    cost_center = models.ForeignKey(CostCenter, on_delete=models.CASCADE, related_name='budgets')
    category = models.CharField(max_length=50, choices=Expense.CATEGORY_CHOICES)
    allocated_amount = models.DecimalField(max_digits=12, decimal_places=2)
    spent_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    year = models.IntegerField()

    def __str__(self):
        return f"Budget {self.year} - {self.cost_center.name}"

class GeneralLedger(TenantAwareModel):
    """
    Charter §18: All revenue-impacting actions are traceable.
    Double-entry accounting events.
    """
    ENTRY_TYPES = [
        ('debit', 'Debit'),
        ('credit', 'Credit'),
    ]
    account_name = models.CharField(max_length=100) # e.g., 'Accounts Receivable', 'Cash', 'Revenue'
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    entry_type = models.CharField(max_length=10, choices=ENTRY_TYPES)
    reference_id = models.UUIDField() # ID of the Invoice, Payment, or Expense
    reference_type = models.CharField(max_length=50) # 'invoice', 'payment', 'expense'
    transaction_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.entry_type.upper()}: {self.account_name} - {self.amount}"

class InternalProject(TenantAwareModel):
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('active', 'Active'),
        ('suspended', 'Suspended'),
        ('completed', 'Completed'),
        ('breached_sla', 'SLA Breached'),
        ('cancelled', 'Cancelled'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    client = models.ForeignKey('crm.Client', on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    deal_id = models.UUIDField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    budget = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    start_date = models.DateField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_projects'
    )
    is_service_obligation = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Risk(TenantAwareModel):
    IMPACT_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('severe', 'Severe'),
    ]
    PROBABILITY_CHOICES = [
        ('unlikely', 'Unlikely'),
        ('possible', 'Possible'),
        ('likely', 'Likely'),
        ('certain', 'Certain'),
    ]
    STATUS_CHOICES = [
        ('identified', 'Identified'),
        ('mitigating', 'Mitigating'),
        ('resolved', 'Resolved'),
    ]
    summary = models.CharField(max_length=255)
    description = models.TextField()
    impact = models.CharField(max_length=20, choices=IMPACT_CHOICES, default='medium')
    probability = models.CharField(max_length=20, choices=PROBABILITY_CHOICES, default='possible')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='identified')
    mitigation_plan = models.TextField(blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.summary


# ─────────────────────────────────────────
# VENDOR / PURCHASE SIDE
# ─────────────────────────────────────────

class ErpVendor(TenantAwareModel):
    """Supplier / vendor records for the purchase side of the ERP (distinct from scm.Vendor)."""
    PAYMENT_TERM_CHOICES = [
        ('net_7', 'Net 7'),
        ('net_15', 'Net 15'),
        ('net_30', 'Net 30'),
        ('net_60', 'Net 60'),
        ('immediate', 'Immediate'),
    ]
    name = models.CharField(max_length=255)
    contact_name = models.CharField(max_length=255, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    address = models.TextField(blank=True)
    vat_number = models.CharField(max_length=100, blank=True)
    payment_terms = models.CharField(max_length=20, choices=PAYMENT_TERM_CHOICES, default='net_30')
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'ERP Vendor'
        verbose_name_plural = 'ERP Vendors'

    def __str__(self):
        return self.name


class ErpPurchaseOrder(TenantAwareModel):
    """Purchase orders sent to ERP vendors for goods or services."""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent to Vendor'),
        ('confirmed', 'Vendor Confirmed'),
        ('received', 'Received'),
        ('cancelled', 'Cancelled'),
    ]
    po_number = models.CharField(max_length=100)
    vendor = models.ForeignKey(ErpVendor, on_delete=models.CASCADE, related_name='purchase_orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    issue_date = models.DateField(default=timezone.now)
    expected_delivery = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    received_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='erp_approved_purchase_orders'
    )

    class Meta:
        unique_together = ('tenant', 'po_number')
        verbose_name = 'ERP Purchase Order'
        verbose_name_plural = 'ERP Purchase Orders'

    def __str__(self):
        return f"{self.po_number} — {self.vendor.name}"


class ErpPurchaseOrderItem(TenantAwareModel):
    purchase_order = models.ForeignKey(ErpPurchaseOrder, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        verbose_name = 'ERP Purchase Order Item'

    def __str__(self):
        return f"{self.description} (x{self.quantity})"


# ─────────────────────────────────────────
# RECURRING INVOICES
# ─────────────────────────────────────────

class RecurringInvoice(TenantAwareModel):
    """
    Defines a recurring billing schedule.
    On each scheduled run, a new Invoice is cloned from this template.
    """
    FREQUENCY_CHOICES = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('annually', 'Annually'),
    ]
    name = models.CharField(max_length=255, help_text="Friendly name, e.g. 'Monthly Retainer – Acme Corp'")
    client = models.ForeignKey('crm.Client', on_delete=models.CASCADE, related_name='recurring_invoices')
    frequency = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default='monthly')
    next_run = models.DateField()
    end_date = models.DateField(null=True, blank=True, help_text="Leave blank for indefinite")
    is_active = models.BooleanField(default=True)
    # Template fields — copied into each generated invoice
    notes = models.TextField(blank=True)
    payment_terms_days = models.IntegerField(default=30)
    # The source invoice items are stored as RecurringInvoiceItem objects

    def __str__(self):
        return f"{self.name} ({self.frequency})"


class RecurringInvoiceItem(TenantAwareModel):
    recurring_invoice = models.ForeignKey(RecurringInvoice, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def __str__(self):
        return self.description


# ─────────────────────────────────────────
# PHASE 3: ENTERPRISE FINANCIAL ACCOUNTING
# ─────────────────────────────────────────

class Account(TenantAwareModel):
    """
    Chart of Accounts (CoA) Definition.
    Replaces the string-based GeneralLedger account_name.
    """
    ACCOUNT_TYPES = [
        ('asset', 'Asset'),
        ('liability', 'Liability'),
        ('equity', 'Equity'),
        ('revenue', 'Revenue'),
        ('expense', 'Expense'),
    ]
    code = models.CharField(max_length=20, help_text="e.g. 1000, 2000")
    name = models.CharField(max_length=255, help_text="e.g. Accounts Receivable, Sales Revenue")
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPES)
    is_active = models.BooleanField(default=True)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ('tenant', 'code')
        ordering = ['code']

    def __str__(self):
        return f"{self.code} - {self.name}"


class JournalEntry(TenantAwareModel):
    """
    Header for a balanced double-entry accounting transaction.
    """
    date = models.DateField(default=timezone.now)
    reference = models.CharField(max_length=255, blank=True, help_text="Invoice #, PO #, etc.")
    description = models.TextField(blank=True)
    is_posted = models.BooleanField(default=False)

    def __str__(self):
        return f"JE {self.id} on {self.date}"


class JournalEntryLine(TenantAwareModel):
    """
    Individual debit/credit line associated with a JournalEntry.
    Debits must equal Credits for the JournalEntry to be posted.
    """
    journal_entry = models.ForeignKey(JournalEntry, on_delete=models.CASCADE, related_name='lines')
    account = models.ForeignKey(Account, on_delete=models.PROTECT, related_name='journal_lines')
    debit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    credit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.account.name}: DR {self.debit} / CR {self.credit}"


# ─────────────────────────────────────────
# BANKING & CASH FLOW
# ─────────────────────────────────────────

class BankAccount(TenantAwareModel):
    """Tracking internal company bank accounts and credit cards."""
    name = models.CharField(max_length=255, help_text="e.g. Chase Operating, Amex Corporate")
    account_number = models.CharField(max_length=100, blank=True)
    routing_number = models.CharField(max_length=100, blank=True)
    currency = models.CharField(max_length=10, default='USD')
    initial_balance = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    current_balance = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    linked_account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True, help_text="CoA link")

    def __str__(self):
        return self.name


class BankTransaction(TenantAwareModel):
    """Individual flow of funds in/out of a BankAccount."""
    TRANSACTION_TYPES = [
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
    ]
    bank_account = models.ForeignKey(BankAccount, on_delete=models.CASCADE, related_name='transactions')
    date = models.DateField(default=timezone.now)
    type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(max_length=255)
    reference = models.CharField(max_length=255, blank=True)
    is_reconciled = models.BooleanField(default=False)
    journal_entry = models.ForeignKey(JournalEntry, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.type.capitalize()} of {self.amount} on {self.date}"


# ─────────────────────────────────────────
# CREDIT NOTES & ADVANCED PAYABLES
# ─────────────────────────────────────────

class CreditNote(TenantAwareModel):
    """Credit issued to a client, which can be applied to future invoices."""
    client = models.ForeignKey('crm.Client', on_delete=models.CASCADE, related_name='credit_notes')
    invoice = models.ForeignKey(Invoice, on_delete=models.SET_NULL, null=True, blank=True, related_name='credit_notes')
    credit_number = models.CharField(max_length=100)
    date = models.DateField(default=timezone.now)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    remaining_balance = models.DecimalField(max_digits=12, decimal_places=2)
    reason = models.TextField(blank=True)
    is_voided = models.BooleanField(default=False)

    class Meta:
        unique_together = ('tenant', 'credit_number')

    def __str__(self):
        return f"CR-{self.credit_number} ({self.remaining_balance} available)"


# ─────────────────────────────────────────
# FIXED ASSETS & DEPRECIATION
# ─────────────────────────────────────────

class FixedAsset(TenantAwareModel):
    """Physical assets like laptops, servers, or vehicles."""
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    purchase_date = models.DateField()
    purchase_price = models.DecimalField(max_digits=12, decimal_places=2)
    salvage_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    useful_life_years = models.IntegerField(default=5)
    accumulated_depreciation = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    asset_account = models.ForeignKey(Account, on_delete=models.PROTECT, related_name='asset_holdings')
    depreciation_expense_account = models.ForeignKey(Account, on_delete=models.PROTECT, related_name='depreciation_expenses')

    @property
    def net_book_value(self):
        return self.purchase_price - self.accumulated_depreciation

    def __str__(self):
        return self.name


# ─────────────────────────────────────────
# DEFERRED REVENUE
# ─────────────────────────────────────────

class DeferredRevenue(TenantAwareModel):
    """
    Tracks prepaid/unearned revenue from contracts.
    Each month, a recognition journal entry moves the amount from
    Deferred Revenue (liability) to Revenue (income).
    Modelled after Odoo's revenue recognition module.
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Fully Recognized'),
        ('cancelled', 'Cancelled'),
    ]
    invoice = models.ForeignKey(
        Invoice, on_delete=models.CASCADE, related_name='deferred_revenues'
    )
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    recognized_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    recognition_start = models.DateField()
    recognition_end = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    deferred_account = models.ForeignKey(
        Account, on_delete=models.PROTECT, related_name='deferred_revenue_entries',
        null=True, blank=True
    )
    revenue_account = models.ForeignKey(
        Account, on_delete=models.PROTECT, related_name='recognized_revenue_entries',
        null=True, blank=True
    )

    class Meta:
        verbose_name = 'Deferred Revenue'

    @property
    def remaining_amount(self):
        return self.total_amount - self.recognized_amount

    def __str__(self):
        return f"Deferred Revenue — {self.invoice.invoice_number} ({self.remaining_amount} remaining)"
