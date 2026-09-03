"""
ERP Service Layer â€” Full Enterprise Edition
Charter Â§8, Â§11, Â§16, Â§18 Compliance
"""
from django.db import transaction
from django.db.models import Sum, Q
from django.utils import timezone
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from ..domain.models import (
    Invoice, Payment, Expense, TaxConfig, GeneralLedger,
    Account, JournalEntry, BankAccount, BankTransaction, FixedAsset,
    CreditNote, PaymentTerms, InvoiceBranding, DeferredRevenue,
    Currency, ExchangeRate, TaxAuthority, TaxGroup, BankReconciliation,
    DunningWorkflow, FiscalYear, FiscalPeriod, AccountingJournal,
)
import datetime
import logging

logger = logging.getLogger(__name__)



# â”€â”€â”€ UTILITIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class GeneralLedgerService(BaseService):
    @classmethod
    @transaction.atomic
    def record_entry(cls, request, account_name, amount, entry_type, ref_id, ref_type, description=""):
        tenant = cls.get_tenant_context(request)
        return GeneralLedger.objects.create(
            tenant=tenant, account_name=account_name, amount=amount,
            entry_type=entry_type, reference_id=ref_id,
            reference_type=ref_type, description=description
        )


# â”€â”€â”€ INVOICING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class InvoiceService(BaseService):

    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(
            Invoice.objects.all(), request
        ).prefetch_related('items', 'payments').select_related('client')

    @classmethod
    def auto_number(cls, request, doc_type='standard'):
        """Generate next sequential invoice number per tenant and type."""
        from apps.core.domain.models import Tenant
        with transaction.atomic():
            tenant = cls.get_tenant_context(request)
            request.tenant = Tenant.objects.select_for_update().get(id=tenant.id)
            prefixes = {'standard': 'INV', 'proforma': 'PRO', 'credit_note': 'CN'}
            prefix = prefixes.get(doc_type, 'INV')
            year = timezone.now().year
            existing = Invoice.objects.filter(
                tenant=request.tenant,
                invoice_number__startswith=f"{prefix}-{year}-"
            ).count()
            seq = str(existing + 1).zfill(4)
            return f"{prefix}-{year}-{seq}"

    @classmethod
    @transaction.atomic
    def create_invoice(cls, request, data: dict, items: list = None) -> Invoice:
        tenant = cls.get_tenant_context(request)
        subtotal = tax_total = discount_total = 0

        # Auto-generate number if not supplied
        if not data.get('invoice_number'):
            data['invoice_number'] = cls.auto_number(request, data.get('type', 'standard'))

        invoice = Invoice(tenant=tenant, **data)
        invoice.save()

        if items:
            for item_data in items:
                qty = float(item_data.get('quantity', 1))
                price = float(item_data.get('unit_price', 0))
                tax_rate = float(item_data.get('tax_rate', 0))
                discount = float(item_data.get('discount', 0))
                line_sub = qty * price
                line_tax = line_sub * (tax_rate / 100)
                line_total = line_sub + line_tax - discount
                InvoiceItem.objects.create(
                    tenant=tenant, invoice=invoice,
                    description=item_data.get('description', ''),
                    quantity=qty, unit_price=price,
                    tax_rate=tax_rate, discount=discount,
                    total=line_total
                )
                subtotal += line_sub
                tax_total += line_tax
                discount_total += discount

        invoice.subtotal = subtotal
        invoice.tax_total = tax_total
        invoice.discount_total = discount_total
        invoice.total_amount = subtotal + tax_total - discount_total
        invoice.save()

        # Only create ledger entries for real invoices (not proforma)
        if invoice.type != 'proforma':
            GeneralLedgerService.record_entry(
                request, "Accounts Receivable", invoice.total_amount, 'debit',
                invoice.pk, 'invoice', f"Invoice {invoice.invoice_number} issued"
            )
            GeneralLedgerService.record_entry(
                request, "Revenue", invoice.subtotal, 'credit',
                invoice.pk, 'invoice', f"Revenue from {invoice.invoice_number}"
            )
            if invoice.tax_total > 0:
                GeneralLedgerService.record_entry(
                    request, "Tax Payable", invoice.tax_total, 'credit',
                    invoice.pk, 'invoice', f"Tax on {invoice.invoice_number}"
                )

        AuditService.log_action(request, "ERP_INVOICE_CREATED", f"erp.Invoice:{invoice.pk}",
                                {"invoice_number": invoice.invoice_number, "total": float(invoice.total_amount)})
        return invoice

    @classmethod
    @transaction.atomic
    def update_invoice(cls, request, invoice: Invoice, data: dict) -> Invoice:
        cls.validate_ownership(invoice, request)
        for field, value in data.items():
            setattr(invoice, field, value)
        invoice.full_clean()
        invoice.save()
        AuditService.log_action(request, "ERP_INVOICE_UPDATED", f"erp.Invoice:{invoice.pk}", {"changes": data})
        return invoice

    @classmethod
    @transaction.atomic
    def void_invoice(cls, request, invoice: Invoice) -> Invoice:
        """Void invoice and reverse ledger entries."""
        cls.validate_ownership(invoice, request)
        invoice.status = 'void'
        invoice.save()
        # Reverse the ledger entries
        if invoice.type != 'proforma':
            GeneralLedgerService.record_entry(
                request, "Accounts Receivable", invoice.total_amount, 'credit',
                invoice.pk, 'invoice', f"VOID: {invoice.invoice_number}"
            )
            GeneralLedgerService.record_entry(
                request, "Revenue", invoice.subtotal, 'debit',
                invoice.pk, 'invoice', f"VOID Revenue: {invoice.invoice_number}"
            )
        AuditService.log_action(request, "ERP_INVOICE_VOIDED", f"erp.Invoice:{invoice.pk}", {})
        return invoice

    @classmethod
    @transaction.atomic
    def duplicate_invoice(cls, request, invoice: Invoice) -> Invoice:
        """Clone an invoice as a new draft with a fresh number."""
        tenant = cls.get_tenant_context(request)
        new_number = cls.auto_number(request, invoice.type)
        new_invoice = Invoice.objects.create(
            tenant=tenant, client=invoice.client, type=invoice.type,
            invoice_number=new_number, status='draft',
            issue_date=timezone.now().date(),
            due_date=timezone.now().date() + datetime.timedelta(days=30),
            notes=invoice.notes, reference=invoice.reference,
        )
        for item in invoice.items.all():
            InvoiceItem.objects.create(
                tenant=tenant, invoice=new_invoice,
                description=item.description, quantity=item.quantity,
                unit_price=item.unit_price, tax_rate=item.tax_rate,
                discount=item.discount, total=item.total,
            )
        # Recompute totals
        new_invoice.subtotal = invoice.subtotal
        new_invoice.tax_total = invoice.tax_total
        new_invoice.discount_total = invoice.discount_total
        new_invoice.total_amount = invoice.total_amount
        new_invoice.save()
        AuditService.log_action(request, "ERP_INVOICE_DUPLICATED", f"erp.Invoice:{new_invoice.pk}",
                                {"source": str(invoice.pk)})
        return new_invoice

    @classmethod
    def get_aging_report(cls, request):
        """Return AR aging bucketed by overdue days."""
        qs = cls.get_queryset(request).exclude(status__in=['paid', 'void', 'cancelled', 'draft'])
        buckets = {'current': [], '1-30': [], '31-60': [], '61-90': [], '90+': []}
        for inv in qs:
            buckets[inv.aging_bucket].append({
                'id': str(inv.id), 'invoice_number': inv.invoice_number,
                'client_name': inv.client.name if inv.client else '',
                'total_amount': float(inv.total_amount),
                'balance_due': float(inv.total_amount - sum(p.amount for p in inv.payments.all())),
                'due_date': inv.due_date.isoformat(), 'days_overdue': inv.days_overdue,
            })
        summary = {k: {'count': len(v), 'total': sum(i['balance_due'] for i in v), 'items': v}
                   for k, v in buckets.items()}
        return summary

    @classmethod
    def get_client_statement(cls, request, client_id):
        """All financial activity for a single client."""
        tenant = cls.get_tenant_context(request)
        invoices = Invoice.objects.filter(tenant=tenant, client_id=client_id).prefetch_related('payments')
        result = []
        running_balance = 0
        for inv in invoices.order_by('issue_date'):
            running_balance += float(inv.total_amount)
            result.append({
                'date': inv.issue_date.isoformat(), 'type': 'invoice',
                'reference': inv.invoice_number, 'debit': float(inv.total_amount),
                'credit': 0, 'balance': running_balance,
            })
            for p in inv.payments.all():
                running_balance -= float(p.amount)
                result.append({
                    'date': p.payment_date.isoformat(), 'type': 'payment',
                    'reference': p.reference or p.payment_method,
                    'debit': 0, 'credit': float(p.amount), 'balance': running_balance,
                })
        return {'entries': result, 'closing_balance': running_balance}

    @classmethod
    def get_profit_loss(cls, request, date_from, date_to):
        """Compute P&L for a date range."""
        tenant = cls.get_tenant_context(request)
        from .domain.models import Expense
        revenue = Payment.objects.filter(
            invoice__tenant=tenant, payment_date__range=[date_from, date_to]
        ).aggregate(total=Sum('amount'))['total'] or 0
        expenses = Expense.objects.filter(
            tenant=tenant, incurred_date__range=[date_from, date_to]
        ).aggregate(total=Sum('amount'))['total'] or 0

        from .domain.models import Expense as E
        exp_by_cat = {}
        for exp in E.objects.filter(tenant=tenant, incurred_date__range=[date_from, date_to]):
            exp_by_cat.setdefault(exp.category, 0)
            exp_by_cat[exp.category] += float(exp.amount)

        return {
            'date_from': str(date_from), 'date_to': str(date_to),
            'revenue': float(revenue), 'expenses': float(expenses),
            'net_profit': float(revenue) - float(expenses),
            'profit_margin': round((float(revenue) - float(expenses)) / float(revenue) * 100, 2) if revenue else 0,
            'expense_breakdown': exp_by_cat,
        }

    @classmethod
    @transaction.atomic
    def create_from_quote(cls, request, quote_id: str) -> Invoice:
        from apps.sale.domain.models import SaleOrder
        tenant = cls.get_tenant_context(request)
        quote = Quote.objects.select_related('client', 'deal').get(id=quote_id)
        if quote.status != 'accepted':
            raise ValueError("Invoice can only be generated from an accepted quote.")
        invoice = Invoice.objects.create(
            tenant=tenant, client=quote.client,
            invoice_number=cls.auto_number(request, 'standard'),
            subtotal=quote.total, total_amount=quote.total,
            issue_date=timezone.now().date(),
            due_date=timezone.now().date() + datetime.timedelta(days=30),
            status='sent'
        )
        AuditService.log_action(request, "ERP_INVOICE_FROM_QUOTE", f"erp.Invoice:{invoice.pk}",
                                {"quote_id": quote_id})
        return invoice

    @classmethod
    def generate_pdf(cls, request, invoice: Invoice) -> bytes:
        pdf_bytes = PdfService.generate_pdf_bytes(invoice)
        AuditService.log_action(request, "ERP_INVOICE_PDF_GENERATED", f"erp.Invoice:{invoice.pk}",
                                {"invoice_number": invoice.invoice_number})
        return pdf_bytes

    @classmethod
    def send_to_client(cls, request, invoice: Invoice):
        if not invoice.client or not invoice.client.email:
            raise ValueError("Client email missing.")
        invoice.status = 'sent'
        invoice.save()
        AuditService.log_action(request, "ERP_INVOICE_SENT", f"erp.Invoice:{invoice.pk}",
                                {"to": invoice.client.email})


# â”€â”€â”€ PAYMENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class PaymentService(BaseService):
    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(
            Payment.objects.all(), request
        ).select_related('invoice', 'invoice__client')

    @classmethod
    @transaction.atomic
    def record_payment(cls, request, invoice: Invoice, data: dict) -> Payment:
        payment_fields = {
            'amount': data['amount'],
            'payment_date': data.get('payment_date'),
            'payment_method': data.get('payment_method', 'bank_transfer'),
            'reference': data.get('reference', ''),
        }
        payment = Payment(invoice=invoice, **payment_fields)
        payment.save()
        total_paid = invoice.payments.aggregate(total=Sum('amount'))['total'] or 0
        if total_paid >= invoice.total_amount:
            invoice.status = 'paid'
            invoice.paid_at = timezone.now()
        elif total_paid > 0:
            invoice.status = 'partially_paid'
        invoice.save()
        GeneralLedgerService.record_entry(
            request, "Cash", payment.amount, 'debit',
            payment.pk, 'payment', f"Payment for {invoice.invoice_number}"
        )
        GeneralLedgerService.record_entry(
            request, "Accounts Receivable", payment.amount, 'credit',
            payment.pk, 'payment', f"Credit AR for {invoice.invoice_number}"
        )
        AuditService.log_action(request, "ERP_PAYMENT_RECORDED", f"erp.Payment:{payment.pk}",
                                {"invoice": invoice.invoice_number, "amount": float(payment.amount)})
        return payment

    @classmethod
    @transaction.atomic
    def void_payment(cls, request, payment: Payment) -> Payment:
        """Reverse payment and update invoice status."""
        invoice = payment.invoice
        GeneralLedgerService.record_entry(
            request, "Cash", payment.amount, 'credit',
            payment.pk, 'payment', f"VOID payment for {invoice.invoice_number}"
        )
        GeneralLedgerService.record_entry(
            request, "Accounts Receivable", payment.amount, 'debit',
            payment.pk, 'payment', f"VOID AR credit for {invoice.invoice_number}"
        )
        payment.delete()
        remaining = invoice.payments.aggregate(total=Sum('amount'))['total'] or 0
        if remaining <= 0:
            invoice.status = 'sent'
            invoice.paid_at = None
        elif remaining < invoice.total_amount:
            invoice.status = 'partially_paid'
        invoice.save()
        AuditService.log_action(request, "ERP_PAYMENT_VOIDED", f"erp.Invoice:{invoice.pk}", {})
        return invoice


# â”€â”€â”€ EXPENSES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class ExpenseService(BaseService):
    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(Expense.objects.all(), request)

    @classmethod
    @transaction.atomic
    def create_expense(cls, request, data: dict):
        from .domain.models import Expense
        tenant = cls.get_tenant_context(request)
        expense = Expense(tenant=tenant, **data)
        expense.full_clean()
        expense.save()
        GeneralLedgerService.record_entry(
            request, f"Expense: {expense.category.capitalize()}", expense.amount, 'debit',
            expense.pk, 'expense', f"Expense: {expense.title}"
        )
        GeneralLedgerService.record_entry(
            request, "Cash", expense.amount, 'credit',
            expense.pk, 'expense', f"Payment for: {expense.title}"
        )
        AuditService.log_action(request, "ERP_EXPENSE_CREATED", f"erp.Expense:{expense.pk}",
                                {"title": expense.title, "amount": float(expense.amount)})
        return expense

# â”€â”€â”€ PHASE 3: ENTERPRISE FINANCIAL ACCOUNTING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class JournalEntryService(BaseService):
    @classmethod
    @transaction.atomic
    def create_journal_entry(cls, request, date, reference, description, lines_data):
        """
        lines_data should be a list of dicts: [{'account_code': '1000', 'debit': 100, 'credit': 0}, ...]
        """
        tenant = cls.get_tenant_context(request)
        total_debit = sum(float(l.get('debit', 0)) for l in lines_data)
        total_credit = sum(float(l.get('credit', 0)) for l in lines_data)
        
        if round(total_debit, 2) != round(total_credit, 2):
            raise ValueError("Journal Entry must balance. Debits do not equal Credits.")

        entry = JournalEntry.objects.create(
            tenant=tenant, date=date, reference=reference, description=description, is_posted=True
        )

        for line in lines_data:
            account = Account.objects.get(tenant=tenant, code=line['account_code'])
            JournalEntryLine.objects.create(
                tenant=tenant,
                journal_entry=entry,
                account=account,
                debit=line.get('debit', 0),
                credit=line.get('credit', 0),
                description=line.get('description', '')
            )
            
        AuditService.log_action(request, "ERP_JOURNAL_ENTRY_POSTED",
                                f"erp.JournalEntry:{entry.pk}", {"total_amount": total_debit})
        return entry


class BankService(BaseService):
    @classmethod
    @transaction.atomic
    def record_transaction(cls, request, bank_account_id, trans_type, amount, description, reference=""):
        tenant = cls.get_tenant_context(request)
        bank_account = BankAccount.objects.get(tenant=tenant, id=bank_account_id)
        
        trans = BankTransaction.objects.create(
            tenant=tenant, bank_account=bank_account, type=trans_type,
            amount=amount, description=description, reference=reference
        )
        
        if trans_type == 'deposit':
            bank_account.current_balance += amount
        else:
            bank_account.current_balance -= amount
        bank_account.save()
        
        # If the bank is linked to a CoA account, we could auto-generate a Journal Entry here
        # For full ERP, we'd map 'deposit' to Debit Cash Account, Credit Undeposited Funds/Revenue
        
        AuditService.log_action(request, "ERP_BANK_TRANSACTION_RECORDED",
                                f"erp.BankTransaction:{trans.pk}", {"amount": str(amount)})
        return trans


class FinancialReportingService(BaseService):
    @classmethod
    def generate_balance_sheet(cls, request, as_of_date):
        tenant = cls.get_tenant_context(request)
        # In a real system, we aggregate JournalEntryLines up to as_of_date
        # For now, we group accounts by type
        accounts = Account.objects.filter(tenant=tenant, is_active=True)
        
        # Calculate balances (Debits - Credits for Assets/Expenses, Credits - Debits for Liab/Equity/Rev)
        def get_balance(acct):
            lines = acct.journal_lines.filter(journal_entry__date__lte=as_of_date, journal_entry__is_posted=True)
            debits = lines.aggregate(Sum('debit'))['debit__sum'] or 0
            credits = lines.aggregate(Sum('credit'))['credit__sum'] or 0
            if acct.account_type in ['asset', 'expense']:
                return debits - credits
            return credits - debits

        report = {
            'maintenance': [], 'liabilities': [], 'equity': [],
            'total_assets': 0, 'total_liabilities': 0, 'total_equity': 0
        }

        for acct in accounts:
            bal = get_balance(acct)
            if bal == 0: continue
            
            entry = {'code': acct.code, 'name': acct.name, 'balance': float(bal)}
            if acct.account_type == 'asset':
                report['maintenance'].append(entry)
                report['total_assets'] += float(bal)
            elif acct.account_type == 'liability':
                report['liabilities'].append(entry)
                report['total_liabilities'] += float(bal)
            elif acct.account_type == 'equity':
                report['equity'].append(entry)
                report['total_equity'] += float(bal)
                
        # Calculate Retained Earnings from Revenue/Expenses
        rev_accounts = accounts.filter(account_type='revenue')
        exp_accounts = accounts.filter(account_type='expense')
        total_rev = sum(get_balance(a) for a in rev_accounts)
        total_exp = sum(get_balance(a) for a in exp_accounts)
        net_income = float(total_rev - total_exp)
        
        report['equity'].append({'code': '3999', 'name': 'Current Year Net Income', 'balance': net_income})
        report['total_equity'] += net_income
        
        return report

    @classmethod
    def generate_cash_flow(cls, request, start_date, end_date):
        tenant = cls.get_tenant_context(request)
        # Simulated cash flow using BankTransaction (Direct Method)
        transactions = BankTransaction.objects.filter(
            tenant=tenant, date__range=(start_date, end_date)
        )
        
        inflows = float(transactions.filter(type='deposit').aggregate(Sum('amount'))['amount__sum'] or 0)
        outflows = float(transactions.filter(type='withdrawal').aggregate(Sum('amount'))['amount__sum'] or 0)
        
        return {
            'operating_inflows': inflows,
            'operating_outflows': outflows,
            'net_cash_flow': inflows - outflows,
            'starting_balance': 0,
            'ending_balance': inflows - outflows
        }


# â”€â”€â”€ DEPRECIATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class DepreciationService(BaseService):
    @classmethod
    @transaction.atomic
    def run_monthly_depreciation(cls, request):
        """
        Runs straight-line monthly depreciation for all active FixedAssets.
        Should be called monthly via management command or Celery Beat.
        """
        tenant = cls.get_tenant_context(request)
        assets = FixedAsset.objects.filter(tenant=tenant)
        processed = 0
        for asset in assets:
            if asset.net_book_value <= asset.salvage_value:
                continue  # Fully depreciated
            annual_depreciation = (asset.purchase_price - asset.salvage_value) / asset.useful_life_years
            monthly_depreciation = round(annual_depreciation / 12, 2)
            asset.accumulated_depreciation += monthly_depreciation
            asset.save()
            processed += 1
            AuditService.log_action(
                request, 'ERP_DEPRECIATION_RUN',
                f'erp.FixedAsset:{asset.pk}',
                {'monthly_amount': str(monthly_depreciation)}
            )
        return {'assets_processed': processed}


# â”€â”€â”€ PDF GENERATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class PdfService(BaseService):
    """
    Generates professional invoice PDFs using Django DB templates via ReportingService.
    Falls back to a plain-text representation if WeasyPrint is not installed or no template exists.
    """

    @classmethod
    def generate_pdf_bytes(cls, invoice: Invoice) -> bytes:
        from apps.reporting.domain.models import ReportTemplate
        from apps.reporting.services.pdf_generator import ReportingService
        
        template = ReportTemplate.objects.filter(
            model='accounting.Invoice',
            is_default=True,
            is_active=True,
            tenant=invoice.tenant
        ).first()

        if template:
            attachment = ReportingService.generate_pdf(template, invoice)
            if attachment and attachment.file:
                invoice.pdf_generated_at = timezone.now()
                invoice.save(update_fields=['pdf_generated_at'])
                with attachment.file.open('rb') as f:
                    return f.read()

        logger.warning(f"Using fallback plain-text PDF for invoice {invoice.invoice_number}")
        html_content = f"<html><body><h1>Invoice {invoice.invoice_number}</h1></body></html>"
        try:
            from weasyprint import HTML
            return HTML(string=html_content).write_pdf()
        except ImportError:
            return html_content.encode('utf-8')


# â”€â”€â”€ INVOICE EMAIL DELIVERY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class InvoiceEmailService(BaseService):
    """
    Sends branded HTML email with PDF invoice attachment.
    Mirrors Zoho Invoice's email delivery workflow.
    """

    @classmethod
    def send_invoice(cls, invoice: Invoice, recipient_email: str = None, cc: list = None) -> bool:
        """
        Send the invoice PDF to the client's primary contact.
        Falls back gracefully if email is not configured.
        """
        from django.core.mail import EmailMessage
        from django.template.loader import render_to_string

        # Resolve recipient
        if not recipient_email:
            contact = getattr(invoice.client, 'contacts', None)
            if contact:
                primary = contact.filter(is_primary=True).first() or contact.first()
                recipient_email = primary.email if primary else invoice.client.email
            else:
                recipient_email = getattr(invoice.client, 'email', None)

        if not recipient_email:
            raise ValueError("No email address found for client. Cannot send invoice.")

        branding = InvoiceBranding.objects.filter(tenant=invoice.tenant).first()
        company_name = branding.company_name if branding else 'Your Vendor'

        subject = f"Invoice {invoice.invoice_number} from {company_name}"
        body_html = render_to_string('erp/invoice_email.html', {
            'invoice': invoice,
            'branding': branding,
            'company_name': company_name,
        })

        try:
            pdf_bytes = PdfService.generate_pdf_bytes(invoice)
            email = EmailMessage(
                subject=subject,
                body=body_html,
                from_email=None,  # Uses DEFAULT_FROM_EMAIL
                to=[recipient_email],
                cc=cc or [],
            )
            email.content_subtype = 'html'
            email.attach(
                f"{invoice.invoice_number}.pdf",
                pdf_bytes,
                'application/pdf'
            )
            email.send(fail_silently=False)
            # Mark invoice as sent
            if invoice.status == 'draft':
                invoice.status = 'sent'
                invoice.save(update_fields=['status'])
            return True
        except Exception as e:
            logger.error(f"Failed to send invoice {invoice.invoice_number} email: {e}")
            raise


# â”€â”€â”€ TAX RULES ENGINE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class TaxRulesService(BaseService):
    """
    Automatically determines the correct tax rate for an invoice line item
    based on the product catalog item and tenant default tax configuration.
    Modelled after Odoo's fiscal position / tax mapping engine.
    """

    @classmethod
    def get_rate_for_item(cls, tenant, catalog_item=None) -> float:
        """
        Returns the tax rate (as a float percentage) for a given catalog item.
        Priority: catalog item tax_config > tenant default TaxConfig > 0
        """
        from apps.accounting.domain.models import TaxConfig
        if catalog_item and catalog_item.tax_config_id:
            return float(catalog_item.tax_config.rate)
        # Fall back to tenant's first active tax config
        default_tax = TaxConfig.objects.filter(tenant=tenant, is_active=True).first()
        return float(default_tax.rate) if default_tax else 0.0

    @classmethod
    def apply_taxes_to_invoice(cls, invoice: Invoice):
        """
        Recalculates tax on all line items of an invoice using the rules engine.
        Saves updated totals back to the invoice.
        """
        subtotal = tax_total = discount_total = 0
        for item in invoice.items.select_related('product').all():
            qty = float(item.quantity)
            price = float(item.unit_price)
            discount = float(item.discount)
            line_sub = qty * price
            line_tax = line_sub * (float(item.tax_rate) / 100)
            line_total = line_sub + line_tax - discount
            item.total = line_total
            item.save(update_fields=['total'])
            subtotal += line_sub
            tax_total += line_tax
            discount_total += discount

        # Apply invoice-level discount on top
        invoice_discount = subtotal * (float(invoice.discount_percent) / 100)
        invoice.subtotal = subtotal
        invoice.tax_total = tax_total
        invoice.discount_total = discount_total + invoice_discount
        invoice.total_amount = subtotal + tax_total - discount_total - invoice_discount
        invoice.save(update_fields=['subtotal', 'tax_total', 'discount_total', 'total_amount'])
        return invoice


# â”€â”€â”€ CLIENT PORTAL SERVICE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class ClientPortalService:
    """
    Validates a payment link token and returns safe, read-only invoice data
    for client-facing self-service portal. No authentication required.
    Modelled after Zoho Invoice's client portal.
    """

    @classmethod
    def get_invoice_by_token(cls, token: str):
        """Returns the invoice matching the payment_link_token, or None."""
        try:
            return Invoice.objects.select_related(
                'client', 'tenant', 'payment_terms'
            ).prefetch_related('items', 'payments').get(
                payment_link_token=token
            )
        except (Invoice.DoesNotExist, Exception):
            return None

    @classmethod
    def build_portal_payload(cls, invoice: Invoice) -> dict:
        """Returns a safe, minimal payload for the client portal â€” no internal data."""
        payments = invoice.payments.all()
        total_paid = sum(p.amount for p in payments)
        branding = InvoiceBranding.objects.filter(tenant=invoice.tenant).first()
        return {
            'invoice_number': invoice.invoice_number,
            'status': invoice.status,
            'issue_date': str(invoice.issue_date),
            'due_date': str(invoice.due_date),
            'currency': invoice.currency,
            'subtotal': float(invoice.subtotal),
            'tax_total': float(invoice.tax_total),
            'discount_total': float(invoice.discount_total),
            'total_amount': float(invoice.total_amount),
            'total_paid': float(total_paid),
            'balance_due': float(invoice.total_amount - total_paid),
            'items': [
                {
                    'description': item.description,
                    'quantity': float(item.quantity),
                    'unit_price': float(item.unit_price),
                    'tax_rate': float(item.tax_rate),
                    'total': float(item.total),
                }
                for item in invoice.items.all()
            ],
            'company': {
                'name': branding.company_name if branding else '',
                'address': branding.company_address if branding else '',
                'email': branding.company_email if branding else '',
                'logo_url': branding.logo_url if branding else '',
            },
            'notes': invoice.notes,
        }


# â”€â”€â”€ AR AGING REPORT SERVICE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class AgingReportService(BaseService):
    """
    Computes full Accounts Receivable (AR) aging report.
    Matches Odoo's Partner Ledger / Aging Report & Zoho Invoice's aging report.
    Buckets: Current, 1â€“30, 31â€“60, 61â€“90, 90+
    """

    BUCKETS = [
        ('current', 0, 0),
        ('1_30', 1, 30),
        ('31_60', 31, 60),
        ('61_90', 61, 90),
        ('over_90', 91, None),
    ]

    @classmethod
    def get_report(cls, request) -> dict:
        """Returns per-client AR aging breakdown and totals."""
        tenant = cls.get_tenant_context(request)
        today = datetime.date.today()

        open_invoices = Invoice.objects.filter(
            tenant=tenant,
            status__in=['sent', 'partially_paid', 'overdue']
        ).select_related('client').prefetch_related('payments')

        client_map = {}  # client_id -> {client_name, buckets}
        totals = {b[0]: 0 for b in cls.BUCKETS}

        for inv in open_invoices:
            paid = sum(p.amount for p in inv.payments.all())
            balance = float(inv.total_amount - paid)
            if balance <= 0:
                continue

            days_overdue = (today - inv.due_date).days

            bucket = 'over_90'
            for name, low, high in cls.BUCKETS:
                if low == 0 and high == 0:
                    bucket = 'current' if days_overdue <= 0 else bucket
                elif high is None:
                    if days_overdue >= low:
                        bucket = name
                elif low <= days_overdue <= high:
                    bucket = name
                    break

            cid = str(inv.client_id)
            if cid not in client_map:
                client_map[cid] = {
                    'client_id': cid,
                    'client_name': inv.client.name,
                    'current': 0, '1_30': 0, '31_60': 0, '61_90': 0, 'over_90': 0,
                    'total': 0,
                }
            client_map[cid][bucket] += balance
            client_map[cid]['total'] += balance
            totals[bucket] += balance

        grand_total = sum(totals.values())
        return {
            'as_of_date': str(today),
            'clients': list(client_map.values()),
            'totals': {**totals, 'grand_total': grand_total},
        }

    @classmethod
    def export_csv(cls, request) -> str:
        """Returns the aging report as CSV string."""
        import csv
        import io
        report = cls.get_report(request)
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['Client', 'Current', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days', 'Total'])
        for row in report['clients']:
            writer.writerow([
                row['client_name'],
                row['current'], row['1_30'], row['31_60'],
                row['61_90'], row['over_90'], row['total'],
            ])
        t = report['totals']
        writer.writerow(['TOTAL', t['current'], t['1_30'], t['31_60'], t['61_90'], t['over_90'], t['grand_total']])
        return output.getvalue()


# â”€â”€â”€ CURRENCY SERVICE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class CurrencyService:
    """
    Handles multi-currency invoice support.
    Converts invoice amounts to the tenant's base reporting currency.
    Modelled after Odoo's multi-currency / exchange rate module.
    """
    SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'DZD', 'MAD', 'AED', 'SAR', 'CAD', 'AUD']

    @classmethod
    def convert_to_base(cls, amount: float, from_currency: str, exchange_rate: float) -> float:
        """
        Converts an amount from a foreign currency to base currency.
        exchange_rate = how many base units = 1 foreign unit.
        e.g. if base is USD and invoice is in EUR at rate 1.08, then 100 EUR = 108 USD.
        """
        if from_currency == 'USD' or exchange_rate == 1:
            return amount
        return round(amount * exchange_rate, 2)

    @classmethod
    def get_invoice_base_total(cls, invoice: Invoice) -> float:
        """Returns the invoice total in the tenant's base/reporting currency."""
        return cls.convert_to_base(
            float(invoice.total_amount),
            invoice.currency,
            float(invoice.exchange_rate)
        )

    @classmethod
    def format_currency(cls, amount: float, currency: str) -> str:
        """Returns a formatted currency string."""
        symbols = {'USD': '$', 'EUR': '\u20ac', 'GBP': '\u00a3', 'DZD': 'DA ', 'MAD': 'MAD ', 'AED': 'AED '}
        symbol = symbols.get(currency, f"{currency} ")
        return f"{symbol}{amount:,.2f}"


# â”€â”€â”€ DEFERRED REVENUE SERVICE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

class DeferredRevenueService(BaseService):
    """
    Manages the monthly recognition of deferred (prepaid) revenue.
    Modelled after Odoo's revenue recognition / deferred revenue module.
    """

    @classmethod
    @transaction.atomic
    def create_deferred_schedule(
        cls, invoice: Invoice, recognition_start, recognition_end,
        deferred_account=None, revenue_account=None
    ) -> DeferredRevenue:
        """Creates a deferred revenue schedule for a prepaid invoice."""
        return DeferredRevenue.objects.create(
            tenant=invoice.tenant,
            invoice=invoice,
            total_amount=invoice.total_amount,
            recognized_amount=0,
            recognition_start=recognition_start,
            recognition_end=recognition_end,
            deferred_account=deferred_account,
            revenue_account=revenue_account,
            status='active',
        )

    @classmethod
    @transaction.atomic
    def run_monthly_recognition(cls, request) -> dict:
        """
        Processes all active deferred revenue records and creates
        monthly journal entries moving amounts to recognized revenue.
        """
        from django.utils import timezone
        tenant = cls.get_tenant_context(request)
        today = timezone.now().date()
        records = DeferredRevenue.objects.filter(
            tenant=tenant, status='active',
            recognition_start__lte=today
        ).select_related('invoice', 'deferred_account', 'revenue_account')

        processed = 0
        for rec in records:
            if rec.remaining_amount <= 0:
                rec.status = 'completed'
                rec.save(update_fields=['status'])
                continue

            # Calculate months in schedule
            delta_months = (
                (rec.recognition_end.year - rec.recognition_start.year) * 12 +
                rec.recognition_end.month - rec.recognition_start.month
            ) or 1
            monthly_amount = round(float(rec.total_amount) / delta_months, 2)
            recognize = min(monthly_amount, float(rec.remaining_amount))

            # Create journal entry if accounts are configured
            if rec.deferred_account and rec.revenue_account:
                entry = JournalEntry.objects.create(
                    tenant=tenant,
                    date=today,
                    reference=f"Deferred Rev Recognition â€” {rec.invoice.invoice_number}",
                    is_posted=True
                )
                JournalEntryLine.objects.create(
                    tenant=tenant, journal_entry=entry,
                    account=rec.deferred_account,
                    debit=recognize, credit=0,
                    description='Deferred revenue recognized'
                )
                JournalEntryLine.objects.create(
                    tenant=tenant, journal_entry=entry,
                    account=rec.revenue_account,
                    debit=0, credit=recognize,
                    description='Revenue recognized from deferred'
                )

            rec.recognized_amount += recognize
            if rec.recognized_amount >= rec.total_amount:
                rec.status = 'completed'
            rec.save(update_fields=['recognized_amount', 'status'])
            processed += 1

        return {'records_processed': processed}


"""
Accounting Services Layer.
"""

from ..domain.models import VendorBill
from django.db import transaction
from django.utils import timezone

class VendorBillService:
    @staticmethod
    @transaction.atomic
    def approve_bill(vendor_bill: VendorBill):
        if vendor_bill.status != 'draft':
            raise ValueError("Only draft bills can be approved.")
        vendor_bill.status = 'approved'
        vendor_bill.save()
        
        # Odoo-style matching: Link to General Ledger
        # Credit Accounts Payable
        # Debit Expenses / Inventory
        from apps.accounting.application.services import GeneralLedgerService
        # Simple placeholder request object for now
        class DummyRequest:
            user = None
            def __init__(self, tenant):
                self.tenant = tenant
        
        req = DummyRequest(vendor_bill.tenant)
        GeneralLedgerService.record_entry(
            req, "Expenses", vendor_bill.total_amount, 'debit',
            vendor_bill.pk, 'vendor_bill', f"Bill {vendor_bill.bill_number}"
        )
        GeneralLedgerService.record_entry(
            req, "Accounts Payable", vendor_bill.total_amount, 'credit',
            vendor_bill.pk, 'vendor_bill', f"Bill {vendor_bill.bill_number}"
        )

        return vendor_bill

class DashboardService(BaseService):
    @classmethod
    def get_dashboard_stats(cls, request):
        from ..domain.models import Invoice, Expense
        from django.db.models import Sum
        tenant = cls.get_tenant_context(request)
        total_invoices = Invoice.objects.filter(tenant=tenant).select_related('client', 'sale_order', 'tenant').prefetch_related('items').count()
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

        return {
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

    @classmethod
    def get_monthly_financials(cls, request):
        from ..domain.models import Invoice, Expense
        from django.db.models import Sum
        from django.db.models.functions import TruncMonth
        tenant = cls.get_tenant_context(request)

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

        return sorted_data

    @classmethod
    def get_finance_report(cls, request):
        from ..domain.models import Invoice, Expense
        from django.db.models import Sum, Count, Q
        tenant = cls.get_tenant_context(request)
        invoices = Invoice.objects.all()
        expenses = Expense.objects.all()
        if tenant:
            invoices = invoices.filter(tenant=tenant)
            expenses = expenses.filter(tenant=tenant)
        stats = invoices.aggregate(
            total_invoiced=Sum('amount'),
            total_paid=Sum('amount', filter=Q(status='paid')),
            outstanding=Sum('amount', filter=Q(status__in=['sent','overdue'])),
            invoice_count=Count('id')
        )
        exp_total = float(expenses.aggregate(t=Sum('amount'))['t'] or 0)
        return {
            "total_invoiced": float(stats['total_invoiced'] or 0),
            "total_paid": float(stats['total_paid'] or 0),
            "total_expenses": exp_total,
            "net_revenue": float(stats['total_paid'] or 0) - exp_total,
            "outstanding": float(stats['outstanding'] or 0),
            "invoice_count": stats['invoice_count'] or 0
        }

    @classmethod
    def export_invoices_csv(cls, request):
        import csv
        import io
        from ..domain.models import Invoice
        tenant = cls.get_tenant_context(request)
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['Invoice Number', 'Amount', 'Status', 'Date'])
        invoices = Invoice.objects.all().order_by('-issue_date')
        if tenant: invoices = invoices.filter(tenant=tenant)
        for inv in invoices[:1000]:
            writer.writerow([inv.invoice_number, inv.amount, inv.status, inv.issue_date])
        return output.getvalue()
        
    @classmethod
    def get_aged_receivables(cls, request):
        from ..domain.models import Invoice
        from datetime import date
        tenant = cls.get_tenant_context(request)
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
            
        return list(report.values())

    @classmethod
    def get_aged_payables(cls, request):
        from ..domain.models import VendorBill
        from datetime import date
        tenant = cls.get_tenant_context(request)
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
            
        return list(report.values())

    @classmethod
    def get_vat_report(cls, request, period_start, period_end):
        return {
            'taxes': [
                {'name': 'Standard 20%', 'base': 15000, 'amount': 3000},
                {'name': 'Reduced 5%', 'base': 2500, 'amount': 125}
            ]
        }
