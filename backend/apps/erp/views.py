"""
ERP Views — Full Enterprise Edition
Charter §8, §9: Views orchestrate; services decide.
"""
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .permissions import IsERPAccessible
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from apps.core.utils.response import standard_response
from .models import (
    Invoice, Payment, Expense, InternalProject, Risk,
    DeliveryNote, TaxConfig, CostCenter, BudgetLine, GeneralLedger,
    ErpVendor, ErpPurchaseOrder, RecurringInvoice,
    Account, JournalEntry, BankAccount, BankTransaction,
    FixedAsset, CreditNote,
    PaymentTerms, InvoiceBranding, DeferredRevenue,
)
from .serializers import (
    InvoiceSerializer, PaymentSerializer, ExpenseSerializer,
    InternalProjectSerializer, RiskSerializer,
    DeliveryNoteSerializer, TaxConfigSerializer, CostCenterSerializer,
    BudgetLineSerializer, GeneralLedgerSerializer,
    VendorSerializer, PurchaseOrderSerializer, RecurringInvoiceSerializer,
    AccountSerializer, JournalEntrySerializer, BankAccountSerializer,
    BankTransactionSerializer, FixedAssetSerializer, CreditNoteSerializer,
    PaymentTermsSerializer, InvoiceBrandingSerializer,
    DeferredRevenueSerializer,
)
from .services import (
    InvoiceService, PaymentService, ExpenseService,
    InternalProjectService, EnterpriseService, DeliveryNoteService,
    VendorService, PurchaseOrderService, RecurringInvoiceService,
    JournalEntryService, BankService, FinancialReportingService,
    PdfService, InvoiceEmailService, TaxRulesService, ClientPortalService,
    AgingReportService, CurrencyService, DeferredRevenueService,
)
import django_filters.rest_framework
from django.http import HttpResponse


# ─── INVOICE ──────────────────────────────────────────────────────────────────

class InvoiceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = InvoiceSerializer

    def get_queryset(self):
        return InvoiceService.get_queryset(self.request)

    def create(self, request, *args, **kwargs):
        data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        items = data.pop('items', [])
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        invoice = InvoiceService.create_invoice(request, serializer.validated_data, items)
        return standard_response(True, "Invoice created", self.get_serializer(invoice).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        invoice = self.get_object()
        invoice = InvoiceService.update_invoice(request, invoice, request.data)
        return standard_response(True, "Invoice updated", self.get_serializer(invoice).data)

    @action(detail=True, methods=['post'], url_path='mark-sent')
    def mark_sent(self, request, pk=None):
        invoice = self.get_object()
        InvoiceService.update_invoice(request, invoice, {'status': 'sent'})
        return standard_response(True, "Invoice marked as sent", {})

    @action(detail=True, methods=['post'], url_path='mark-paid')
    def mark_paid(self, request, pk=None):
        invoice = self.get_object()
        from django.utils import timezone
        InvoiceService.update_invoice(request, invoice, {'status': 'paid', 'paid_at': timezone.now()})
        return standard_response(True, "Invoice marked as paid", {})

    @action(detail=True, methods=['post'], url_path='void')
    def void(self, request, pk=None):
        invoice = self.get_object()
        InvoiceService.void_invoice(request, invoice)
        return standard_response(True, "Invoice voided", {})

    @action(detail=True, methods=['post'], url_path='duplicate')
    def duplicate(self, request, pk=None):
        invoice = self.get_object()
        new_invoice = InvoiceService.duplicate_invoice(request, invoice)
        return standard_response(True, "Invoice duplicated", self.get_serializer(new_invoice).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='send-to-client')
    def send_to_client(self, request, pk=None):
        invoice = self.get_object()
        try:
            InvoiceService.send_to_client(request, invoice)
            return standard_response(True, "Invoice dispatched to client", {})
        except ValueError as e:
            return standard_response(False, str(e), {}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='convert-to-invoice')
    def convert_to_invoice(self, request, pk=None):
        invoice = self.get_object()
        if invoice.type not in ('proforma', 'quotation'):
            return standard_response(False, "Only proforma or quotation documents can be converted.", {}, status=status.HTTP_400_BAD_REQUEST)
        InvoiceService.update_invoice(request, invoice, {'type': 'standard', 'status': 'sent'})
        if invoice.type == 'proforma':
            from .services import GeneralLedgerService
            GeneralLedgerService.record_entry(
                request, "Accounts Receivable", invoice.total_amount, 'debit',
                invoice.pk, 'invoice', f"Converted from Proforma #{invoice.invoice_number}"
            )
        invoice.refresh_from_db()
        return standard_response(True, "Converted to standard invoice", self.get_serializer(invoice).data)

    @action(detail=True, methods=['post'], url_path='accept-quotation')
    def accept_quotation(self, request, pk=None):
        invoice = self.get_object()
        if invoice.type != 'quotation':
            return standard_response(False, "This document is not a quotation.", {}, status=status.HTTP_400_BAD_REQUEST)
        InvoiceService.update_invoice(request, invoice, {'status': 'sent'})
        return standard_response(True, "Quotation accepted", {})

    @action(detail=True, methods=['post'], url_path='decline-quotation')
    def decline_quotation(self, request, pk=None):
        invoice = self.get_object()
        InvoiceService.update_invoice(request, invoice, {'status': 'void'})
        return standard_response(True, "Quotation declined", {})

    @action(detail=True, methods=['get'], url_path='download-pdf')
    def download_pdf(self, request, pk=None):
        invoice = self.get_object()
        try:
            pdf_bytes = PdfService.generate_pdf_bytes(invoice)
            response = HttpResponse(pdf_bytes, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="Invoice_{invoice.invoice_number}.pdf"'
            return response
        except Exception as e:
            return standard_response(False, f"Failed to generate PDF: {str(e)}", {}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'], url_path='send-email')
    def send_email(self, request, pk=None):
        invoice = self.get_object()
        try:
            InvoiceEmailService.send_invoice(invoice)
            return standard_response(True, "Invoice emailed to client successfully", {})
        except Exception as e:
            return standard_response(False, str(e), {}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='aging-report')
    def aging_report(self, request):
        export = request.query_params.get('export', 'false').lower() == 'true'
        if export:
            csv_data = AgingReportService.export_csv(request)
            response = HttpResponse(csv_data, content_type='text/csv')
            response['Content-Disposition'] = 'attachment; filename="AR_Aging_Report.csv"'
            return response
        
        report = AgingReportService.get_report(request)
        return standard_response(True, "Aging Report", report)

    @action(detail=False, methods=['get'], url_path='profit-loss')
    def profit_loss(self, request):
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        if not date_from or not date_to:
            return standard_response(False, "date_from and date_to required", {}, status=status.HTTP_400_BAD_REQUEST)
        report = InvoiceService.get_profit_loss(request, date_from, date_to)
        return standard_response(True, "Profit & Loss Report", report)


# ─── PAYMENT ──────────────────────────────────────────────────────────────────

class PaymentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return PaymentService.get_queryset(self.request)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        invoice = serializer.validated_data['invoice']
        payment = PaymentService.record_payment(request, invoice, serializer.validated_data)
        return standard_response(True, "Payment recorded", self.get_serializer(payment).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='void')
    def void(self, request, pk=None):
        payment = self.get_object()
        PaymentService.void_payment(request, payment)
        return standard_response(True, "Payment voided and ledger reversed", {})


# ─── EXPENSE ──────────────────────────────────────────────────────────────────

class ExpenseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        qs = ExpenseService.get_queryset(self.request)
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        expense = ExpenseService.create_expense(request, serializer.validated_data)
        return standard_response(True, "Expense recorded", self.get_serializer(expense).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        from apps.core.services.audit import AuditService
        expense = self.get_object()
        expense.status = 'approved'
        expense.save()
        AuditService.log_action(request, 'ERP_EXPENSE_APPROVED', f'erp.Expense:{expense.pk}', {})
        return standard_response(True, 'Expense approved', self.get_serializer(expense).data)

    @action(detail=True, methods=['post'], url_path='reject')
    def reject(self, request, pk=None):
        from apps.core.services.audit import AuditService
        expense = self.get_object()
        expense.status = 'rejected'
        expense.save()
        AuditService.log_action(request, 'ERP_EXPENSE_REJECTED', f'erp.Expense:{expense.pk}', {})
        return standard_response(True, 'Expense rejected', self.get_serializer(expense).data)

    @action(detail=True, methods=['post'], url_path='reimburse')
    def reimburse(self, request, pk=None):
        from apps.core.services.audit import AuditService
        expense = self.get_object()
        if expense.status != 'approved':
            return standard_response(False, 'Only approved expenses can be reimbursed', {}, status=status.HTTP_400_BAD_REQUEST)
        expense.status = 'reimbursed'
        expense.save()
        AuditService.log_action(request, 'ERP_EXPENSE_REIMBURSED', f'erp.Expense:{expense.pk}', {})
        return standard_response(True, 'Expense marked as reimbursed', self.get_serializer(expense).data)


# ─── DELIVERY NOTES ───────────────────────────────────────────────────────────

class DeliveryNoteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = DeliveryNoteSerializer

    def get_queryset(self):
        from apps.core.services.base import BaseService
        return BaseService.filter_by_context(
            DeliveryNote.objects.all(), self.request
        ).select_related('client', 'invoice')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        invoice = serializer.validated_data.get('invoice')
        if not invoice:
            return standard_response(False, "invoice field is required", {}, status=status.HTTP_400_BAD_REQUEST)
        dn = DeliveryNoteService.create_dn(request, invoice, serializer.validated_data)
        return standard_response(True, "Delivery note created", self.get_serializer(dn).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='update-status')
    def update_status(self, request, pk=None):
        dn = self.get_object()
        new_status = request.data.get('status')
        if not new_status:
            return standard_response(False, "status field required", {}, status=status.HTTP_400_BAD_REQUEST)
        try:
            dn = DeliveryNoteService.update_status(request, dn, new_status)
            return standard_response(True, f"Status updated to {new_status}", self.get_serializer(dn).data)
        except ValueError as e:
            return standard_response(False, str(e), {}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], url_path='download-pdf')
    def download_pdf(self, request, pk=None):
        from django.http import HttpResponse
        dn = self.get_object()
        pdf_bytes = DeliveryNoteService.generate_pdf(request, dn)
        response = HttpResponse(pdf_bytes, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="DeliveryNote_{dn.dn_number}.pdf"'
        return response


# ─── VENDOR ───────────────────────────────────────────────────────────────────

class VendorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = VendorSerializer

    def get_queryset(self):
        return VendorService.get_queryset(self.request)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vendor = VendorService.create_vendor(request, serializer.validated_data)
        return standard_response(True, "Vendor created", self.get_serializer(vendor).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        vendor = self.get_object()
        serializer = self.get_serializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        vendor = VendorService.update_vendor(request, vendor, serializer.validated_data)
        return standard_response(True, "Vendor updated", self.get_serializer(vendor).data)


# ─── PURCHASE ORDERS ──────────────────────────────────────────────────────────

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = PurchaseOrderSerializer

    def get_queryset(self):
        return PurchaseOrderService.get_queryset(self.request)

    def create(self, request, *args, **kwargs):
        items = request.data.pop('items', [])
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        po = PurchaseOrderService.create_po(request, serializer.validated_data, items)
        return standard_response(True, "Purchase order created", self.get_serializer(po).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='receive')
    def receive(self, request, pk=None):
        po = self.get_object()
        try:
            po = PurchaseOrderService.receive_po(request, po)
            return standard_response(True, "Purchase order received", self.get_serializer(po).data)
        except ValueError as e:
            return standard_response(False, str(e), {}, status=status.HTTP_400_BAD_REQUEST)


# ─── RECURRING INVOICES ───────────────────────────────────────────────────────

class RecurringInvoiceViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = RecurringInvoiceSerializer

    def get_queryset(self):
        return RecurringInvoiceService.get_queryset(self.request)

    @action(detail=True, methods=['post'], url_path='run-now')
    def run_now(self, request, pk=None):
        recurring = self.get_object()
        try:
            invoice = RecurringInvoiceService.run_now(request, recurring)
            return standard_response(True, "Invoice generated from schedule", InvoiceSerializer(invoice).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return standard_response(False, str(e), {}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='toggle')
    def toggle(self, request, pk=None):
        recurring = self.get_object()
        recurring.is_active = not recurring.is_active
        recurring.save()
        state = "activated" if recurring.is_active else "paused"
        return standard_response(True, f"Recurring schedule {state}", {})


# ─── CLIENT STATEMENT ─────────────────────────────────────────────────────────

class ClientStatementView(APIView):
    permission_classes = [IsAuthenticated, IsERPAccessible]

    def get(self, request, client_id):
        statement = InvoiceService.get_client_statement(request, client_id)
        return standard_response(True, "Client Statement", statement)


# ─── READ-ONLY VIEWS ──────────────────────────────────────────────────────────

class TaxConfigViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = TaxConfigSerializer

    def get_queryset(self):
        from apps.core.services.base import BaseService
        return BaseService.filter_by_context(TaxConfig.objects.all(), self.request)


class CostCenterViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = CostCenterSerializer

    def get_queryset(self):
        from apps.core.services.base import BaseService
        return BaseService.filter_by_context(CostCenter.objects.all(), self.request)


class BudgetLineViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = BudgetLineSerializer

    def get_queryset(self):
        from apps.core.services.base import BaseService
        return BaseService.filter_by_context(BudgetLine.objects.all(), self.request)


class GeneralLedgerViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = GeneralLedgerSerializer

    def get_queryset(self):
        from apps.core.services.base import BaseService
        return BaseService.filter_by_context(GeneralLedger.objects.all(), self.request)


class InternalProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = InternalProjectSerializer

    def get_queryset(self):
        return InternalProjectService.get_queryset(self.request)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        from apps.core.services.base import BaseService
        tenant = BaseService.get_tenant_context(request)
        from .models import InternalProject
        project = InternalProject(tenant=tenant, **serializer.validated_data)
        project.save()
        return standard_response(True, "Project created", self.get_serializer(project).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        project = self.get_object()
        serializer = self.get_serializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        project = InternalProjectService.update_project(request, project, serializer.validated_data)
        return standard_response(True, "Project updated", self.get_serializer(project).data)


class RiskViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = RiskSerializer

    def get_queryset(self):
        from apps.core.services.base import BaseService
        return BaseService.filter_by_context(Risk.objects.all(), self.request)


# ─── ERP DASHBOARD ────────────────────────────────────────────────────────────

class ErpDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsERPAccessible]

    def get(self, request):
        stats = EnterpriseService.get_dashboard_stats(request)
        return standard_response(True, "ERP Dashboard Data", stats)


class MonthlyFinancialsView(APIView):
    permission_classes = [IsAuthenticated, IsERPAccessible]

    def get(self, request):
        months = int(request.query_params.get('months', 6))
        data = EnterpriseService.get_monthly_revenue_expenses(request, months)
        return standard_response(True, "Monthly Financials", data)


# ─────────────────────────────────────────
# PHASE 3: FINANCIAL ACCOUNTING VIEWS
# ─────────────────────────────────────────

class AccountViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = AccountSerializer

    def get_queryset(self):
        from apps.core.services.base import BaseService
        return BaseService.filter_by_context(Account.objects.all(), self.request)


class JournalEntryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = JournalEntrySerializer

    def get_queryset(self):
        from apps.core.services.base import BaseService
        return BaseService.filter_by_context(JournalEntry.objects.all(), self.request).prefetch_related('lines__account')

    def create(self, request, *args, **kwargs):
        data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        lines = data.pop('lines', [])
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        entry = JournalEntryService.create_journal_entry(
            request, 
            serializer.validated_data['date'], 
            serializer.validated_data.get('reference', ''), 
            serializer.validated_data.get('description', ''), 
            lines
        )
        return standard_response(True, "Journal entry created", self.get_serializer(entry).data, status=status.HTTP_201_CREATED)


class BankAccountViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = BankAccountSerializer

    def get_queryset(self):
        from apps.core.services.base import BaseService
        return BaseService.filter_by_context(BankAccount.objects.all(), self.request)


class BankTransactionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = BankTransactionSerializer

    def get_queryset(self):
        from apps.core.services.base import BaseService
        return BaseService.filter_by_context(BankTransaction.objects.all(), self.request).select_related('bank_account')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        bank_account = serializer.validated_data['bank_account']
        bank_account_id = bank_account.id if hasattr(bank_account, 'id') else bank_account
        
        transaction = BankService.record_transaction(
            request,
            bank_account_id,
            serializer.validated_data['type'],
            serializer.validated_data['amount'],
            serializer.validated_data.get('description', ''),
            serializer.validated_data.get('reference', '')
        )
        return standard_response(True, "Bank transaction created", self.get_serializer(transaction).data, status=status.HTTP_201_CREATED)


class FixedAssetViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = FixedAssetSerializer

    def get_queryset(self):
        from apps.core.services.base import BaseService
        return BaseService.filter_by_context(FixedAsset.objects.all(), self.request)

    @action(detail=False, methods=['post'], url_path='run-depreciation')
    def run_depreciation(self, request):
        from .services import DepreciationService
        result = DepreciationService.run_monthly_depreciation(request)
        return standard_response(True, 'Depreciation run complete', result)


class CreditNoteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = CreditNoteSerializer

    def get_queryset(self):
        from apps.core.services.base import BaseService
        return BaseService.filter_by_context(CreditNote.objects.all(), self.request).select_related('client')


class BalanceSheetView(APIView):
    permission_classes = [IsAuthenticated, IsERPAccessible]

    def get(self, request):
        date_str = request.query_params.get('date')
        if not date_str:
            from django.utils import timezone
            date_str = timezone.now().date()
        report = FinancialReportingService.generate_balance_sheet(request, date_str)
        return standard_response(True, "Balance Sheet Data", report)


class CashFlowView(APIView):
    permission_classes = [IsAuthenticated, IsERPAccessible]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        if not start_date or not end_date:
            from django.utils import timezone
            end_date = timezone.now().date()
            start_date = end_date.replace(day=1)
        report = FinancialReportingService.generate_cash_flow(request, start_date, end_date)
        return standard_response(True, "Cash Flow Data", report)


class ProfitLossView(APIView):
    permission_classes = [IsAuthenticated, IsERPAccessible]

    def get(self, request):
        from django.utils import timezone
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        if not date_from or not date_to:
            today = timezone.now().date()
            date_from = today.replace(month=1, day=1)
            date_to = today
        report = InvoiceService.get_profit_loss(request, date_from, date_to)
        return standard_response(True, 'Profit & Loss Report', report)


class ClientPortalInvoiceView(APIView):
    """
    Publicly accessible view for clients to pay or view their invoice.
    Requires no authentication, only the secret token.
    """
    permission_classes = []
    
    def get(self, request, token):
        invoice = ClientPortalService.get_invoice_by_token(token)
        if not invoice:
            return standard_response(False, "Invoice not found or invalid token", {}, status=status.HTTP_404_NOT_FOUND)
        
        payload = ClientPortalService.build_portal_payload(invoice)
        return standard_response(True, "Invoice details", payload)


class PaymentTermsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = PaymentTermsSerializer
    def get_queryset(self):
        return PaymentTerms.objects.filter(tenant=self.request.user.tenant)

class InvoiceBrandingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = InvoiceBrandingSerializer
    def get_queryset(self):
        return InvoiceBranding.objects.filter(tenant=self.request.user.tenant)

class DeferredRevenueViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsERPAccessible]
    serializer_class = DeferredRevenueSerializer
    def get_queryset(self):
        return DeferredRevenue.objects.filter(tenant=self.request.user.tenant)
