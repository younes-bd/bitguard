"""
ERP Service Layer — Full Enterprise Edition
Charter §8, §11, §16, §18 Compliance
"""
from django.db import transaction
from django.db.models import Sum, Q
from django.utils import timezone
from apps.core.services.base import BaseService
from apps.core.services.audit import AuditService
from .models import (
    Invoice, Payment, Expense, InternalProject, GeneralLedger, InvoiceItem,
    DeliveryNote, ErpVendor, ErpPurchaseOrder, ErpPurchaseOrderItem,
    RecurringInvoice, RecurringInvoiceItem,
    Account, JournalEntry, JournalEntryLine, BankAccount,
    BankTransaction, CreditNote, FixedAsset,
)
import datetime


# ─── UTILITIES ────────────────────────────────────────────────────────────────

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


# ─── INVOICING ────────────────────────────────────────────────────────────────

class InvoiceService(BaseService):

    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(
            Invoice.objects.all(), request
        ).prefetch_related('items', 'payments').select_related('client')

    @classmethod
    def auto_number(cls, request, doc_type='standard'):
        """Generate next sequential invoice number per tenant and type."""
        tenant = cls.get_tenant_context(request)
        prefixes = {'standard': 'INV', 'proforma': 'PRO', 'credit_note': 'CN'}
        prefix = prefixes.get(doc_type, 'INV')
        year = timezone.now().year
        existing = Invoice.objects.filter(
            tenant=tenant,
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
        from .models import Expense
        revenue = Payment.objects.filter(
            invoice__tenant=tenant, payment_date__range=[date_from, date_to]
        ).aggregate(total=Sum('amount'))['total'] or 0
        expenses = Expense.objects.filter(
            tenant=tenant, incurred_date__range=[date_from, date_to]
        ).aggregate(total=Sum('amount'))['total'] or 0

        from .models import Expense as E
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
        from apps.contracts.models import Quote
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
        import io
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas
        
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        
        # Simple Header
        p.setFont("Helvetica-Bold", 24)
        p.drawString(50, 750, f"{invoice.get_type_display().upper()}")
        
        p.setFont("Helvetica", 12)
        p.drawString(50, 720, f"Invoice #: {invoice.invoice_number}")
        p.drawString(50, 705, f"Date: {invoice.issue_date}")
        if invoice.due_date:
            p.drawString(50, 690, f"Due Date: {invoice.due_date}")
        
        p.drawString(350, 720, "Bill To:")
        client_name = invoice.client.name if invoice.client else "Unknown Client"
        p.drawString(350, 705, client_name)
        
        # Items Table Header
        y = 650
        p.setFont("Helvetica-Bold", 10)
        p.drawString(50, y, "Description")
        p.drawString(300, y, "Qty")
        p.drawString(380, y, "Unit Price")
        p.drawString(480, y, "Total")
        p.line(50, y-5, 550, y-5)
        
        y -= 20
        p.setFont("Helvetica", 10)
        for item in invoice.items.all():
            p.drawString(50, y, str(item.description))
            p.drawString(300, y, str(item.quantity))
            p.drawString(380, y, f"${item.unit_price}")
            p.drawString(480, y, f"${item.total}")
            y -= 15
            if y < 100:
                p.showPage()
                y = 750
                p.setFont("Helvetica", 10)
        
        # Totals
        y -= 20
        p.line(300, y+10, 550, y+10)
        p.setFont("Helvetica-Bold", 10)
        p.drawString(380, y, "Subtotal:")
        p.drawString(480, y, f"${invoice.subtotal}")
        y -= 15
        p.drawString(380, y, "Tax:")
        p.drawString(480, y, f"${invoice.tax_total}")
        y -= 15
        p.drawString(380, y, "Total Due:")
        p.drawString(480, y, f"${invoice.total_amount}")
        
        # Footer
        p.setFont("Helvetica", 8)
        p.drawString(50, 50, "Generated by BitGuard ERP OS")
        
        p.showPage()
        p.save()
        
        pdf_bytes = buffer.getvalue()
        buffer.close()
        
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


# ─── PAYMENTS ─────────────────────────────────────────────────────────────────

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


# ─── EXPENSES ─────────────────────────────────────────────────────────────────

class ExpenseService(BaseService):
    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(Expense.objects.all(), request)

    @classmethod
    @transaction.atomic
    def create_expense(cls, request, data: dict):
        from .models import Expense
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


# ─── DELIVERY NOTES ───────────────────────────────────────────────────────────

class DeliveryNoteService(BaseService):
    VALID_TRANSITIONS = {
        'draft': ['shipped', 'cancelled'],
        'shipped': ['delivered', 'returned'],
        'delivered': [],
        'returned': [],
        'cancelled': [],
    }

    @classmethod
    @transaction.atomic
    def create_dn(cls, request, invoice: Invoice, data: dict) -> DeliveryNote:
        tenant = cls.get_tenant_context(request)
        dn = DeliveryNote.objects.create(
            tenant=tenant, invoice=invoice, client=invoice.client, **data
        )
        AuditService.log_action(request, "ERP_DN_CREATED", f"erp.DeliveryNote:{dn.pk}",
                                {"dn_number": dn.dn_number})
        return dn

    @classmethod
    @transaction.atomic
    def update_status(cls, request, dn: DeliveryNote, new_status: str) -> DeliveryNote:
        allowed = cls.VALID_TRANSITIONS.get(dn.status, [])
        if new_status not in allowed:
            raise ValueError(f"Cannot transition from '{dn.status}' to '{new_status}'.")
        dn.status = new_status
        if new_status == 'delivered':
            dn.delivery_date = timezone.now().date()
            
        # Enterprise Integration: Autonomous Stock Deduction on Shipment
        if new_status in ['shipped', 'delivered'] and dn.invoice:
            for item in dn.invoice.items.all():
                if getattr(item, 'product', None) and item.product.track_stock:
                    # 1. Decrement Store stock
                    item.product.stock_quantity -= int(item.quantity)
                    item.product.save()
                    
                    # 2. Decrement SCM Warehouse stock
                    try:
                        from apps.scm.models import InventoryItem
                        inv_item = InventoryItem.objects.filter(product_id=item.product.id).first()
                        if inv_item:
                            inv_item.quantity_on_hand -= int(item.quantity)
                            inv_item.save()
                    except ImportError:
                        pass
        
        dn.save()
        AuditService.log_action(request, "ERP_DN_STATUS_UPDATED", f"erp.DeliveryNote:{dn.pk}",
                                {"new_status": new_status})
        return dn

    @classmethod
    def generate_pdf(cls, request, dn: DeliveryNote) -> bytes:
        import io
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas
        
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        
        p.setFont("Helvetica-Bold", 24)
        p.drawString(50, 750, "DELIVERY NOTE")
        
        p.setFont("Helvetica", 12)
        p.drawString(50, 720, f"DN #: {dn.dn_number}")
        p.drawString(50, 705, f"Date: {dn.delivery_date or 'TBD'}")
        p.drawString(50, 690, f"Status: {dn.get_status_display()}")
        
        p.drawString(350, 720, "Ship To:")
        client_name = dn.client.name if dn.client else "Unknown Client"
        p.drawString(350, 705, client_name)
        
        # simple address handling
        address_lines = str(dn.shipping_address).split('\n')
        y_addr = 690
        for line in address_lines[:4]:
            p.drawString(350, y_addr, line.strip())
            y_addr -= 15
            
        if dn.invoice:
            p.drawString(50, 650, f"Related Invoice: {dn.invoice.invoice_number}")
        
        # Items Table Header (if from invoice)
        y = 600
        if dn.invoice and dn.invoice.items.exists():
            p.setFont("Helvetica-Bold", 10)
            p.drawString(50, y, "Description")
            p.drawString(450, y, "Qty Shipped")
            p.line(50, y-5, 550, y-5)
            
            y -= 20
            p.setFont("Helvetica", 10)
            for item in dn.invoice.items.all():
                p.drawString(50, y, str(item.description))
                p.drawString(450, y, str(item.quantity))
                y -= 15
                if y < 100:
                    p.showPage()
                    y = 750
                    p.setFont("Helvetica", 10)
        
        # Footer
        p.setFont("Helvetica", 8)
        p.drawString(50, 50, "Generated by BitGuard ERP OS")
        
        p.showPage()
        p.save()
        
        pdf_bytes = buffer.getvalue()
        buffer.close()
        
        AuditService.log_action(request, "ERP_DN_PDF_GENERATED", f"erp.DeliveryNote:{dn.pk}",
                                {"dn_number": dn.dn_number})
        return pdf_bytes


# ─── VENDORS & PURCHASE ORDERS ────────────────────────────────────────────────

class VendorService(BaseService):
    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(ErpVendor.objects.all(), request)

    @classmethod
    @transaction.atomic
    def create_vendor(cls, request, data: dict) -> ErpVendor:
        tenant = cls.get_tenant_context(request)
        vendor = ErpVendor(tenant=tenant, **data)
        vendor.full_clean()
        vendor.save()
        AuditService.log_action(request, "ERP_VENDOR_CREATED", f"erp.ErpVendor:{vendor.pk}",
                                {"name": vendor.name})
        return vendor

    @classmethod
    @transaction.atomic
    def update_vendor(cls, request, vendor: ErpVendor, data: dict) -> ErpVendor:
        for field, value in data.items():
            setattr(vendor, field, value)
        vendor.full_clean()
        vendor.save()
        return vendor


class PurchaseOrderService(BaseService):
    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(
            ErpPurchaseOrder.objects.all(), request
        ).prefetch_related('items').select_related('vendor')

    @classmethod
    def auto_po_number(cls, request) -> str:
        tenant = cls.get_tenant_context(request)
        year = timezone.now().year
        count = ErpPurchaseOrder.objects.filter(
            tenant=tenant, po_number__startswith=f"PO-{year}-"
        ).count()
        return f"PO-{year}-{str(count + 1).zfill(4)}"

    @classmethod
    @transaction.atomic
    def create_po(cls, request, data: dict, items: list = None) -> ErpPurchaseOrder:
        tenant = cls.get_tenant_context(request)
        if not data.get('po_number'):
            data['po_number'] = cls.auto_po_number(request)
        po = ErpPurchaseOrder(tenant=tenant, **data)
        po.save()
        subtotal = tax_total = 0
        if items:
            for item_data in items:
                qty = float(item_data.get('quantity', 1))
                price = float(item_data.get('unit_price', 0))
                tax_rate = float(item_data.get('tax_rate', 0))
                line_sub = qty * price
                line_tax = line_sub * (tax_rate / 100)
                ErpPurchaseOrderItem.objects.create(
                    tenant=tenant, purchase_order=po, **item_data, total=line_sub + line_tax
                )
                subtotal += line_sub
                tax_total += line_tax
        po.subtotal = subtotal
        po.tax_total = tax_total
        po.total_amount = subtotal + tax_total
        po.save()
        AuditService.log_action(request, "ERP_PO_CREATED", f"erp.ErpPurchaseOrder:{po.pk}",
                                {"po_number": po.po_number, "total": float(po.total_amount)})
        return po

    @classmethod
    @transaction.atomic
    def receive_po(cls, request, po: ErpPurchaseOrder) -> ErpPurchaseOrder:
        if po.status != 'confirmed':
            raise ValueError("Only confirmed POs can be marked as received.")
        po.status = 'received'
        po.received_at = timezone.now()
        po.save()
        GeneralLedgerService.record_entry(
            request, "Inventory / COGS", po.total_amount, 'debit',
            po.pk, 'purchase_order', f"PO Received: {po.po_number}"
        )
        GeneralLedgerService.record_entry(
            request, "Accounts Payable", po.total_amount, 'credit',
            po.pk, 'purchase_order', f"Payable for PO: {po.po_number}"
        )
        AuditService.log_action(request, "ERP_PO_RECEIVED", f"erp.ErpPurchaseOrder:{po.pk}", {})
        return po


# ─── RECURRING INVOICES ───────────────────────────────────────────────────────

class RecurringInvoiceService(BaseService):
    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(
            RecurringInvoice.objects.all(), request
        ).prefetch_related('items').select_related('client')

    @classmethod
    @transaction.atomic
    def run_now(cls, request, recurring: RecurringInvoice) -> Invoice:
        """Manually trigger a recurring invoice to generate a new invoice now."""
        items = [
            {'description': i.description, 'quantity': float(i.quantity),
             'unit_price': float(i.unit_price), 'tax_rate': float(i.tax_rate), 'discount': 0}
            for i in recurring.items.all()
        ]
        data = {
            'client': recurring.client,
            'type': 'standard', 'status': 'draft',
            'issue_date': timezone.now().date(),
            'due_date': timezone.now().date() + datetime.timedelta(days=recurring.payment_terms_days),
            'notes': recurring.notes,
        }
        invoice = InvoiceService.create_invoice(request, data, items)
        # Advance next_run date
        import dateutil.relativedelta as rd
        delta_map = {
            'weekly': datetime.timedelta(weeks=1),
            'monthly': None, 'quarterly': None, 'annually': None,
        }
        if recurring.frequency == 'weekly':
            recurring.next_run = recurring.next_run + datetime.timedelta(weeks=1)
        elif recurring.frequency == 'monthly':
            recurring.next_run = recurring.next_run + rd.relativedelta(months=1)
        elif recurring.frequency == 'quarterly':
            recurring.next_run = recurring.next_run + rd.relativedelta(months=3)
        elif recurring.frequency == 'annually':
            recurring.next_run = recurring.next_run + rd.relativedelta(years=1)
        recurring.save()
        AuditService.log_action(request, "ERP_RECURRING_INVOICE_GENERATED", f"erp.RecurringInvoice:{recurring.pk}",
                                {"invoice_number": invoice.invoice_number})
        return invoice


# ─── ENTERPRISE DASHBOARD ─────────────────────────────────────────────────────

class EnterpriseService(BaseService):
    @classmethod
    def get_dashboard_stats(cls, request):
        from .models import Expense
        from django.db.models import Sum
        tenant = cls.get_tenant_context(request)
        invoices = Invoice.objects.filter(tenant=tenant)
        payments = Payment.objects.filter(invoice__tenant=tenant)
        expenses = Expense.objects.filter(tenant=tenant)

        total_revenue = payments.aggregate(total=Sum('amount'))['total'] or 0
        total_expenses = expenses.aggregate(total=Sum('amount'))['total'] or 0

        # Real outstanding AR: unpaid invoices
        outstanding_balance = invoices.exclude(
            status__in=['paid', 'void', 'cancelled', 'draft']
        ).aggregate(total=Sum('total_amount'))['total'] or 0

        # Real MRR from active recurring invoices
        mrr = 0
        for ri in RecurringInvoice.objects.filter(tenant=tenant, is_active=True):
            ri_total = sum(
                float(i.quantity * i.unit_price) * (1 + float(i.tax_rate) / 100)
                for i in ri.items.all()
            )
            freq_multiplier = {'weekly': 4.33, 'monthly': 1, 'quarterly': 1/3, 'annually': 1/12}
            mrr += ri_total * freq_multiplier.get(ri.frequency, 1)

        # Real task count — projects assigned to current user
        my_tasks = InternalProject.objects.filter(
            tenant=tenant, assigned_to=request.user, status__in=['active', 'planning']
        ).count()

        return {
            "kpi": {
                "active_projects": InternalProject.objects.filter(tenant=tenant, status='active').count(),
                "overdue_invoices": invoices.filter(status='overdue').count(),
                "pending_delivery": DeliveryNote.objects.filter(tenant=tenant, status='shipped').count(),
                "draft_invoices": invoices.filter(status='draft').count(),
                "active_vendors": ErpVendor.objects.filter(tenant=tenant, is_active=True).count(),
                "open_pos": ErpPurchaseOrder.objects.filter(tenant=tenant).exclude(
                    status__in=['received', 'cancelled']).count(),
                "my_tasks": my_tasks,
                "pending_expenses": Expense.objects.filter(tenant=tenant, status='submitted').count(),
                "recurring_active": RecurringInvoice.objects.filter(tenant=tenant, is_active=True).count(),
            },
            "financials": {
                "total_revenue": float(total_revenue),
                "total_expenses": float(total_expenses),
                "net_profit": float(total_revenue - total_expenses),
                "outstanding_balance": float(outstanding_balance),
                "mrr": round(float(mrr), 2),
            },
            "system": {"core": "Operational", "database": "Operational"}
        }

    @classmethod
    def get_monthly_revenue_expenses(cls, request, months=6):
        import datetime
        from django.db.models import Sum
        tenant = cls.get_tenant_context(request)
        today = datetime.date.today()
        
        data = []
        for i in range(months - 1, -1, -1):
            target_month = (today.month - 1 - i) % 12 + 1
            target_year = today.year + (today.month - 1 - i) // 12
            
            start_date = datetime.date(target_year, target_month, 1)
            if target_month == 12:
                end_date = datetime.date(target_year + 1, 1, 1) - datetime.timedelta(days=1)
            else:
                end_date = datetime.date(target_year, target_month + 1, 1) - datetime.timedelta(days=1)
                
            income = Payment.objects.filter(
                invoice__tenant=tenant,
                payment_date__range=[start_date, end_date]
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            expense = Expense.objects.filter(
                tenant=tenant,
                incurred_date__range=[start_date, end_date],
                status__in=['approved', 'reimbursed']
            ).aggregate(total=Sum('amount'))['total'] or 0
            
            month_name = start_date.strftime('%b')
            data.append({
                'name': month_name,
                'income': float(income),
                'expense': float(expense),
                'sortKey': start_date.strftime('%Y%m')
            })
            
        return data


# ─── INTERNAL PROJECTS ────────────────────────────────────────────────────────

class InternalProjectService(BaseService):
    @classmethod
    def get_queryset(cls, request):
        return cls.filter_by_context(InternalProject.objects.all(), request)

    @classmethod
    @transaction.atomic
    def create_project_from_order(cls, request, order) -> InternalProject:
        tenant = cls.get_tenant_context(request)
        project = InternalProject.objects.create(
            name=f"Delivery: {order.product.name} for {order.user.username}",
            client=getattr(order.user, 'client', None),
            tenant=tenant, status='planning', budget=order.total_amount,
            is_service_obligation=True,
            due_date=timezone.now().date() + datetime.timedelta(days=7),
            description=f"Automated delivery obligation from Order #{order.id}"
        )
        AuditService.log_action(request, "ERP_PROJECT_CREATED_FROM_ORDER",
                                f"erp.InternalProject:{project.pk}", {"order_id": order.id})
        return project

    @classmethod
    @transaction.atomic
    def update_project(cls, request, project: InternalProject, data: dict) -> InternalProject:
        cls.validate_ownership(project, request)
        for field, value in data.items():
            setattr(project, field, value)
        project.full_clean()
        project.save()
        AuditService.log_action(request, "ERP_PROJECT_UPDATED",
                                f"erp.InternalProject:{project.pk}", {"changes": data})
        return project


# ─── PHASE 3: ENTERPRISE FINANCIAL ACCOUNTING ─────────────────────────────────

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
            'assets': [], 'liabilities': [], 'equity': [],
            'total_assets': 0, 'total_liabilities': 0, 'total_equity': 0
        }

        for acct in accounts:
            bal = get_balance(acct)
            if bal == 0: continue
            
            entry = {'code': acct.code, 'name': acct.name, 'balance': float(bal)}
            if acct.account_type == 'asset':
                report['assets'].append(entry)
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


# ─── DEPRECIATION ───────────────────────────────────────────────────

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
