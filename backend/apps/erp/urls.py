from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    InvoiceViewSet, PaymentViewSet, ExpenseViewSet, ErpDashboardView,
    MonthlyFinancialsView,
    DeliveryNoteViewSet, TaxConfigViewSet, CostCenterViewSet,
    BudgetLineViewSet, GeneralLedgerViewSet,
    VendorViewSet, PurchaseOrderViewSet, RecurringInvoiceViewSet,
    InternalProjectViewSet, RiskViewSet,
    ClientStatementView,
    AccountViewSet, JournalEntryViewSet, BankAccountViewSet,
    BankTransactionViewSet, FixedAssetViewSet, CreditNoteViewSet,
    BalanceSheetView, CashFlowView, ProfitLossView,
    PaymentTermsViewSet, InvoiceBrandingViewSet,
    DeferredRevenueViewSet, ClientPortalInvoiceView,
)

router = DefaultRouter()
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'delivery-notes', DeliveryNoteViewSet, basename='delivery-note')
router.register(r'taxes', TaxConfigViewSet, basename='tax')
router.register(r'cost-centers', CostCenterViewSet, basename='cost-center')
router.register(r'budgets', BudgetLineViewSet, basename='budget')
router.register(r'ledger', GeneralLedgerViewSet, basename='ledger')
router.register(r'vendors', VendorViewSet, basename='vendor')
router.register(r'purchase-orders', PurchaseOrderViewSet, basename='purchase-order')
router.register(r'recurring-invoices', RecurringInvoiceViewSet, basename='recurring-invoice')
router.register(r'projects', InternalProjectViewSet, basename='project')
router.register(r'risks', RiskViewSet, basename='risk')
router.register(r'accounts', AccountViewSet, basename='account')
router.register(r'journal-entries', JournalEntryViewSet, basename='journal-entry')
router.register(r'bank-accounts', BankAccountViewSet, basename='bank-account')
router.register(r'bank-transactions', BankTransactionViewSet, basename='bank-transaction')
router.register(r'fixed-assets', FixedAssetViewSet, basename='fixed-asset')
router.register(r'credit-notes', CreditNoteViewSet, basename='credit-note')
router.register(r'payment-terms', PaymentTermsViewSet, basename='payment-terms')
router.register(r'invoice-branding', InvoiceBrandingViewSet, basename='invoice-branding')
router.register(r'deferred-revenue', DeferredRevenueViewSet, basename='deferred-revenue')

urlpatterns = [
    path('portal/invoice/<uuid:token>/', ClientPortalInvoiceView.as_view(), name='client-portal-invoice'),
    path('dashboard/', ErpDashboardView.as_view(), name='erp-dashboard'),
    path('dashboard/monthly/', MonthlyFinancialsView.as_view(), name='erp-dashboard-monthly'),
    path('client-statement/<uuid:client_id>/', ClientStatementView.as_view(), name='client-statement'),
    path('reports/balance-sheet/', BalanceSheetView.as_view(), name='balance-sheet'),
    path('reports/cash-flow/', CashFlowView.as_view(), name='cash-flow'),
    path('reports/profit-loss/', ProfitLossView.as_view(), name='profit-loss'),
    path('', include(router.urls)),
]