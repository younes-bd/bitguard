from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    InvoiceViewSet, PaymentViewSet, ExpenseViewSet, TaxConfigViewSet, GeneralLedgerViewSet,
    AccountViewSet, JournalEntryViewSet, BankAccountViewSet,
    BankTransactionViewSet, FixedAssetViewSet, CreditNoteViewSet,
    BalanceSheetView, CashFlowView, ProfitLossView,
    PaymentTermsViewSet, InvoiceBrandingViewSet,
    DeferredRevenueViewSet, ClientPortalInvoiceView,
    CurrencyViewSet, ExchangeRateViewSet, TaxAuthorityViewSet,
    TaxGroupViewSet, BankReconciliationViewSet, DunningWorkflowViewSet,
    AgedReceivablesView, AgedPayablesView, DashboardStatsView, MonthlyFinancialsView
)

router = DefaultRouter()
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'taxes', TaxConfigViewSet, basename='tax')
router.register(r'ledger', GeneralLedgerViewSet, basename='ledger')
router.register(r'accounts', AccountViewSet, basename='account')
router.register(r'journal-entries', JournalEntryViewSet, basename='journal-entry')
router.register(r'bank-accounts', BankAccountViewSet, basename='bank-account')
router.register(r'bank-transactions', BankTransactionViewSet, basename='bank-transaction')
router.register(r'fixed-assets', FixedAssetViewSet, basename='fixed-asset')
router.register(r'credit-notes', CreditNoteViewSet, basename='credit-note')
router.register(r'payment-terms', PaymentTermsViewSet, basename='payment-terms')
router.register(r'invoice-branding', InvoiceBrandingViewSet, basename='invoice-branding')
router.register(r'deferred-revenue', DeferredRevenueViewSet, basename='deferred-revenue')

# Enterprise MSP Phase 4
router.register(r'currencies', CurrencyViewSet, basename='currency')
router.register(r'exchange-rates', ExchangeRateViewSet, basename='exchange-rate')
router.register(r'tax-authorities', TaxAuthorityViewSet, basename='tax-authority')
router.register(r'tax-groups', TaxGroupViewSet, basename='tax-group')
router.register(r'bank-reconciliations', BankReconciliationViewSet, basename='bank-reconciliation')
router.register(r'dunning-workflows', DunningWorkflowViewSet, basename='dunning-workflow')

from .views import (
    FiscalYearViewSet, FiscalPeriodViewSet, AccountingJournalViewSet, VendorBillViewSet,
    RecurringInvoiceViewSet, FiscalPositionViewSet
)
router.register(r'fiscal-years', FiscalYearViewSet, basename='fiscal-year')
router.register(r'fiscal-periods', FiscalPeriodViewSet, basename='fiscal-period')
router.register(r'journals', AccountingJournalViewSet, basename='journal')
router.register(r'vendor-bills', VendorBillViewSet, basename='vendor-bill')
router.register(r'recurring-invoices', RecurringInvoiceViewSet, basename='recurring-invoice')
router.register(r'fiscal-positions', FiscalPositionViewSet, basename='fiscal-position')

from .views import AccountJournalViewSet, TaxViewSet
router.register(r'account-journals', AccountJournalViewSet, basename='account-journal')
router.register(r'taxes-v2', TaxViewSet, basename='tax-v2')

urlpatterns = [
    path('portal/invoice/<uuid:token>/', ClientPortalInvoiceView.as_view(), name='client-portal-invoice'),
    path('reports/balance-sheet/', BalanceSheetView.as_view(), name='balance-sheet'),
    path('reports/cash-flow/', CashFlowView.as_view(), name='cash-flow'),
    path('reports/profit-loss/', ProfitLossView.as_view(), name='profit-loss'),
    path('reports/aged-receivables/', AgedReceivablesView.as_view(), name='aged-receivables'),
    path('reports/aged-payables/', AgedPayablesView.as_view(), name='aged-payables'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('dashboard/financials/', MonthlyFinancialsView.as_view(), name='monthly-financials'),
    path('', include(router.urls)),
]
