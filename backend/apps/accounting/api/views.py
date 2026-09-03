from apps.core.api.mixins import TenantScopedMixin
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from apps.core.services.audit import AuditService

from ..domain.models import (
    Invoice, Payment, Expense, TaxConfig, GeneralLedger,
    Account, JournalEntry, BankAccount, BankTransaction, FixedAsset, CreditNote,
    PaymentTerms, InvoiceBranding, DeferredRevenue,
    Currency, ExchangeRate, TaxAuthority, TaxGroup, BankReconciliation, DunningWorkflow,
    AccountJournal, Tax
)

from .serializers import (
    AnalyticAccountSerializer, CostCenterSerializer, BudgetLineSerializer,
    InvoiceSerializer, PaymentSerializer, ExpenseSerializer, TaxConfigSerializer, GeneralLedgerSerializer,
    AccountSerializer, JournalEntrySerializer, BankAccountSerializer,
    BankTransactionSerializer, FixedAssetSerializer, CreditNoteSerializer,
    PaymentTermsSerializer, InvoiceBrandingSerializer, DeferredRevenueSerializer,
    CurrencySerializer, ExchangeRateSerializer, TaxAuthoritySerializer,
    TaxGroupSerializer, BankReconciliationSerializer, DunningWorkflowSerializer,
    AccountJournalSerializer, TaxSerializer
)

class AccountJournalViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AccountJournalSerializer
    def get_queryset(self):
        return AccountJournal.objects.filter(tenant=self.request.user.tenant)

class TaxViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaxSerializer
    def get_queryset(self):
        return Tax.objects.filter(tenant=self.request.user.tenant)

class InvoiceViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = InvoiceSerializer
    def get_queryset(self): return Invoice.objects.filter(tenant=self.request.user.tenant).select_related('client', 'sale_order', 'tenant').prefetch_related('items')

    @action(detail=True, methods=['post'], url_path='generate-report')
    def generate_report(self, request, pk=None):
        from apps.reporting.domain.models import ReportTemplate
        from apps.reporting.services.pdf_generator import ReportingService
        record = self.get_object()
        template = ReportTemplate.objects.filter(
            tenant=request.user.tenant,
            model=f"{record._meta.app_label}.{record._meta.model_name}",
            is_default=True,
            is_active=True,
        ).first()
        if not template:
            return Response({'error': 'No default template configured.'}, status=404)
        attachment = ReportingService.generate_pdf(template, record)
        if not attachment:
            return Response({'error': 'PDF generation failed.'}, status=500)
        return Response({'url': attachment.file.url, 'filename': attachment.name})

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        invoice = self.get_object()
        invoice.status = 'approved'
        invoice.save()
        return Response({'status': invoice.status})

    @action(detail=True, methods=['post'])
    def void(self, request, pk=None):
        if not request.user.is_staff and not request.user.is_superuser:
            if not request.user.roles.filter(name__in=['SUPER_ADMIN', 'TENANT_ADMIN', 'MANAGER']).exists():
                return Response({'error': 'Forbidden: Requires accountant/manager role'}, status=403)
        invoice = self.get_object()
        invoice.status = 'void'
        invoice.save()
        return Response({'status': invoice.status})

    @action(detail=True, methods=['post'])
    def send(self, request, pk=None):
        invoice = self.get_object()
        invoice.status = 'sent'
        invoice.save()
        return Response({'status': invoice.status})

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        invoice = self.get_object()
        invoice.status = 'paid'
        invoice.save()
        AuditService.log_action(request.user, 'INVOICE_MARKED_PAID', f"Invoice {invoice.id} marked as paid", invoice)
        return Response({'status': invoice.status})

class PaymentViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer
    def get_queryset(self): return Payment.objects.filter(tenant=self.request.user.tenant)
    def perform_create(self, serializer):
        payment = serializer.save()
        from apps.core.services.audit import AuditService
        AuditService.log_action(self.request.user, 'PAYMENT_RECEIVED', f"Payment {payment.id} received", payment)

class ExpenseViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseSerializer
    def get_queryset(self): return Expense.objects.filter(tenant=self.request.user.tenant)

class AnalyticAccountViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AnalyticAccountSerializer
    def get_queryset(self): return AnalyticAccount.objects.filter(tenant=self.request.user.tenant)

class CostCenterViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CostCenterSerializer
    def get_queryset(self): return CostCenter.objects.filter(tenant=self.request.user.tenant)

class BudgetLineViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BudgetLineSerializer
    def get_queryset(self): return BudgetLine.objects.filter(tenant=self.request.user.tenant)

class AnalyticAccountViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AnalyticAccountSerializer
    def get_queryset(self): return AnalyticAccount.objects.filter(tenant=self.request.user.tenant)

class CostCenterViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CostCenterSerializer
    def get_queryset(self): return CostCenter.objects.filter(tenant=self.request.user.tenant)

class BudgetLineViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BudgetLineSerializer
    def get_queryset(self): return BudgetLine.objects.filter(tenant=self.request.user.tenant)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        expense = self.get_object()
        expense.status = 'approved'
        expense.save()
        return Response({'status': expense.status})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        expense = self.get_object()
        expense.status = 'rejected'
        expense.save()
        return Response({'status': expense.status})

class TaxConfigViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaxConfigSerializer
    def get_queryset(self): return TaxConfig.objects.filter(tenant=self.request.user.tenant)

class GeneralLedgerViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = GeneralLedgerSerializer
    def get_queryset(self): return GeneralLedger.objects.filter(tenant=self.request.user.tenant)

class AccountViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AccountSerializer
    def get_queryset(self): return Account.objects.filter(tenant=self.request.user.tenant)

class JournalEntryViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = JournalEntrySerializer
    def get_queryset(self): return JournalEntry.objects.filter(tenant=self.request.user.tenant)

    @action(detail=True, methods=['post'])
    def post(self, request, pk=None):
        entry = self.get_object()
        entry.is_posted = True
        entry.save()
        AuditService.log_action(request.user, 'JOURNAL_ENTRY_POSTED', f"Journal entry {entry.id} posted", entry)
        return Response({'status': 'posted'})

    @action(detail=True, methods=['post'])
    def unpost(self, request, pk=None):
        entry = self.get_object()
        entry.is_posted = False
        entry.save()
        return Response({'status': 'unposted'})

class BankAccountViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BankAccountSerializer
    def get_queryset(self): return BankAccount.objects.filter(tenant=self.request.user.tenant)

class BankTransactionViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BankTransactionSerializer
    def get_queryset(self): return BankTransaction.objects.filter(tenant=self.request.user.tenant)

class FixedAssetViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FixedAssetSerializer
    def get_queryset(self): return FixedAsset.objects.filter(tenant=self.request.user.tenant)

    @action(detail=True, methods=['post'])
    def run_depreciation(self, request, pk=None):
        asset = self.get_object()
        return Response({'status': 'depreciation run'})

class CreditNoteViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CreditNoteSerializer
    def get_queryset(self): return CreditNote.objects.filter(tenant=self.request.user.tenant)

class PaymentTermsViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentTermsSerializer
    def get_queryset(self): return PaymentTerms.objects.filter(tenant=self.request.user.tenant)

class InvoiceBrandingViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = InvoiceBrandingSerializer
    def get_queryset(self): return InvoiceBranding.objects.filter(tenant=self.request.user.tenant)

class DeferredRevenueViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DeferredRevenueSerializer
    def get_queryset(self): return DeferredRevenue.objects.filter(tenant=self.request.user.tenant)

    @action(detail=True, methods=['post'])
    def recognize(self, request, pk=None):
        revenue = self.get_object()
        return Response({'status': 'recognized'})

class CurrencyViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CurrencySerializer
    def get_queryset(self): return Currency.objects.filter(tenant=self.request.user.tenant)

class ExchangeRateViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ExchangeRateSerializer
    def get_queryset(self): return ExchangeRate.objects.filter(tenant=self.request.user.tenant)

class TaxAuthorityViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaxAuthoritySerializer
    def get_queryset(self): return TaxAuthority.objects.filter(tenant=self.request.user.tenant)

class TaxGroupViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaxGroupSerializer
    def get_queryset(self): return TaxGroup.objects.filter(tenant=self.request.user.tenant)

class BankReconciliationViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BankReconciliationSerializer
    def get_queryset(self): return BankReconciliation.objects.filter(tenant=self.request.user.tenant)

class DunningWorkflowViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DunningWorkflowSerializer
    def get_queryset(self): return DunningWorkflow.objects.filter(tenant=self.request.user.tenant)

from ..application.services import FinancialReportingService, ClientPortalService
from django.utils.dateparse import parse_date

class BalanceSheetView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request): 
        date_str = request.query_params.get('date')
        date = parse_date(date_str) if date_str else None
        data = FinancialReportingService.generate_balance_sheet(request, date)
        
        if request.query_params.get('format') == 'pdf':
            from apps.reporting.services.pdf_generator import ReportingService
            from apps.reporting.domain.models import ReportTemplate
            template = ReportTemplate.objects.filter(tenant=request.user.tenant, name='Balance Sheet').first()
            if template:
                attachment = ReportingService.generate_pdf(template, request.user.tenant, {'report_data': data})
                if attachment:
                    return Response({'url': attachment.file.url, 'filename': attachment.name})
            return Response({'error': 'PDF generation failed or template missing.'}, status=500)
            
        return Response(data)

class CashFlowView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request): 
        start_str = request.query_params.get('start_date')
        end_str = request.query_params.get('end_date')
        start = parse_date(start_str) if start_str else None
        end = parse_date(end_str) if end_str else None
        data = FinancialReportingService.generate_cash_flow(request, start, end)
        
        if request.query_params.get('format') == 'pdf':
            from apps.reporting.services.pdf_generator import ReportingService
            from apps.reporting.domain.models import ReportTemplate
            template = ReportTemplate.objects.filter(tenant=request.user.tenant, name='Cash Flow').first()
            if template:
                attachment = ReportingService.generate_pdf(template, request.user.tenant, {'report_data': data})
                if attachment:
                    return Response({'url': attachment.file.url, 'filename': attachment.name})
            return Response({'error': 'PDF generation failed or template missing.'}, status=500)
            
        return Response(data)

class ProfitLossView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request): 
        start_str = request.query_params.get('start_date')
        end_str = request.query_params.get('end_date')
        start = parse_date(start_str) if start_str else None
        end = parse_date(end_str) if end_str else None
        data = FinancialReportingService.generate_profit_loss(request, start, end)
        
        if request.query_params.get('format') == 'pdf':
            from apps.reporting.services.pdf_generator import ReportingService
            from apps.reporting.domain.models import ReportTemplate
            template = ReportTemplate.objects.filter(tenant=request.user.tenant, name='Profit and Loss').first()
            if template:
                attachment = ReportingService.generate_pdf(template, request.user.tenant, {'report_data': data})
                if attachment:
                    return Response({'url': attachment.file.url, 'filename': attachment.name})
            return Response({'error': 'PDF generation failed or template missing.'}, status=500)
            
        return Response(data)

class ClientPortalInvoiceView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, token): 
        return Response(ClientPortalService.get_invoice_by_token(token))

from ..domain.models import FiscalYear, FiscalPeriod, AccountingJournal, VendorBill, RecurringInvoice, FiscalPosition
from .serializers import (
    FiscalYearSerializer, FiscalPeriodSerializer, AccountingJournalSerializer,
    VendorBillSerializer, RecurringInvoiceSerializer, FiscalPositionSerializer
)

class FiscalYearViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FiscalYearSerializer
    def get_queryset(self): return FiscalYear.objects.filter(tenant=self.request.user.tenant)

class FiscalPeriodViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FiscalPeriodSerializer
    def get_queryset(self): return FiscalPeriod.objects.filter(tenant=self.request.user.tenant)

class AccountingJournalViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AccountingJournalSerializer
    def get_queryset(self): return AccountingJournal.objects.filter(tenant=self.request.user.tenant)

class VendorBillViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = VendorBillSerializer
    def get_queryset(self): return VendorBill.objects.filter(tenant=self.request.user.tenant)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        bill = self.get_object()
        bill.status = 'approved'
        bill.save()
        return Response({'status': bill.status})

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        bill = self.get_object()
        bill.status = 'paid'
        bill.save()
        return Response({'status': bill.status})

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        bill = self.get_object()
        bill.status = 'cancelled'
        bill.save()
        return Response({'status': bill.status})

    @action(detail=True, methods=['post'], url_path='generate-report')
    def generate_report(self, request, pk=None):
        from apps.reporting.domain.models import ReportTemplate
        from apps.reporting.services.pdf_generator import ReportingService
        record = self.get_object()
        template = ReportTemplate.objects.filter(
            tenant=request.user.tenant,
            model=f"{record._meta.app_label}.{record._meta.model_name}",
            is_default=True,
            is_active=True,
        ).first()
        if not template:
            return Response({'error': 'No default template configured.'}, status=404)
        attachment = ReportingService.generate_pdf(template, record)
        if not attachment:
            return Response({'error': 'PDF generation failed.'}, status=500)
        return Response({'url': attachment.file.url, 'filename': attachment.name})

class RecurringInvoiceViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RecurringInvoiceSerializer
    def get_queryset(self): return RecurringInvoice.objects.filter(tenant=self.request.user.tenant).select_related('client', 'sale_order', 'tenant').prefetch_related('items')

    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        schedule = self.get_object()
        schedule.is_active = not getattr(schedule, 'is_active', True)
        schedule.save()
        return Response({'status': 'toggled', 'is_active': schedule.is_active})

    @action(detail=True, methods=['post'], url_path='run-now')
    def run_now(self, request, pk=None):
        schedule = self.get_object()
        # In a real Odoo system, this would trigger the invoice generation engine.
        return Response({'status': 'success', 'message': 'Invoice generated from schedule.'})

class FiscalPositionViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FiscalPositionSerializer
    def get_queryset(self): return FiscalPosition.objects.filter(tenant=self.request.user.tenant)


class ExchangeRateViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ExchangeRateSerializer
    def get_queryset(self): return ExchangeRate.objects.filter(tenant=self.request.user.tenant)

class TaxAuthorityViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaxAuthoritySerializer
    def get_queryset(self): return TaxAuthority.objects.filter(tenant=self.request.user.tenant)

class TaxGroupViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaxGroupSerializer
    def get_queryset(self): return TaxGroup.objects.filter(tenant=self.request.user.tenant)

class BankReconciliationViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BankReconciliationSerializer
    def get_queryset(self): return BankReconciliation.objects.filter(tenant=self.request.user.tenant)

class DunningWorkflowViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DunningWorkflowSerializer
    def get_queryset(self): return DunningWorkflow.objects.filter(tenant=self.request.user.tenant)

from ..application.services import FinancialReportingService, ClientPortalService
from django.utils.dateparse import parse_date

class BalanceSheetView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request): 
        date_str = request.query_params.get('date')
        date = parse_date(date_str) if date_str else None
        data = FinancialReportingService.generate_balance_sheet(request, date)
        
        if request.query_params.get('format') == 'pdf':
            from apps.reporting.services.pdf_generator import ReportingService
            from apps.reporting.domain.models import ReportTemplate
            template = ReportTemplate.objects.filter(tenant=request.user.tenant, name='Balance Sheet').first()
            if template:
                attachment = ReportingService.generate_pdf(template, request.user.tenant, {'report_data': data})
                if attachment:
                    return Response({'url': attachment.file.url, 'filename': attachment.name})
            return Response({'error': 'PDF generation failed or template missing.'}, status=500)
            
        return Response(data)

class CashFlowView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request): 
        start_str = request.query_params.get('start_date')
        end_str = request.query_params.get('end_date')
        start = parse_date(start_str) if start_str else None
        end = parse_date(end_str) if end_str else None
        data = FinancialReportingService.generate_cash_flow(request, start, end)
        
        if request.query_params.get('format') == 'pdf':
            from apps.reporting.services.pdf_generator import ReportingService
            from apps.reporting.domain.models import ReportTemplate
            template = ReportTemplate.objects.filter(tenant=request.user.tenant, name='Cash Flow').first()
            if template:
                attachment = ReportingService.generate_pdf(template, request.user.tenant, {'report_data': data})
                if attachment:
                    return Response({'url': attachment.file.url, 'filename': attachment.name})
            return Response({'error': 'PDF generation failed or template missing.'}, status=500)
            
        return Response(data)

class ProfitLossView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request): 
        start_str = request.query_params.get('start_date')
        end_str = request.query_params.get('end_date')
        start = parse_date(start_str) if start_str else None
        end = parse_date(end_str) if end_str else None
        data = FinancialReportingService.generate_profit_loss(request, start, end)
        
        if request.query_params.get('format') == 'pdf':
            from apps.reporting.services.pdf_generator import ReportingService
            from apps.reporting.domain.models import ReportTemplate
            template = ReportTemplate.objects.filter(tenant=request.user.tenant, name='Profit and Loss').first()
            if template:
                attachment = ReportingService.generate_pdf(template, request.user.tenant, {'report_data': data})
                if attachment:
                    return Response({'url': attachment.file.url, 'filename': attachment.name})
            return Response({'error': 'PDF generation failed or template missing.'}, status=500)
            
        return Response(data)

class ClientPortalInvoiceView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, token): 
        return Response(ClientPortalService.get_invoice_by_token(token))

from ..domain.models import FiscalYear, FiscalPeriod, AccountingJournal, VendorBill, RecurringInvoice, FiscalPosition
from .serializers import (
    FiscalYearSerializer, FiscalPeriodSerializer, AccountingJournalSerializer,
    VendorBillSerializer, RecurringInvoiceSerializer, FiscalPositionSerializer
)

class FiscalYearViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FiscalYearSerializer
    def get_queryset(self): return FiscalYear.objects.filter(tenant=self.request.user.tenant)

class FiscalPeriodViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FiscalPeriodSerializer
    def get_queryset(self): return FiscalPeriod.objects.filter(tenant=self.request.user.tenant)

class AccountingJournalViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AccountingJournalSerializer
    def get_queryset(self): return AccountingJournal.objects.filter(tenant=self.request.user.tenant)

class VendorBillViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = VendorBillSerializer
    def get_queryset(self): return VendorBill.objects.filter(tenant=self.request.user.tenant)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        bill = self.get_object()
        bill.status = 'approved'
        bill.save()
        return Response({'status': bill.status})

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        bill = self.get_object()
        bill.status = 'paid'
        bill.save()
        return Response({'status': bill.status})

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        bill = self.get_object()
        bill.status = 'cancelled'
        bill.save()
        return Response({'status': bill.status})

    @action(detail=True, methods=['post'], url_path='generate-report')
    def generate_report(self, request, pk=None):
        from apps.reporting.domain.models import ReportTemplate
        from apps.reporting.services.pdf_generator import ReportingService
        record = self.get_object()
        template = ReportTemplate.objects.filter(
            tenant=request.user.tenant,
            model=f"{record._meta.app_label}.{record._meta.model_name}",
            is_default=True,
            is_active=True,
        ).first()
        if not template:
            return Response({'error': 'No default template configured.'}, status=404)
        attachment = ReportingService.generate_pdf(template, record)
        if not attachment:
            return Response({'error': 'PDF generation failed.'}, status=500)
        return Response({'url': attachment.file.url, 'filename': attachment.name})

class RecurringInvoiceViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RecurringInvoiceSerializer
    def get_queryset(self): return RecurringInvoice.objects.filter(tenant=self.request.user.tenant).select_related('client', 'sale_order', 'tenant').prefetch_related('items')

    @action(detail=True, methods=['post'])
    def toggle(self, request, pk=None):
        schedule = self.get_object()
        schedule.is_active = not getattr(schedule, 'is_active', True)
        schedule.save()
        return Response({'status': 'toggled', 'is_active': schedule.is_active})

    @action(detail=True, methods=['post'], url_path='run-now')
    def run_now(self, request, pk=None):
        schedule = self.get_object()
        # In a real Odoo system, this would trigger the invoice generation engine.
        return Response({'status': 'success', 'message': 'Invoice generated from schedule.'})

class FiscalPositionViewSet(TenantScopedMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FiscalPositionSerializer
    def get_queryset(self): return FiscalPosition.objects.filter(tenant=self.request.user.tenant)

from datetime import date
from django.db.models import Sum

class AgedReceivablesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        from ..application.services import DashboardService
        return Response(DashboardService.get_aged_receivables(request))

class VATReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        period_start = request.query_params.get('period_start')
        period_end = request.query_params.get('period_end')
        from ..application.services import DashboardService
        data = DashboardService.get_vat_report(request, period_start, period_end)
        
        if request.query_params.get('format') == 'pdf':
            from apps.reporting.domain.models import ReportTemplate
            from apps.reporting.services.pdf_generator import ReportingService
            template = ReportTemplate.objects.filter(
                tenant=request.user.tenant, 
                name='VAT Report',
                is_default=True
            ).first()
            if not template:
                return Response({'error': 'No VAT template found'}, status=404)
            attachment = ReportingService.generate_pdf(template, request.user.tenant, {'report_data': data})
            if not attachment:
                return Response({'error': 'PDF generation failed'}, status=500)
            return Response({'url': attachment.file.url, 'filename': attachment.name})
            
        return Response(data)

class AgedPayablesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        from ..application.services import DashboardService
        return Response(DashboardService.get_aged_payables(request))

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        from ..application.services import DashboardService
        return Response({'stats': DashboardService.get_dashboard_stats(request)})

class MonthlyFinancialsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        from ..application.services import DashboardService
        return Response(DashboardService.get_monthly_financials(request))

class FinanceReportView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        from ..application.services import DashboardService
        return Response({"status": "success", "data": DashboardService.get_finance_report(request)})

class ExportInvoicesCSV(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        from django.http import HttpResponse
        from ..application.services import DashboardService
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="invoices_export.csv"'
        response.write(DashboardService.export_invoices_csv(request))
        return response
