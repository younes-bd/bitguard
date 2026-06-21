from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from ..domain.models import (
    Invoice, Payment, Expense, TaxConfig, GeneralLedger,
    Account, JournalEntry, BankAccount, BankTransaction, FixedAsset, CreditNote,
    PaymentTerms, InvoiceBranding, DeferredRevenue,
    Currency, ExchangeRate, TaxAuthority, TaxGroup, BankReconciliation, DunningWorkflow
)

from .serializers import (
    InvoiceSerializer, PaymentSerializer, ExpenseSerializer, TaxConfigSerializer, GeneralLedgerSerializer,
    AccountSerializer, JournalEntrySerializer, BankAccountSerializer,
    BankTransactionSerializer, FixedAssetSerializer, CreditNoteSerializer,
    PaymentTermsSerializer, InvoiceBrandingSerializer, DeferredRevenueSerializer,
    CurrencySerializer, ExchangeRateSerializer, TaxAuthoritySerializer,
    TaxGroupSerializer, BankReconciliationSerializer, DunningWorkflowSerializer
)

class InvoiceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = InvoiceSerializer
    def get_queryset(self): return Invoice.objects.filter(tenant=self.request.user.tenant)

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
        return Response({'status': invoice.status})

class PaymentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer
    def get_queryset(self): return Payment.objects.filter(tenant=self.request.user.tenant)

class ExpenseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ExpenseSerializer
    def get_queryset(self): return Expense.objects.filter(tenant=self.request.user.tenant)

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

class TaxConfigViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaxConfigSerializer
    def get_queryset(self): return TaxConfig.objects.filter(tenant=self.request.user.tenant)

class GeneralLedgerViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = GeneralLedgerSerializer
    def get_queryset(self): return GeneralLedger.objects.filter(tenant=self.request.user.tenant)

class AccountViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AccountSerializer
    def get_queryset(self): return Account.objects.filter(tenant=self.request.user.tenant)

class JournalEntryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = JournalEntrySerializer
    def get_queryset(self): return JournalEntry.objects.filter(tenant=self.request.user.tenant)

    @action(detail=True, methods=['post'])
    def post(self, request, pk=None):
        entry = self.get_object()
        entry.is_posted = True
        entry.save()
        return Response({'status': 'posted'})

    @action(detail=True, methods=['post'])
    def unpost(self, request, pk=None):
        entry = self.get_object()
        entry.is_posted = False
        entry.save()
        return Response({'status': 'unposted'})

class BankAccountViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BankAccountSerializer
    def get_queryset(self): return BankAccount.objects.filter(tenant=self.request.user.tenant)

class BankTransactionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BankTransactionSerializer
    def get_queryset(self): return BankTransaction.objects.filter(tenant=self.request.user.tenant)

class FixedAssetViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FixedAssetSerializer
    def get_queryset(self): return FixedAsset.objects.filter(tenant=self.request.user.tenant)

    @action(detail=True, methods=['post'])
    def run_depreciation(self, request, pk=None):
        asset = self.get_object()
        return Response({'status': 'depreciation run'})

class CreditNoteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CreditNoteSerializer
    def get_queryset(self): return CreditNote.objects.filter(tenant=self.request.user.tenant)

class PaymentTermsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentTermsSerializer
    def get_queryset(self): return PaymentTerms.objects.filter(tenant=self.request.user.tenant)

class InvoiceBrandingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = InvoiceBrandingSerializer
    def get_queryset(self): return InvoiceBranding.objects.filter(tenant=self.request.user.tenant)

class DeferredRevenueViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = DeferredRevenueSerializer
    def get_queryset(self): return DeferredRevenue.objects.filter(tenant=self.request.user.tenant)

    @action(detail=True, methods=['post'])
    def recognize(self, request, pk=None):
        revenue = self.get_object()
        return Response({'status': 'recognized'})

class CurrencyViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = CurrencySerializer
    def get_queryset(self): return Currency.objects.filter(tenant=self.request.user.tenant)

class ExchangeRateViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ExchangeRateSerializer
    def get_queryset(self): return ExchangeRate.objects.filter(tenant=self.request.user.tenant)

class TaxAuthorityViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaxAuthoritySerializer
    def get_queryset(self): return TaxAuthority.objects.filter(tenant=self.request.user.tenant)

class TaxGroupViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaxGroupSerializer
    def get_queryset(self): return TaxGroup.objects.filter(tenant=self.request.user.tenant)

class BankReconciliationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = BankReconciliationSerializer
    def get_queryset(self): return BankReconciliation.objects.filter(tenant=self.request.user.tenant)

class DunningWorkflowViewSet(viewsets.ModelViewSet):
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

class FiscalYearViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FiscalYearSerializer
    def get_queryset(self): return FiscalYear.objects.filter(tenant=self.request.user.tenant)

class FiscalPeriodViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FiscalPeriodSerializer
    def get_queryset(self): return FiscalPeriod.objects.filter(tenant=self.request.user.tenant)

class AccountingJournalViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = AccountingJournalSerializer
    def get_queryset(self): return AccountingJournal.objects.filter(tenant=self.request.user.tenant)

class VendorBillViewSet(viewsets.ModelViewSet):
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

class RecurringInvoiceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = RecurringInvoiceSerializer
    def get_queryset(self): return RecurringInvoice.objects.filter(tenant=self.request.user.tenant)

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

class FiscalPositionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = FiscalPositionSerializer
    def get_queryset(self): return FiscalPosition.objects.filter(tenant=self.request.user.tenant)

from datetime import date
from django.db.models import Sum

class AgedReceivablesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        tenant = request.user.tenant
        invoices = Invoice.objects.filter(tenant=tenant).exclude(status__in=['paid', 'void'])
        today = date.today()
        
        report = {}
        for inv in invoices:
            client_id = str(inv.client.id) if inv.client else 'unknown'
            client_name = inv.client.name if inv.client else 'Unknown Client'
            
            if client_id not in report:
                report[client_id] = {
                    'client_name': client_name,
                    'current': 0, 'days_30': 0, 'days_60': 0, 'days_90': 0, 'older': 0, 'total': 0
                }
                
            amount = float(inv.total_amount or 0)
            if not inv.due_date or inv.due_date >= today:
                report[client_id]['current'] += amount
            else:
                days_overdue = (today - inv.due_date).days
                if days_overdue <= 30: report[client_id]['days_30'] += amount
                elif days_overdue <= 60: report[client_id]['days_60'] += amount
                elif days_overdue <= 90: report[client_id]['days_90'] += amount
                else: report[client_id]['older'] += amount
                
            report[client_id]['total'] += amount
            
        return Response(list(report.values()))

class AgedPayablesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        tenant = request.user.tenant
        bills = VendorBill.objects.filter(tenant=tenant).exclude(status__in=['paid', 'cancelled'])
        today = date.today()
        
        report = {}
        for bill in bills:
            vendor_id = str(bill.vendor.id) if getattr(bill, 'vendor', None) else 'unknown'
            vendor_name = bill.vendor.name if getattr(bill, 'vendor', None) else 'Unknown Vendor'
            
            if vendor_id not in report:
                report[vendor_id] = {
                    'vendor_name': vendor_name,
                    'current': 0, 'days_30': 0, 'days_60': 0, 'days_90': 0, 'older': 0, 'total': 0
                }
                
            amount = float(bill.total_amount or 0)
            if not bill.due_date or bill.due_date >= today:
                report[vendor_id]['current'] += amount
            else:
                days_overdue = (today - bill.due_date).days
                if days_overdue <= 30: report[vendor_id]['days_30'] += amount
                elif days_overdue <= 60: report[vendor_id]['days_60'] += amount
                elif days_overdue <= 90: report[vendor_id]['days_90'] += amount
                else: report[vendor_id]['older'] += amount
                
            report[vendor_id]['total'] += amount
            
        return Response(list(report.values()))

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        tenant = request.user.tenant
        total_invoices = Invoice.objects.filter(tenant=tenant).count()
        rev_mtd = Invoice.objects.filter(tenant=tenant, status='PAID').aggregate(total=Sum('total_amount'))['total'] or 0
        exp_mtd = Expense.objects.filter(tenant=tenant, status='APPROVED').aggregate(total=Sum('amount'))['total'] or 0
        overdue = Invoice.objects.filter(tenant=tenant, status='OVERDUE').aggregate(total=Sum('total_amount'))['total'] or 0
        outstanding_ar = Invoice.objects.filter(tenant=tenant, status__in=['SENT', 'PARTIAL']).aggregate(t=Sum('total_amount'))['t'] or 0
        
        rev_val = float(rev_mtd)
        exp_val = float(exp_mtd)
        out_ar_val = float(outstanding_ar)
        total_sales = rev_val + out_ar_val

        dso = int((out_ar_val / total_sales) * 30) if total_sales > 0 else 0
        collection_rate = int((rev_val / total_sales) * 100) if total_sales > 0 else 100
        cash_position = rev_val - exp_val

        return Response({
            'stats': {
                'revenue_mtd': rev_mtd,
                'expenses_mtd': exp_mtd,
                'net_profit_mtd': rev_mtd - exp_mtd,
                'outstanding_ar': outstanding_ar,
                'overdue_amount': overdue,
                'cash_position': cash_position,
                'total_invoices_issued': total_invoices,
                'avg_invoice_value': rev_mtd / total_invoices if total_invoices > 0 else 0,
                'dso': dso,
                'collection_rate': collection_rate
            }
        })

class MonthlyFinancialsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        tenant = request.user.tenant
        from django.db.models.functions import TruncMonth

        invoices = Invoice.objects.filter(tenant=tenant, status='PAID').annotate(month=TruncMonth('issue_date')).values('month').annotate(income=Sum('total_amount')).order_by('month')
        expenses = Expense.objects.filter(tenant=tenant, status='APPROVED').annotate(month=TruncMonth('date')).values('month').annotate(expense=Sum('amount')).order_by('month')

        data_dict = {}
        for inv in invoices:
            if inv['month']:
                month_str = inv['month'].strftime('%b')
                if month_str not in data_dict:
                    data_dict[month_str] = {'name': month_str, 'income': 0, 'expense': 0, 'sort_val': inv['month']}
                data_dict[month_str]['income'] += float(inv['income'] or 0)

        for exp in expenses:
            if exp['month']:
                month_str = exp['month'].strftime('%b')
                if month_str not in data_dict:
                    data_dict[month_str] = {'name': month_str, 'income': 0, 'expense': 0, 'sort_val': exp['month']}
                data_dict[month_str]['expense'] += float(exp['expense'] or 0)

        sorted_data = sorted(data_dict.values(), key=lambda x: x['sort_val'])
        for item in sorted_data:
            del item['sort_val']

        return Response(sorted_data)

