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

    project = models.ForeignKey('projects.Project', on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')
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
    cost_center = models.ForeignKey('accounting.CostCenter', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.title

class GeneralLedger(TenantAwareModel):
    ENTRY_TYPES = [
        ('debit', 'Debit'),
        ('credit', 'Credit'),
    ]
    account = models.ForeignKey('Account', on_delete=models.PROTECT, related_name='ledger_entries', null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    entry_type = models.CharField(max_length=10, choices=ENTRY_TYPES)
    reference_id = models.UUIDField() # ID of the Invoice, Payment, or Expense
    reference_type = models.CharField(max_length=50) # 'invoice', 'payment', 'expense'
    transaction_date = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.entry_type.upper()}: {self.account.name if self.account else 'Unknown'} - {self.amount}"

class RecurringInvoice(TenantAwareModel):
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
    notes = models.TextField(blank=True)
    payment_terms_days = models.IntegerField(default=30)

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

class Account(TenantAwareModel):
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
    date = models.DateField(default=timezone.now)
    reference = models.CharField(max_length=255, blank=True, help_text="Invoice #, PO #, etc.")
    description = models.TextField(blank=True)
    is_posted = models.BooleanField(default=False)

    def __str__(self):
        return f"JE {self.id} on {self.date}"

class JournalEntryLine(TenantAwareModel):
    journal_entry = models.ForeignKey(JournalEntry, on_delete=models.CASCADE, related_name='lines')
    account = models.ForeignKey(Account, on_delete=models.PROTECT, related_name='journal_lines')
    debit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    credit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.account.name}: DR {self.debit} / CR {self.credit}"

class BankAccount(TenantAwareModel):
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

class CreditNote(TenantAwareModel):
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

class FixedAsset(TenantAwareModel):
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

class DeferredRevenue(TenantAwareModel):
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

class Currency(TenantAwareModel):
    code = models.CharField(max_length=3, unique=True, help_text="e.g. USD, EUR, GBP")
    name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=5)
    is_base = models.BooleanField(default=False, help_text="Is this the base currency for the tenant?")

    class Meta:
        verbose_name_plural = 'Currencies'

    def __str__(self):
        return f"{self.code} - {self.name}"

class ExchangeRate(TenantAwareModel):
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name='exchange_rates')
    date = models.DateField(default=timezone.now)
    rate = models.DecimalField(max_digits=15, decimal_places=6, help_text="Rate against base currency")

    def __str__(self):
        return f"{self.currency.code} rate on {self.date}: {self.rate}"

class TaxAuthority(TenantAwareModel):
    name = models.CharField(max_length=100, help_text="e.g. IRS, HMRC, California State Board of Equalization")
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class TaxGroup(TenantAwareModel):
    name = models.CharField(max_length=100)
    taxes = models.ManyToManyField(TaxConfig, related_name='tax_groups')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class BankReconciliation(TenantAwareModel):
    bank_transaction = models.OneToOneField(BankTransaction, on_delete=models.CASCADE, related_name='reconciliation')
    payment = models.ForeignKey(Payment, on_delete=models.SET_NULL, null=True, blank=True, related_name='reconciliations')
    expense = models.ForeignKey(Expense, on_delete=models.SET_NULL, null=True, blank=True, related_name='reconciliations')
    reconciled_at = models.DateTimeField(auto_now_add=True)
    reconciled_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"Reconciliation for {self.bank_transaction}"

class DunningWorkflow(TenantAwareModel):
    name = models.CharField(max_length=100)
    days_overdue = models.IntegerField()
    action_type = models.CharField(max_length=50, choices=[
        ('email_reminder', 'Email Reminder'),
        ('suspend_service', 'Suspend Service'),
        ('late_fee', 'Apply Late Fee')
    ])
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.days_overdue} days)"

# ─── ODOO-STYLE ENTERPRISE ACCOUNTING MODELS (PHASE 2) ───

class FiscalYear(TenantAwareModel):
    name = models.CharField(max_length=100, help_text="e.g. FY 2026")
    start_date = models.DateField()
    end_date = models.DateField()
    is_closed = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Fiscal Year'
        ordering = ['-start_date']

    def __str__(self):
        return self.name

class FiscalPeriod(TenantAwareModel):
    fiscal_year = models.ForeignKey(FiscalYear, on_delete=models.CASCADE, related_name='periods')
    name = models.CharField(max_length=100, help_text="e.g. Jan 2026")
    start_date = models.DateField()
    end_date = models.DateField()
    is_closed = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Fiscal Period'
        ordering = ['start_date']

    def __str__(self):
        return f"{self.name} ({self.fiscal_year.name})"

class AccountingJournal(TenantAwareModel):
    TYPE_CHOICES = [
        ('sale', 'Sales'),
        ('purchase', 'Purchase'),
        ('cash', 'Cash'),
        ('bank', 'Bank'),
        ('general', 'Miscellaneous')
    ]
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, help_text="Short code, e.g. INV, BNK")
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    default_account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True, related_name='+')

    class Meta:
        verbose_name = 'Journal'

    def __str__(self):
        return f"{self.name} ({self.code})"

class FiscalPosition(TenantAwareModel):
    name = models.CharField(max_length=100, help_text="e.g. B2B EU, B2C National")
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    # Tax mapping logic would be added here as related models (TaxMapping)

    class Meta:
        verbose_name = 'Fiscal Position'

    def __str__(self):
        return self.name

class VendorBill(TenantAwareModel):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('open', 'Open'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled')
    ]
    vendor = models.ForeignKey(
        'purchase.Vendor',
        on_delete=models.CASCADE,
        related_name='vendor_bills',
        null=True, blank=True
    )
    purchase_order = models.ForeignKey(
        'purchase.PurchaseOrder',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='vendor_bills'
    )
    bill_number = models.CharField(max_length=100)
    reference = models.CharField(max_length=100, blank=True, help_text="Vendor's invoice number")
    date = models.DateField(default=timezone.now)
    due_date = models.DateField()
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    journal = models.ForeignKey(AccountingJournal, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = 'Vendor Bill'
        unique_together = ('tenant', 'bill_number')

    def __str__(self):
        return f"Bill {self.bill_number} from {self.vendor}"

class BillLine(TenantAwareModel):
    bill = models.ForeignKey(VendorBill, on_delete=models.CASCADE, related_name='lines')
    product = models.ForeignKey('store.Product', on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField()
    account = models.ForeignKey(Account, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    analytic_account = models.ForeignKey('AnalyticAccount', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.quantity} x {self.description}"

class AnalyticAccount(TenantAwareModel):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    partner = models.ForeignKey('core.Partner', on_delete=models.SET_NULL, null=True, blank=True)
    project = models.ForeignKey('projects.Project', on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

class AnalyticLine(TenantAwareModel):
    account = models.ForeignKey(AnalyticAccount, on_delete=models.CASCADE, related_name='lines')
    date = models.DateField(default=timezone.now)
    amount = models.DecimalField(max_digits=12, decimal_places=2) # positive for income, negative for cost
    description = models.CharField(max_length=255)
    ref_model = models.CharField(max_length=100, blank=True)
    ref_id = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.account.name}: {self.amount}"

class CostCenter(TenantAwareModel):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

class BudgetLine(TenantAwareModel):
    cost_center = models.ForeignKey(CostCenter, on_delete=models.CASCADE, related_name='budgets')
    category = models.CharField(max_length=50)
    allocated_amount = models.DecimalField(max_digits=12, decimal_places=2)
    spent_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    year = models.IntegerField()

    def __str__(self):
        return f"Budget {self.year} - {self.cost_center.name}"

class PurchaseRequisition(TenantAwareModel):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('done', 'Done')
    ]
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='requisitions')
    department = models.CharField(max_length=100, blank=True)
    reason = models.TextField()
    date_required = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    total_estimated_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    budget_line = models.ForeignKey(BudgetLine, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"PR #{self.id} by {self.requester}"
