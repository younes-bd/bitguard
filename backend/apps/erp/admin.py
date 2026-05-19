"""
ERP Admin — Full model registration for the Django Admin Command Center.
Charter §14: Admin dashboard is the authoritative operational interface.
"""
from django.contrib import admin
from .models import (
    TaxConfig, Invoice, InvoiceItem, DeliveryNote, Payment, Expense,
    CostCenter, BudgetLine, GeneralLedger, InternalProject, Risk,
    ErpVendor, ErpPurchaseOrder, ErpPurchaseOrderItem,
    RecurringInvoice, RecurringInvoiceItem,
    Account, JournalEntry, JournalEntryLine,
    BankAccount, BankTransaction, CreditNote, FixedAsset,
)


# ─── INLINES ──────────────────────────────────────────────────────────────────

class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 0
    fields = ['description', 'quantity', 'unit_price', 'tax_rate', 'discount', 'total']
    readonly_fields = ['total']


class PurchaseOrderItemInline(admin.TabularInline):
    model = ErpPurchaseOrderItem
    extra = 0
    fields = ['description', 'quantity', 'unit_price', 'tax_rate', 'total']
    readonly_fields = ['total']


class RecurringInvoiceItemInline(admin.TabularInline):
    model = RecurringInvoiceItem
    extra = 0
    fields = ['description', 'quantity', 'unit_price', 'tax_rate']


class JournalEntryLineInline(admin.TabularInline):
    model = JournalEntryLine
    extra = 0
    fields = ['account', 'debit', 'credit', 'description']
    autocomplete_fields = ['account']


# ─── BILLING ──────────────────────────────────────────────────────────────────

@admin.register(TaxConfig)
class TaxConfigAdmin(admin.ModelAdmin):
    list_display = ['name', 'rate', 'is_active', 'tenant']
    list_filter = ['is_active', 'tenant']
    search_fields = ['name']


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'client', 'type', 'status', 'total_amount', 'issue_date', 'due_date', 'days_overdue']
    list_filter = ['status', 'type', 'tenant']
    search_fields = ['invoice_number', 'client__name', 'reference']
    readonly_fields = ['subtotal', 'tax_total', 'discount_total', 'total_amount', 'paid_at', 'created_at', 'updated_at']
    date_hierarchy = 'issue_date'
    inlines = [InvoiceItemInline]
    autocomplete_fields = ['client']
    actions = ['mark_as_sent', 'mark_as_void']

    @admin.action(description="Mark selected invoices as Sent")
    def mark_as_sent(self, request, queryset):
        updated = queryset.filter(status='draft').update(status='sent')
        self.message_user(request, f"{updated} invoice(s) marked as sent.")

    @admin.action(description="Void selected invoices")
    def mark_as_void(self, request, queryset):
        updated = queryset.exclude(status__in=['void', 'paid']).update(status='void')
        self.message_user(request, f"{updated} invoice(s) voided.")


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'invoice', 'amount', 'payment_date', 'payment_method', 'reference']
    list_filter = ['payment_method', 'payment_date']
    search_fields = ['invoice__invoice_number', 'reference']
    date_hierarchy = 'payment_date'
    autocomplete_fields = ['invoice']


@admin.register(DeliveryNote)
class DeliveryNoteAdmin(admin.ModelAdmin):
    list_display = ['dn_number', 'client', 'invoice', 'status', 'delivery_date']
    list_filter = ['status', 'tenant']
    search_fields = ['dn_number', 'client__name', 'tracking_number']
    autocomplete_fields = ['client', 'invoice']


# ─── EXPENSES & BUDGETS ──────────────────────────────────────────────────────

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['title', 'amount', 'category', 'status', 'incurred_date', 'user', 'cost_center']
    list_filter = ['status', 'category', 'tenant']
    search_fields = ['title', 'notes', 'user__email']
    date_hierarchy = 'incurred_date'
    readonly_fields = ['created_at', 'updated_at']
    actions = ['approve_expenses', 'reject_expenses', 'mark_reimbursed']

    @admin.action(description="Approve selected expenses")
    def approve_expenses(self, request, queryset):
        updated = queryset.filter(status='submitted').update(status='approved')
        self.message_user(request, f"{updated} expense(s) approved.")

    @admin.action(description="Reject selected expenses")
    def reject_expenses(self, request, queryset):
        updated = queryset.filter(status='submitted').update(status='rejected')
        self.message_user(request, f"{updated} expense(s) rejected.")

    @admin.action(description="Mark as reimbursed")
    def mark_reimbursed(self, request, queryset):
        updated = queryset.filter(status='approved').update(status='reimbursed')
        self.message_user(request, f"{updated} expense(s) marked as reimbursed.")


@admin.register(CostCenter)
class CostCenterAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'tenant']
    search_fields = ['name', 'code']


@admin.register(BudgetLine)
class BudgetLineAdmin(admin.ModelAdmin):
    list_display = ['cost_center', 'category', 'year', 'allocated_amount', 'spent_amount']
    list_filter = ['year', 'category', 'tenant']
    search_fields = ['cost_center__name']


# ─── LEDGER ───────────────────────────────────────────────────────────────────

@admin.register(GeneralLedger)
class GeneralLedgerAdmin(admin.ModelAdmin):
    list_display = ['account_name', 'entry_type', 'amount', 'reference_type', 'transaction_date']
    list_filter = ['entry_type', 'reference_type', 'tenant']
    search_fields = ['account_name', 'description']
    readonly_fields = ['transaction_date']
    date_hierarchy = 'transaction_date'


# ─── PROJECTS & RISKS ────────────────────────────────────────────────────────

@admin.register(InternalProject)
class InternalProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'client', 'status', 'budget', 'start_date', 'due_date', 'assigned_to', 'is_service_obligation']
    list_filter = ['status', 'is_service_obligation', 'tenant']
    search_fields = ['name', 'description', 'client__name']
    autocomplete_fields = ['client', 'assigned_to']
    date_hierarchy = 'created_at'


@admin.register(Risk)
class RiskAdmin(admin.ModelAdmin):
    list_display = ['summary', 'impact', 'probability', 'status', 'owner']
    list_filter = ['impact', 'probability', 'status', 'tenant']
    search_fields = ['summary', 'description']


# ─── VENDORS & PURCHASE ORDERS ───────────────────────────────────────────────

@admin.register(ErpVendor)
class ErpVendorAdmin(admin.ModelAdmin):
    list_display = ['name', 'contact_name', 'email', 'phone', 'payment_terms', 'is_active']
    list_filter = ['is_active', 'payment_terms', 'tenant']
    search_fields = ['name', 'contact_name', 'email', 'vat_number']


@admin.register(ErpPurchaseOrder)
class ErpPurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ['po_number', 'vendor', 'status', 'total_amount', 'issue_date', 'expected_delivery', 'approved_by']
    list_filter = ['status', 'tenant']
    search_fields = ['po_number', 'vendor__name']
    inlines = [PurchaseOrderItemInline]
    autocomplete_fields = ['vendor', 'approved_by']
    date_hierarchy = 'issue_date'


# ─── RECURRING INVOICES ──────────────────────────────────────────────────────

@admin.register(RecurringInvoice)
class RecurringInvoiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'client', 'frequency', 'next_run', 'end_date', 'is_active']
    list_filter = ['frequency', 'is_active', 'tenant']
    search_fields = ['name', 'client__name']
    inlines = [RecurringInvoiceItemInline]
    autocomplete_fields = ['client']


# ─── CHART OF ACCOUNTS & JOURNAL ENTRIES ──────────────────────────────────────

@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'account_type', 'is_active']
    list_filter = ['account_type', 'is_active', 'tenant']
    search_fields = ['code', 'name']
    ordering = ['code']


@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    list_display = ['id', 'date', 'reference', 'is_posted', 'created_at']
    list_filter = ['is_posted', 'tenant']
    search_fields = ['reference', 'description']
    inlines = [JournalEntryLineInline]
    date_hierarchy = 'date'
    actions = ['post_entries']

    @admin.action(description="Post selected journal entries")
    def post_entries(self, request, queryset):
        updated = queryset.filter(is_posted=False).update(is_posted=True)
        self.message_user(request, f"{updated} journal entry(ies) posted.")


# ─── BANKING ──────────────────────────────────────────────────────────────────

@admin.register(BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    list_display = ['name', 'currency', 'current_balance', 'linked_account']
    list_filter = ['currency', 'tenant']
    search_fields = ['name', 'account_number']


@admin.register(BankTransaction)
class BankTransactionAdmin(admin.ModelAdmin):
    list_display = ['bank_account', 'type', 'amount', 'date', 'description', 'is_reconciled']
    list_filter = ['type', 'is_reconciled', 'tenant']
    search_fields = ['description', 'reference']
    date_hierarchy = 'date'


# ─── CREDIT NOTES & FIXED ASSETS ─────────────────────────────────────────────

@admin.register(CreditNote)
class CreditNoteAdmin(admin.ModelAdmin):
    list_display = ['credit_number', 'client', 'amount', 'remaining_balance', 'date', 'is_voided']
    list_filter = ['is_voided', 'tenant']
    search_fields = ['credit_number', 'client__name']
    autocomplete_fields = ['client', 'invoice']


@admin.register(FixedAsset)
class FixedAssetAdmin(admin.ModelAdmin):
    list_display = ['name', 'purchase_date', 'purchase_price', 'accumulated_depreciation', 'net_book_value', 'useful_life_years']
    list_filter = ['tenant']
    search_fields = ['name', 'description']
    readonly_fields = ['accumulated_depreciation']
