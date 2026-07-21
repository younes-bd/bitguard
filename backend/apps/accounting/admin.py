from django.contrib import admin
from .domain import models

# Auto-generated Admin for accounting

@admin.register(models.PaymentTerms)
class PaymentTermsAdmin(admin.ModelAdmin):
    pass

@admin.register(models.InvoiceBranding)
class InvoiceBrandingAdmin(admin.ModelAdmin):
    pass

@admin.register(models.TaxConfig)
class TaxConfigAdmin(admin.ModelAdmin):
    pass

@admin.register(models.Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    pass

@admin.register(models.InvoiceItem)
class InvoiceItemAdmin(admin.ModelAdmin):
    pass

@admin.register(models.Payment)
class PaymentAdmin(admin.ModelAdmin):
    pass

@admin.register(models.Expense)
class ExpenseAdmin(admin.ModelAdmin):
    pass

@admin.register(models.GeneralLedger)
class GeneralLedgerAdmin(admin.ModelAdmin):
    pass

@admin.register(models.RecurringInvoice)
class RecurringInvoiceAdmin(admin.ModelAdmin):
    pass

@admin.register(models.RecurringInvoiceItem)
class RecurringInvoiceItemAdmin(admin.ModelAdmin):
    pass

@admin.register(models.Account)
class AccountAdmin(admin.ModelAdmin):
    pass

@admin.register(models.JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    pass

@admin.register(models.JournalEntryLine)
class JournalEntryLineAdmin(admin.ModelAdmin):
    pass

@admin.register(models.BankAccount)
class BankAccountAdmin(admin.ModelAdmin):
    pass

@admin.register(models.BankTransaction)
class BankTransactionAdmin(admin.ModelAdmin):
    pass

@admin.register(models.CreditNote)
class CreditNoteAdmin(admin.ModelAdmin):
    pass

@admin.register(models.FixedAsset)
class FixedAssetAdmin(admin.ModelAdmin):
    pass

@admin.register(models.DeferredRevenue)
class DeferredRevenueAdmin(admin.ModelAdmin):
    pass

@admin.register(models.Currency)
class CurrencyAdmin(admin.ModelAdmin):
    pass

@admin.register(models.ExchangeRate)
class ExchangeRateAdmin(admin.ModelAdmin):
    pass

@admin.register(models.TaxAuthority)
class TaxAuthorityAdmin(admin.ModelAdmin):
    pass

@admin.register(models.TaxGroup)
class TaxGroupAdmin(admin.ModelAdmin):
    pass

@admin.register(models.BankReconciliation)
class BankReconciliationAdmin(admin.ModelAdmin):
    pass

@admin.register(models.DunningWorkflow)
class DunningWorkflowAdmin(admin.ModelAdmin):
    pass

@admin.register(models.FiscalYear)
class FiscalYearAdmin(admin.ModelAdmin):
    pass

@admin.register(models.FiscalPeriod)
class FiscalPeriodAdmin(admin.ModelAdmin):
    pass

@admin.register(models.AccountingJournal)
class AccountingJournalAdmin(admin.ModelAdmin):
    pass

@admin.register(models.FiscalPosition)
class FiscalPositionAdmin(admin.ModelAdmin):
    pass

@admin.register(models.VendorBill)
class VendorBillAdmin(admin.ModelAdmin):
    pass

@admin.register(models.BillLine)
class BillLineAdmin(admin.ModelAdmin):
    pass

@admin.register(models.AnalyticAccount)
class AnalyticAccountAdmin(admin.ModelAdmin):
    pass

@admin.register(models.AnalyticLine)
class AnalyticLineAdmin(admin.ModelAdmin):
    pass

@admin.register(models.CostCenter)
class CostCenterAdmin(admin.ModelAdmin):
    pass

@admin.register(models.BudgetLine)
class BudgetLineAdmin(admin.ModelAdmin):
    pass

@admin.register(models.PurchaseRequisition)
class PurchaseRequisitionAdmin(admin.ModelAdmin):
    pass

