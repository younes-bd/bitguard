import random
import datetime
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.tenants.domain.models import Tenant
from apps.crm.domain.models import Client
from apps.core.domain.models import Partner
from apps.accounting.domain.models import Invoice, InvoiceItem
from apps.purchase.domain.models import PurchaseOrder, PurchaseOrderLine, Vendor
from apps.delivery.domain.models import DeliveryNote
from apps.reporting.domain.models import ReportTemplate, ReportEngineSettings

class Command(BaseCommand):
    help = 'Seeds the database with enterprise documents and Odoo-style reporting templates'

    def handle(self, *args, **kwargs):
        tenants = Tenant.objects.all()
        if not tenants.exists():
            self.stdout.write(self.style.ERROR('No tenant found. Cannot seed data.'))
            return

        for tenant in tenants:
            self.stdout.write(self.style.SUCCESS(f'\n--- Seeding data for tenant: {tenant.name} ---'))

            # 2. Setup Settings
            settings, created = ReportEngineSettings.objects.get_or_create(
                tenant=tenant,
                defaults={
                    'paper_format': 'A4',
                    'margin_top': 20,
                    'margin_bottom': 20,
                    'margin_left': 15,
                    'margin_right': 15,
                    'company_header_html': """
                        <div style="border-bottom: 2px solid #1a56db; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
                            <div>
                                <h1 style="color: #1a56db; margin: 0; font-size: 28px; font-family: sans-serif; font-weight: 900; letter-spacing: -1px;">BITGUARD</h1>
                                <p style="margin: 5px 0 0; color: #64748b; font-size: 12px; font-family: sans-serif;">Enterprise IT & Security Solutions</p>
                            </div>
                            <div style="text-align: right; color: #475569; font-size: 10px; font-family: sans-serif;">
                                <strong>BitGuard Enterprise Solutions LLC</strong><br>
                                123 Innovation Drive, Level 42<br>
                                Silicon Valley, CA 94025<br>
                                support@bitguard.tech | +1 (800) 555-0199
                            </div>
                        </div>
                    """,
                    'company_footer_html': """
                        <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 30px; font-size: 9px; color: #94a3b8; font-family: sans-serif; text-align: center;">
                            <p style="margin: 0;">Registered Company No. 994455221 | VAT: US-994455221</p>
                            <p style="margin: 5px 0 0;">Thank you for your business. For any inquiries, please contact our support team.</p>
                            <div style="margin-top: 10px;">Page <span class="page"></span> of <span class="topage"></span></div>
                        </div>
                    """
                }
            )
            self.stdout.write(self.style.SUCCESS('Configured Report Engine Settings.'))

            # 3. Create Templates
            self.stdout.write('Creating standard enterprise templates...')
            
            # Standard Invoice Template
            ReportTemplate.objects.update_or_create(
                tenant=tenant,
                name='Odoo Standard Invoice',
                defaults={
                    'model': 'accounting.Invoice',
                    'html_content': self.get_invoice_html(),
                    'css_content': self.get_shared_css(),
                    'is_active': True
                }
            )

            # Quotation Template
            ReportTemplate.objects.update_or_create(
                tenant=tenant,
                name='Odoo Professional Quotation',
                defaults={
                    'model': 'accounting.Invoice', # We use Invoice model with type=quotation
                    'html_content': self.get_quotation_html(),
                    'css_content': self.get_shared_css(),
                    'is_active': True
                }
            )

            # Purchase Order Template
            ReportTemplate.objects.update_or_create(
                tenant=tenant,
                name='Standard Purchase Order',
                defaults={
                    'model': 'purchase.PurchaseOrder',
                    'html_content': self.get_po_html(),
                    'css_content': self.get_shared_css(),
                    'is_active': True
                }
            )
            self.stdout.write(self.style.SUCCESS('Created Reporting Templates.'))

            # 4. Generate Mock Data
            self.stdout.write('Generating mock enterprise records...')
            client1, _ = Client.objects.get_or_create(tenant=tenant, name='CyberDyne Systems', email='billing@cyberdyne.corp', phone='555-0100')
            client2, _ = Client.objects.get_or_create(tenant=tenant, name='Massive Dynamic', email='accounts@massive.dyn', phone='555-0200')
            vendor1, _ = Vendor.objects.get_or_create(tenant=tenant, name='Dell Technologies', email='sales@dell.com')

            today = timezone.now().date()

            # Invoices
            inv1, _ = Invoice.objects.get_or_create(tenant=tenant, invoice_number='INV-2026-001', defaults={
                'client': client1, 'type': 'standard', 'status': 'sent', 
                'issue_date': today, 'due_date': today + datetime.timedelta(days=30),
                'subtotal': Decimal('5000.00'), 'tax_total': Decimal('500.00'), 'total_amount': Decimal('5500.00')
            })
            InvoiceItem.objects.get_or_create(invoice=inv1, description='Enterprise Firewall Setup', quantity=1, unit_price=Decimal('5000.00'), total=Decimal('5000.00'))

            inv2, _ = Invoice.objects.get_or_create(tenant=tenant, invoice_number='INV-2026-002', defaults={
                'client': client2, 'type': 'standard', 'status': 'paid', 
                'issue_date': today - datetime.timedelta(days=15), 'due_date': today + datetime.timedelta(days=15),
                'subtotal': Decimal('12000.00'), 'tax_total': Decimal('1200.00'), 'total_amount': Decimal('13200.00')
            })
            InvoiceItem.objects.get_or_create(invoice=inv2, description='Managed IT Services - Monthly', quantity=12, unit_price=Decimal('1000.00'), total=Decimal('12000.00'))

            # Quotation
            quo1, _ = Invoice.objects.get_or_create(tenant=tenant, invoice_number='QUO-2026-001', defaults={
                'client': client1, 'type': 'quotation', 'status': 'sent', 
                'issue_date': today, 'due_date': today, 'expiry_date': today + datetime.timedelta(days=14),
                'subtotal': Decimal('25000.00'), 'tax_total': Decimal('2500.00'), 'total_amount': Decimal('27500.00')
            })
            InvoiceItem.objects.get_or_create(invoice=quo1, description='SOC 2 Compliance Audit', quantity=1, unit_price=Decimal('25000.00'), total=Decimal('25000.00'))

            # Purchase Order
            po1, _ = PurchaseOrder.objects.get_or_create(tenant=tenant, po_number='PO-2026-001', defaults={
                'vendor': vendor1, 'status': 'issued', 'order_date': today, 'expected_date': today + datetime.timedelta(days=7),
                'subtotal': Decimal('45000.00'), 'tax_total': Decimal('0.00'), 'total_amount': Decimal('45000.00')
            })
            PurchaseOrderLine.objects.get_or_create(purchase_order=po1, description='Dell PowerEdge R740 Servers', quantity_ordered=5, unit_cost=Decimal('9000.00'), total=Decimal('45000.00'))

        self.stdout.write(self.style.SUCCESS('\nSuccessfully seeded enterprise mock data for all tenants!'))
        self.stdout.write(self.style.SUCCESS('You can now navigate to ERP > Invoices or Reporting Engine to generate PDFs.'))


    def get_shared_css(self):
        return """
body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 13px;
    color: #334155;
    line-height: 1.5;
}
.report-title {
    font-size: 24px;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0 0 5px 0;
}
.badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
}
.badge.paid { background: #dcfce7; color: #166534; border: 1px solid #166534; }
.badge.sent { background: #dbeafe; color: #1e40af; border: 1px solid #1e40af; }
.badge.draft { background: #f1f5f9; color: #475569; border: 1px solid #475569; }

.info-grid {
    display: table;
    width: 100%;
    margin-bottom: 30px;
}
.info-col {
    display: table-cell;
    width: 50%;
    vertical-align: top;
}
.label {
    font-size: 10px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 2px;
}
.value {
    font-size: 14px;
    font-weight: bold;
    color: #0f172a;
    margin-bottom: 10px;
}
.address-box {
    background: #f8fafc;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}
.table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 30px;
}
.table th {
    background: #f1f5f9;
    color: #475569;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 10px;
    text-align: left;
    border-bottom: 2px solid #cbd5e1;
}
.table td {
    padding: 12px 10px;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: top;
}
.text-right { text-align: right !important; }
.totals-box {
    width: 300px;
    float: right;
    background: #f8fafc;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}
.totals-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
}
.totals-row.grand {
    border-top: 2px solid #cbd5e1;
    padding-top: 10px;
    margin-top: 5px;
    font-size: 18px;
    font-weight: bold;
    color: #0f172a;
}
.clearfix::after {
    content: "";
    clear: both;
    display: table;
}
        """

    def get_invoice_html(self):
        return """
<div class="info-grid">
    <div class="info-col">
        <h2 class="report-title">TAX INVOICE</h2>
        <div class="value" style="font-family: monospace; color: #64748b;">{{ record.invoice_number }}</div>
        
        <div style="margin-top: 15px;">
            <span class="badge {{ record.status }}">{{ record.status }}</span>
        </div>
    </div>
    <div class="info-col text-right">
        <div class="label">Invoice Date</div>
        <div class="value">{{ record.issue_date|date:"M d, Y" }}</div>
        
        <div class="label">Due Date</div>
        <div class="value" style="color: #ef4444;">{{ record.due_date|date:"M d, Y" }}</div>
    </div>
</div>

<div class="info-grid">
    <div class="info-col" style="padding-right: 20px;">
        <div class="label">Bill To</div>
        <div class="address-box">
            <strong>{{ record.client.name }}</strong><br>
            {{ record.client.email }}<br>
            {{ record.client.phone }}
        </div>
    </div>
    <div class="info-col">
        <!-- Optional space for shipping or project info -->
    </div>
</div>

<table class="table">
    <thead>
        <tr>
            <th>Description</th>
            <th class="text-right" style="width: 80px;">Qty</th>
            <th class="text-right" style="width: 120px;">Unit Price</th>
            <th class="text-right" style="width: 120px;">Amount</th>
        </tr>
    </thead>
    <tbody>
        {% for item in record.items.all %}
        <tr>
            <td>
                <strong>{{ item.description }}</strong>
                {% if item.product %}<br><span style="color: #64748b; font-size: 11px;">SKU: {{ item.product.sku }}</span>{% endif %}
            </td>
            <td class="text-right">{{ item.quantity }}</td>
            <td class="text-right">${{ item.unit_price|floatformat:2 }}</td>
            <td class="text-right font-weight-bold">${{ item.total|floatformat:2 }}</td>
        </tr>
        {% endfor %}
    </tbody>
</table>

<div class="clearfix">
    <div class="totals-box">
        <div class="totals-row">
            <span>Subtotal:</span>
            <span>${{ record.subtotal|floatformat:2 }}</span>
        </div>
        <div class="totals-row">
            <span>Taxes:</span>
            <span>${{ record.tax_total|floatformat:2 }}</span>
        </div>
        {% if record.discount_total > 0 %}
        <div class="totals-row" style="color: #ef4444;">
            <span>Discount:</span>
            <span>-${{ record.discount_total|floatformat:2 }}</span>
        </div>
        {% endif %}
        <div class="totals-row grand">
            <span>TOTAL:</span>
            <span>${{ record.total_amount|floatformat:2 }}</span>
        </div>
    </div>
</div>

<div style="margin-top: 50px;">
    <div class="label">Payment Instructions</div>
    <p style="font-size: 11px; color: #64748b;">Please make cheques payable to <strong>BitGuard Enterprise Solutions</strong>. For wire transfers, please use SWIFT: BITGUS33, Account: 100200300. Include the invoice number in the payment reference.</p>
</div>
        """

    def get_quotation_html(self):
        return """
<div class="info-grid">
    <div class="info-col">
        <h2 class="report-title" style="color: #8b5cf6;">QUOTATION</h2>
        <div class="value" style="font-family: monospace; color: #64748b;">{{ record.invoice_number }}</div>
    </div>
    <div class="info-col text-right">
        <div class="label">Date</div>
        <div class="value">{{ record.issue_date|date:"M d, Y" }}</div>
        
        <div class="label">Valid Until</div>
        <div class="value" style="color: #ef4444;">{{ record.expiry_date|date:"M d, Y" }}</div>
    </div>
</div>

<div class="info-grid">
    <div class="info-col" style="padding-right: 20px;">
        <div class="label">Prepared For</div>
        <div class="address-box" style="border-left: 3px solid #8b5cf6;">
            <strong>{{ record.client.name }}</strong><br>
            {{ record.client.email }}
        </div>
    </div>
</div>

<p style="margin-bottom: 20px;">Dear {{ record.client.name }}, thank you for your inquiry. We are pleased to submit the following proposal for your consideration.</p>

<table class="table">
    <thead>
        <tr>
            <th>Service / Product Description</th>
            <th class="text-right" style="width: 80px;">Qty</th>
            <th class="text-right" style="width: 120px;">Unit Price</th>
            <th class="text-right" style="width: 120px;">Amount</th>
        </tr>
    </thead>
    <tbody>
        {% for item in record.items.all %}
        <tr>
            <td><strong>{{ item.description }}</strong></td>
            <td class="text-right">{{ item.quantity }}</td>
            <td class="text-right">${{ item.unit_price|floatformat:2 }}</td>
            <td class="text-right font-weight-bold">${{ item.total|floatformat:2 }}</td>
        </tr>
        {% endfor %}
    </tbody>
</table>

<div class="clearfix">
    <div class="totals-box">
        <div class="totals-row grand">
            <span>ESTIMATE TOTAL:</span>
            <span>${{ record.total_amount|floatformat:2 }}</span>
        </div>
    </div>
</div>

<div style="margin-top: 50px;">
    <p style="font-size: 11px; color: #64748b;">To accept this quotation, please sign below and return it to us. Prices are subject to change after the expiry date.</p>
    <div style="margin-top: 30px; border-top: 1px solid #cbd5e1; width: 300px; padding-top: 10px;">
        <div class="label">Authorized Signature</div>
    </div>
</div>
        """

    def get_po_html(self):
        return """
<div class="info-grid">
    <div class="info-col">
        <h2 class="report-title">PURCHASE ORDER</h2>
        <div class="value" style="font-family: monospace; color: #64748b;">{{ record.po_number }}</div>
    </div>
    <div class="info-col text-right">
        <div class="label">Order Date</div>
        <div class="value">{{ record.order_date|date:"M d, Y" }}</div>
        
        <div class="label">Expected Delivery</div>
        <div class="value">{{ record.expected_date|date:"M d, Y" }}</div>
    </div>
</div>

<div class="info-grid">
    <div class="info-col" style="padding-right: 20px;">
        <div class="label">Vendor</div>
        <div class="address-box">
            <strong>{{ record.vendor.name }}</strong><br>
            {{ record.vendor.email }}
        </div>
    </div>
</div>

<table class="table">
    <thead>
        <tr>
            <th>Item / Description</th>
            <th class="text-right" style="width: 80px;">Qty</th>
            <th class="text-right" style="width: 120px;">Unit Price</th>
            <th class="text-right" style="width: 120px;">Total</th>
        </tr>
    </thead>
    <tbody>
        {% for item in record.lines.all %}
        <tr>
            <td><strong>{{ item.description }}</strong></td>
            <td class="text-right">{{ item.quantity_ordered }}</td>
            <td class="text-right">${{ item.unit_cost|floatformat:2 }}</td>
            <td class="text-right font-weight-bold">${{ item.total|floatformat:2 }}</td>
        </tr>
        {% endfor %}
    </tbody>
</table>

<div class="clearfix">
    <div class="totals-box">
        <div class="totals-row grand">
            <span>PO TOTAL:</span>
            <span>${{ record.total_amount|floatformat:2 }}</span>
        </div>
    </div>
</div>
        """
