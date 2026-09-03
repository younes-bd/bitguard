from django.core.management.base import BaseCommand
from apps.reporting.domain.models import ReportTemplate
from apps.tenants.domain.models import Tenant

GLOBAL_CSS = """
@page {
  size: A4;
  margin: 15mm 12mm 20mm 12mm;
  @bottom-right {
    content: "Page " counter(page) " of " counter(pages);
    font-size: 8pt;
    color: #6b7280;
  }
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 9pt; color: #1f2937; line-height: 1.5; }

.doc-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 12pt; border-bottom: 3px solid {{ primary_color|default:'#1a56db' }}; margin-bottom: 16pt; }
.company-logo { max-height: 60px; max-width: 180px; object-fit: contain; }
.company-info { text-align: right; font-size: 8pt; color: #4b5563; }
.doc-title { font-size: 22pt; font-weight: 700; color: {{ primary_color|default:'#1a56db' }}; letter-spacing: -0.5pt; }
.doc-meta { font-size: 8pt; color: #6b7280; }

.address-block { display: flex; gap: 40pt; margin-bottom: 16pt; }
.address-box { flex: 1; }
.address-box h4 { font-size: 7pt; text-transform: uppercase; letter-spacing: 0.5pt; color: #9ca3af; font-weight: 600; margin-bottom: 4pt; }
.address-box p { font-size: 9pt; color: #1f2937; line-height: 1.6; }

table { width: 100%; border-collapse: collapse; margin-bottom: 12pt; }
thead tr { background-color: {{ primary_color|default:'#1a56db' }}; color: white; }
thead th { padding: 6pt 8pt; font-size: 8pt; font-weight: 600; text-align: left; }
tbody tr:nth-child(even) { background-color: #f9fafb; }
tbody td { padding: 5pt 8pt; font-size: 8pt; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
tfoot td { padding: 6pt 8pt; font-size: 9pt; font-weight: 600; border-top: 2px solid {{ primary_color|default:'#1a56db' }}; }

.totals-section { display: flex; justify-content: flex-end; margin-bottom: 16pt; }
.totals-table { width: 260pt; }
.totals-table tr td { padding: 3pt 8pt; font-size: 8.5pt; }
.totals-table .grand-total td { background-color: {{ primary_color|default:'#1a56db' }}; color: white; font-size: 11pt; font-weight: 700; padding: 6pt 8pt; }
.totals-table .tax-row td { color: #6b7280; font-size: 8pt; }

.notes-block { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4pt; padding: 10pt; font-size: 8pt; color: #4b5563; margin-bottom: 12pt; }
.payment-block { margin-bottom: 12pt; border: 1.5px solid {{ primary_color|default:'#1a56db' }}; border-radius: 4pt; padding: 10pt; }
.payment-block h4 { font-size: 9pt; font-weight: 700; color: {{ primary_color|default:'#1a56db' }}; margin-bottom: 6pt; }
.payment-block table { margin: 0; }
.payment-block td { border-bottom: none; font-size: 8pt; }
.payment-block td:first-child { color: #6b7280; font-weight: 600; width: 120pt; }

.signature-block { display: flex; gap: 40pt; margin-top: 24pt; }
.signature-box { flex: 1; border-top: 1.5px solid #d1d5db; padding-top: 6pt; }
.signature-box p { font-size: 8pt; color: #6b7280; }

.doc-footer { position: running(footer); border-top: 1px solid #e5e7eb; padding-top: 6pt; margin-top: 20pt; font-size: 7pt; color: #9ca3af; text-align: center; }
"""

INVOICE_HTML = """
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Invoice {{ record.invoice_number }}</title></head>
<body>
  <div class="doc-header">
    <div>
      {% if record.logo_url %}<img class="company-logo" src="{{ record.logo_url }}" alt="Logo">{% endif %}
      <div class="doc-title">INVOICE</div>
      <div class="doc-meta"># {{ record.invoice_number }}</div>
    </div>
    <div class="company-info">
      <strong>{{ company_name }}</strong><br>
      {{ company_address }}<br>
      VAT: {{ company_vat }}<br>
      {{ company_phone }} · {{ company_email }}
    </div>
  </div>

  <div class="address-block">
    <div class="address-box">
      <h4>Bill To</h4>
      <p><strong>{{ record.client.name }}</strong><br>
      {% if record.client.address %}{{ record.client.address }}<br>{% endif %}
      {% if record.client.tax_id %}VAT: {{ record.client.tax_id }}{% endif %}</p>
    </div>
    <div class="address-box" style="text-align:right">
      <h4>Invoice Details</h4>
      <p>
        <strong>Issue Date:</strong> {{ record.issue_date|date:"d M Y" }}<br>
        <strong>Due Date:</strong> {{ record.due_date|date:"d M Y" }}<br>
        {% if record.reference %}<strong>Reference:</strong> {{ record.reference }}<br>{% endif %}
        {% if record.payment_terms %}<strong>Terms:</strong> {{ record.payment_terms.name }}{% endif %}
      </p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:40%">Description</th>
        <th style="width:8%; text-align:center">Qty</th>
        <th style="width:12%; text-align:right">Unit Price</th>
        <th style="width:8%; text-align:center">Tax %</th>
        <th style="width:10%; text-align:right">Discount</th>
        <th style="width:12%; text-align:right">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      {% for line in record.items.all %}
      <tr>
        <td>{{ line.description }}{% if line.product %}<br><span style="color:#9ca3af;font-size:7.5pt">{{ line.product.name }}</span>{% endif %}</td>
        <td style="text-align:center">{{ line.quantity }}</td>
        <td style="text-align:right">{{ record.currency }} {{ line.unit_price|floatformat:2 }}</td>
        <td style="text-align:center">{{ line.tax_rate|default:"0" }}%</td>
        <td style="text-align:right">{% if line.discount %}{{ line.discount }}%{% else %}—{% endif %}</td>
        <td style="text-align:right">{{ record.currency }} {{ line.total|floatformat:2 }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>

  <div class="totals-section">
    <table class="totals-table">
      <tr><td>Subtotal</td><td style="text-align:right">{{ record.currency }} {{ record.subtotal|floatformat:2 }}</td></tr>
      {% if record.discount_total %}<tr class="tax-row"><td>Discount</td><td style="text-align:right">- {{ record.currency }} {{ record.discount_total|floatformat:2 }}</td></tr>{% endif %}
      {% for tax_name, tax_amount in tax_lines %}<tr class="tax-row"><td>{{ tax_name }}</td><td style="text-align:right">{{ record.currency }} {{ tax_amount|floatformat:2 }}</td></tr>{% endfor %}
      <tr class="grand-total"><td>TOTAL DUE</td><td style="text-align:right">{{ record.currency }} {{ record.total_amount|floatformat:2 }}</td></tr>
    </table>
  </div>

  {% if record.notes %}
  <div class="notes-block"><strong>Notes:</strong> {{ record.notes }}</div>
  {% endif %}

  <div class="payment-block">
    <h4>Payment Instructions</h4>
    <table>
      <tr><td>Bank Name</td><td>{{ company_bank_name|default:'---' }}</td></tr>
      <tr><td>Account Name</td><td>{{ company_name|default:'---' }}</td></tr>
      <tr><td>IBAN</td><td>{{ company_iban|default:'---' }}</td></tr>
      <tr><td>SWIFT / BIC</td><td>{{ company_swift|default:'---' }}</td></tr>
      <tr><td>Reference</td><td>{{ record.invoice_number }}</td></tr>
    </table>
  </div>

  <div class="signature-block">
    <div class="signature-box">
      <p>Authorized Signature</p>
      <br><br>
      <p>{{ company_name }}</p>
    </div>
    <div class="signature-box">
      <p>Client Acknowledgment</p>
      <br><br>
      <p>{{ record.client.name }}</p>
    </div>
  </div>

  <div class="doc-footer">
    {{ company_name }} · {{ company_address }} · VAT: {{ company_vat }}<br>
    This invoice is generated electronically and is valid without a physical signature.
  </div>
</body>
</html>
"""

PROFORMA_INVOICE_HTML = INVOICE_HTML.replace('<div class="doc-title">INVOICE</div>', 
    '<div class="doc-title">PROFORMA INVOICE</div><div style="background:#fef3c7;border:1.5px solid #f59e0b;padding:8pt;text-align:center;font-weight:700;color:#92400e;margin-top:12pt;margin-bottom:12pt">⚠ PROFORMA — This is not a tax invoice. No payment is due until a formal invoice is issued.</div>')
CREDIT_NOTE_HTML = INVOICE_HTML.replace('<div class="doc-title">INVOICE</div>', '<div class="doc-title">CREDIT NOTE</div>').replace('TOTAL DUE', 'CREDIT AMOUNT')
VENDOR_BILL_HTML = INVOICE_HTML.replace('<div class="doc-title">INVOICE</div>', '<div class="doc-title">VENDOR BILL</div>').replace('Bill To', 'From Vendor')

PAYMENT_RECEIPT_HTML = """
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Receipt {{ record.id }}</title></head>
<body>
  <div class="doc-header">
    <div>
      {% if record.logo_url %}<img class="company-logo" src="{{ record.logo_url }}" alt="Logo">{% endif %}
      <div class="doc-title">PAYMENT RECEIPT</div>
      <div class="doc-meta"># {{ record.id }}</div>
    </div>
    <div class="company-info">
      <strong>{{ company_name }}</strong><br>
      {{ company_address }}<br>
      VAT: {{ company_vat }}
    </div>
  </div>

  <div style="border: 2px solid #10b981; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
    <h1 style="color: #059669; margin-bottom: 10px;">PAID IN FULL</h1>
    <p style="font-size: 14pt;"><strong>Amount Received:</strong> {{ record.currency|default:'$' }} {{ record.amount|floatformat:2 }}</p>
    <p><strong>Payment Date:</strong> {{ record.payment_date|date:"d M Y" }}</p>
    <p><strong>Payment Method:</strong> {{ record.payment_method }}</p>
  </div>

  <div class="address-block">
    <div class="address-box">
      <h4>Received From</h4>
      <p><strong>{{ record.client.name }}</strong></p>
    </div>
    <div class="address-box" style="text-align:right">
      <h4>Invoice Reference</h4>
      <p><strong>Invoice #:</strong> {{ record.invoice.invoice_number }}</p>
    </div>
  </div>

  <div class="signature-block">
    <div class="signature-box">
      <p>Authorized Signature</p><br><br><p>{{ company_name }}</p>
    </div>
  </div>
</body>
</html>
"""

CLIENT_STATEMENT_HTML = """
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Statement {{ record.name }}</title></head>
<body>
  <div class="doc-header">
    <div>
      <div class="doc-title">CLIENT ACCOUNT STATEMENT</div>
      <div class="doc-meta">Period: {{ period_start|default:'---' }} to {{ period_end|default:'---' }}</div>
    </div>
    <div class="company-info">
      <strong>{{ company_name }}</strong><br>
      {{ company_address }}<br>
      {{ company_email }}
    </div>
  </div>

  <div class="address-block">
    <div class="address-box">
      <h4>Client Details</h4>
      <p><strong>{{ record.name }}</strong><br>{{ record.email }}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Reference</th>
        <th style="text-align:right">Debit</th>
        <th style="text-align:right">Credit</th>
        <th style="text-align:right">Balance</th>
      </tr>
    </thead>
    <tbody>
      {% for inv in invoices %}
      <tr>
        <td>{{ inv.issue_date|date:"Y-m-d" }}</td>
        <td>{{ inv.invoice_number }}</td>
        <td style="text-align:right">{{ inv.total_amount|floatformat:2 }}</td>
        <td style="text-align:right">0.00</td>
        <td style="text-align:right">{{ inv.total_amount|floatformat:2 }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</body>
</html>
"""

QUOTATION_HTML = INVOICE_HTML.replace('<div class="doc-title">INVOICE</div>', 
    '<div class="doc-title">{% if record.status == "draft" %}QUOTATION{% else %}SALES ORDER{% endif %}</div>').replace('TOTAL DUE', 'TOTAL')

PO_HTML = """
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>PO {{ record.name }}</title></head>
<body>
  <div class="doc-header">
    <div>
      <div class="doc-title">PURCHASE ORDER</div>
      <div class="doc-meta"># {{ record.name }}</div>
    </div>
    <div class="company-info">
      <strong>{{ company_name }}</strong><br>{{ company_address }}
    </div>
  </div>
  <div class="address-block">
    <div class="address-box">
      <h4>To Vendor</h4>
      <p><strong>{{ record.partner.name }}</strong></p>
    </div>
    <div class="address-box" style="text-align:right">
      <h4>PO Details</h4>
      <p>Date: {{ record.date_order|date:"Y-m-d" }}</p>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Qty</th>
        <th style="text-align:right">Unit Price</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>
      {% for line in record.lines.all %}
      <tr>
        <td>{{ line.product.name }}</td>
        <td>{{ line.product_qty }}</td>
        <td style="text-align:right">{{ line.price_unit }}</td>
        <td style="text-align:right">{{ line.price_subtotal }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
  <div class="totals-section">
    <table class="totals-table">
      <tr class="grand-total"><td>Total</td><td style="text-align:right">{{ record.amount_total }}</td></tr>
    </table>
  </div>
</body>
</html>
"""

RFQ_HTML = PO_HTML.replace('<div class="doc-title">PURCHASE ORDER</div>', '<div class="doc-title">REQUEST FOR QUOTATION</div>')
DELIVERY_NOTE_HTML = """
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Delivery Note {{ record.name }}</title></head>
<body>
  <div class="doc-header">
    <div>
      <div class="doc-title">DELIVERY NOTE</div>
      <div class="doc-meta"># {{ record.name }}</div>
    </div>
    <div class="company-info">
      <strong>{{ company_name }}</strong><br>{{ company_address }}
    </div>
  </div>
  <div class="address-block">
    <div class="address-box">
      <h4>Ship To</h4>
      <p><strong>{{ record.partner.name }}</strong></p>
    </div>
    <div class="address-box" style="text-align:right">
      <h4>Delivery Details</h4>
      <p>Scheduled Date: {{ record.scheduled_date|date:"Y-m-d" }}<br>State: {{ record.state }}</p>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Ordered Qty</th>
        <th>Delivered Qty</th>
      </tr>
    </thead>
    <tbody>
      {% for line in record.move_lines.all %}
      <tr>
        <td>{{ line.product.name }}</td>
        <td>{{ line.product_uom_qty }}</td>
        <td>{{ line.quantity_done }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
  <div class="signature-block">
    <div class="signature-box"><p>Received in good condition</p><br><br><p>Signature / Date</p></div>
  </div>
</body>
</html>
"""

GRN_HTML = DELIVERY_NOTE_HTML.replace('DELIVERY NOTE', 'GOODS RECEIPT NOTE').replace('Ship To', 'From Vendor')
PICKING_LIST_HTML = DELIVERY_NOTE_HTML.replace('DELIVERY NOTE', 'PICKING LIST')
COUNT_SHEET_HTML = """
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Count Sheet</title></head>
<body>
  <div class="doc-header">
    <div>
      <div class="doc-title">INVENTORY COUNT SHEET</div>
      <div class="doc-meta">Date: {% now "Y-m-d" %}</div>
    </div>
    <div class="company-info"><strong>{{ company_name }}</strong></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Location</th>
        <th>Expected Qty</th>
        <th>Counted Qty</th>
      </tr>
    </thead>
    <tbody>
      {% for line in record.lines.all %}
      <tr>
        <td>{{ line.product.name }}</td>
        <td>{{ line.location.name }}</td>
        <td>{{ line.theoretical_qty }}</td>
        <td></td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
  <div class="signature-block">
    <div class="signature-box"><p>Counter Signature</p><br><br></div>
  </div>
</body>
</html>
"""

PAYSLIP_HTML = """
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Payslip</title></head>
<body>
  <div class="doc-header">
    <div><div class="doc-title">PAYSLIP</div></div>
    <div class="company-info"><strong>{{ company_name }}</strong></div>
  </div>
  <div class="address-block">
    <div class="address-box">
      <h4>Employee</h4>
      <p><strong>{{ record.employee.name }}</strong><br>{{ record.employee.job_title }}</p>
    </div>
  </div>
  <table>
    <thead><tr><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
    <tbody>
      {% for line in record.lines.all %}
      <tr><td>{{ line.name }}</td><td style="text-align:right">{{ line.total|floatformat:2 }}</td></tr>
      {% endfor %}
    </tbody>
  </table>
</body>
</html>
"""

EMP_CONTRACT_HTML = """
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Contract</title></head>
<body>
  <div class="doc-header">
    <div><div class="doc-title">EMPLOYMENT CONTRACT</div></div>
    <div class="company-info"><strong>{{ company_name }}</strong></div>
  </div>
  <div style="margin-bottom:20px;">
    <p>This contract is between <strong>{{ company_name }}</strong> (Employer) and <strong>{{ record.employee.name }}</strong> (Employee).</p>
    <p>Start Date: {{ record.start_date|date:"Y-m-d" }}</p>
    <p>Wage: {{ record.wage }}</p>
  </div>
  <div class="signature-block">
    <div class="signature-box"><p>Employer Signature</p><br><br></div>
    <div class="signature-box"><p>Employee Signature</p><br><br></div>
  </div>
</body>
</html>
"""

LEAVE_CERT_HTML = """
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Leave Certificate</title></head>
<body>
  <div class="doc-header">
    <div><div class="doc-title">LEAVE APPROVAL CERTIFICATE</div></div>
    <div class="company-info"><strong>{{ company_name }}</strong></div>
  </div>
  <div style="margin-bottom:20px;">
    <p>Employee: <strong>{{ record.employee.name }}</strong></p>
    <p>From: {{ record.date_from|date:"Y-m-d" }} To: {{ record.date_to|date:"Y-m-d" }}</p>
    <p>Status: {{ record.state }}</p>
  </div>
</body>
</html>
"""

EXPENSE_HTML = """
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Expense Report</title></head>
<body>
  <div class="doc-header">
    <div><div class="doc-title">EXPENSE REPORT</div><div class="doc-meta">{{ record.name }}</div></div>
    <div class="company-info"><strong>{{ company_name }}</strong></div>
  </div>
  <div style="margin-bottom:20px;">
    <p>Employee: <strong>{{ record.employee.name }}</strong></p>
    <p>Total Amount: {{ record.total_amount }}</p>
  </div>
</body>
</html>
"""

APPRAISAL_HTML = """
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Appraisal</title></head>
<body>
  <div class="doc-header">
    <div><div class="doc-title">PERFORMANCE APPRAISAL</div></div>
    <div class="company-info"><strong>{{ company_name }}</strong></div>
  </div>
  <div style="margin-bottom:20px;">
    <p>Employee: <strong>{{ record.employee.name }}</strong></p>
    <p>Date: {{ record.date|date:"Y-m-d" }}</p>
  </div>
</body>
</html>
"""

VAT_REPORT_HTML = """
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>VAT Report</title></head>
<body>
  <div class="doc-header">
    <div><div class="doc-title">VAT / TAX RETURN REPORT</div></div>
    <div class="company-info"><strong>{{ company_name }}</strong><br>VAT: {{ company_vat }}</div>
  </div>
  <table>
    <thead><tr><th>Tax Name</th><th style="text-align:right">Taxable Base</th><th style="text-align:right">Tax Amount</th></tr></thead>
    <tbody>
      {% for tax in report_data.taxes %}
      <tr><td>{{ tax.name }}</td><td style="text-align:right">{{ tax.base|floatformat:2 }}</td><td style="text-align:right">{{ tax.amount|floatformat:2 }}</td></tr>
      {% endfor %}
    </tbody>
  </table>
</body>
</html>
"""

JOURNAL_VOUCHER_HTML = """
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Journal Voucher</title></head>
<body>
  <div class="doc-header">
    <div><div class="doc-title">JOURNAL VOUCHER</div><div class="doc-meta">{{ record.name }}</div></div>
    <div class="company-info"><strong>{{ company_name }}</strong></div>
  </div>
  <table>
    <thead><tr><th>Account</th><th style="text-align:right">Debit</th><th style="text-align:right">Credit</th></tr></thead>
    <tbody>
      {% for line in record.lines.all %}
      <tr><td>{{ line.account.name }}</td><td style="text-align:right">{{ line.debit|floatformat:2 }}</td><td style="text-align:right">{{ line.credit|floatformat:2 }}</td></tr>
      {% endfor %}
    </tbody>
  </table>
</body>
</html>
"""

INCIDENT_HTML = """
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Security Incident</title></head>
<body>
  <div class="doc-header">
    <div><div class="doc-title">SECURITY INCIDENT REPORT</div><div class="doc-meta"># {{ record.id }}</div></div>
    <div class="company-info"><strong>{{ company_name }}</strong></div>
  </div>
  <div style="margin-bottom:20px;">
    <p>Title: <strong>{{ record.title }}</strong></p>
    <p>Severity: {{ record.severity }}</p>
    <p>Status: {{ record.status }}</p>
    <p>Description: {{ record.description }}</p>
  </div>
</body>
</html>
"""

class Command(BaseCommand):
    help = 'Seeds full production-ready HTML/CSS report templates for all tenants'

    def handle(self, *args, **kwargs):
        tenants = Tenant.objects.all()
        if not tenants:
            self.stdout.write(self.style.WARNING("No tenants found to seed templates for."))
            return

        templates = [
            {'name': 'Default Invoice', 'model': 'accounting.Invoice', 'type': 'invoice', 'html': INVOICE_HTML},
            {'name': 'Proforma Invoice', 'model': 'accounting.Invoice', 'type': 'proforma', 'html': PROFORMA_INVOICE_HTML},
            {'name': 'Credit Note', 'model': 'accounting.CreditNote', 'type': 'credit_note', 'html': CREDIT_NOTE_HTML},
            {'name': 'Vendor Bill', 'model': 'accounting.VendorBill', 'type': 'vendor_bill', 'html': VENDOR_BILL_HTML},
            {'name': 'Payment Receipt', 'model': 'accounting.Payment', 'type': 'receipt', 'html': PAYMENT_RECEIPT_HTML},
            {'name': 'Client Statement', 'model': 'crm.Client', 'type': 'statement', 'html': CLIENT_STATEMENT_HTML},
            {'name': 'Sales Order', 'model': 'sale.SaleOrder', 'type': 'quotation', 'html': QUOTATION_HTML},
            {'name': 'Purchase Order', 'model': 'purchase.PurchaseOrder', 'type': 'purchase_order', 'html': PO_HTML},
            {'name': 'Request for Quotation', 'model': 'purchase.RFQ', 'type': 'rfq', 'html': RFQ_HTML},
            {'name': 'Delivery Note', 'model': 'stock.StockPicking', 'type': 'delivery_note', 'html': DELIVERY_NOTE_HTML},
            {'name': 'Goods Receipt Note', 'model': 'stock.GoodsReceipt', 'type': 'grn', 'html': GRN_HTML},
            {'name': 'Picking List', 'model': 'stock.StockPicking', 'type': 'picking_list', 'html': PICKING_LIST_HTML},
            {'name': 'Count Sheet', 'model': 'stock.StockAdjustment', 'type': 'count_sheet', 'html': COUNT_SHEET_HTML},
            {'name': 'Payslip', 'model': 'hr_payroll.Payslip', 'type': 'payslip', 'html': PAYSLIP_HTML},
            {'name': 'Employment Contract', 'model': 'hr.EmployeeContract', 'type': 'contract', 'html': EMP_CONTRACT_HTML},
            {'name': 'Leave Certificate', 'model': 'hr_holidays.LeaveRequest', 'type': 'leave_cert', 'html': LEAVE_CERT_HTML},
            {'name': 'Expense Report', 'model': 'accounting.Expense', 'type': 'expense', 'html': EXPENSE_HTML},
            {'name': 'Appraisal', 'model': 'hr_appraisal.Appraisal', 'type': 'appraisal', 'html': APPRAISAL_HTML},
            {'name': 'VAT Report', 'model': 'accounting.VATReport', 'type': 'vat_report', 'html': VAT_REPORT_HTML},
            {'name': 'Journal Voucher', 'model': 'accounting.JournalEntry', 'type': 'journal', 'html': JOURNAL_VOUCHER_HTML},
            {'name': 'Incident Report', 'model': 'soc.Incident', 'type': 'incident', 'html': INCIDENT_HTML},
        ]

        created_count = 0
        updated_count = 0
        
        for tenant in tenants:
            for tpl in templates:
                obj, created = ReportTemplate.objects.update_or_create(
                    tenant=tenant,
                    name=tpl['name'],
                    model=tpl['model'],
                    defaults={
                        'is_default': True,
                        'is_active': True,
                        'html_content': tpl['html'],
                        'css_content': GLOBAL_CSS,
                    }
                )
                if created:
                    created_count += 1
                else:
                    updated_count += 1
                    
        self.stdout.write(self.style.SUCCESS(f"Successfully seeded: {created_count} created, {updated_count} updated."))
