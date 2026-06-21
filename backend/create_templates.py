import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.reporting.domain.models import ReportTemplate
from apps.tenants.domain.models import Tenant

tenants = Tenant.objects.all()
if not tenants:
    print("No tenants found.")
    exit(1)

with open('apps/erp/templates/erp/invoice_pdf.html', 'r', encoding='utf-8') as f:
    invoice_html = f.read()

def get_html(title, extra_content=""):
    return f"""<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: sans-serif; color: #333; }}
        .header {{ border-bottom: 2px solid #333; margin-bottom: 20px; }}
        .content {{ line-height: 1.6; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>{title}</h1>
    </div>
    <div class="content">
        {extra_content}
    </div>
</body>
</html>"""

templates = [
    {
        'name': 'Standard Invoice',
        'model': 'accounting.Invoice',
        'is_default': True,
        'html': invoice_html,
        'css': ''
    },
    {
        'name': 'Purchase Order',
        'model': 'scm.PurchaseOrder',
        'is_default': True,
        'html': get_html("PURCHASE ORDER {{ record.po_number }}", "<p><strong>Vendor:</strong> {{ record.vendor.name }}</p><p><strong>Order Date:</strong> {{ record.order_date }}</p><p><strong>Total Amount:</strong> {{ record.total_amount }}</p>"),
        'css': ''
    },
    {
        'name': 'Delivery Note',
        'model': 'erp.DeliveryNote',
        'is_default': True,
        'html': get_html("DELIVERY NOTE {{ record.dn_number }}", "<p><strong>Date:</strong> {{ record.delivery_date }}</p><p><strong>Status:</strong> {{ record.status }}</p>"),
        'css': ''
    },
    {
        'name': 'PaySlip',
        'model': 'hrm.PaySlip',
        'is_default': True,
        'html': get_html("PAYSLIP", "<p><strong>Employee:</strong> {{ record.employee.user.get_full_name }}</p><p><strong>Net Pay:</strong> {{ record.net_pay }}</p>"),
        'css': ''
    },
    {
        'name': 'Quotation',
        'model': 'contracts.Quote',
        'is_default': True,
        'html': get_html("QUOTATION", "<p><strong>Status:</strong> {{ record.status }}</p>"),
        'css': ''
    },
    {
        'name': 'Deal Proposal',
        'model': 'crm.Deal',
        'is_default': True,
        'html': get_html("DEAL PROPOSAL: {{ record.title }}", "<p><strong>Client:</strong> {{ record.client.name }}</p><p><strong>Amount:</strong> {{ record.amount }}</p>"),
        'css': ''
    },
    {
        'name': 'Client Statement',
        'model': 'crm.Client',
        'is_default': True,
        'html': get_html("CLIENT STATEMENT: {{ record.name }}", "<p><strong>Email:</strong> {{ record.email }}</p><p><strong>Status:</strong> {{ record.status }}</p>"),
        'css': ''
    },
    {
        'name': 'Expense Report',
        'model': 'accounting.Expense',
        'is_default': True,
        'html': get_html("EXPENSE REPORT: {{ record.title }}", "<p><strong>Amount:</strong> {{ record.amount }}</p><p><strong>Date:</strong> {{ record.incurred_date }}</p>"),
        'css': ''
    },
    {
        'name': 'Credit Note',
        'model': 'accounting.CreditNote',
        'is_default': True,
        'html': get_html("CREDIT NOTE {{ record.credit_number }}", "<p><strong>Amount:</strong> {{ record.amount }}</p><p><strong>Reason:</strong> {{ record.reason }}</p>"),
        'css': ''
    },
    {
        'name': 'Vendor Bill',
        'model': 'accounting.VendorBill',
        'is_default': True,
        'html': get_html("VENDOR BILL {{ record.bill_number }}", "<p><strong>Total Amount:</strong> {{ record.total_amount }}</p><p><strong>Due Date:</strong> {{ record.due_date }}</p>"),
        'css': ''
    },
    {
        'name': 'Request For Quotation (RFQ)',
        'model': 'scm.RFQ',
        'is_default': True,
        'html': get_html("REQUEST FOR QUOTATION {{ record.rfq_number }}", "<p><strong>Date:</strong> {{ record.date }}</p><p><strong>Deadline:</strong> {{ record.deadline }}</p>"),
        'css': ''
    },
    {
        'name': 'Goods Receipt',
        'model': 'scm.GoodsReceipt',
        'is_default': True,
        'html': get_html("GOODS RECEIPT {{ record.receipt_number }}", "<p><strong>Received Date:</strong> {{ record.received_date }}</p><p><strong>Status:</strong> {{ record.status }}</p>"),
        'css': ''
    },
    {
        'name': 'Employee Profile',
        'model': 'hrm.Employee',
        'is_default': True,
        'html': get_html("EMPLOYEE PROFILE", "<p><strong>Name:</strong> {{ record.user.get_full_name }}</p><p><strong>Job Title:</strong> {{ record.job_title }}</p>"),
        'css': ''
    },
    {
        'name': 'Employment Contract',
        'model': 'hrm.EmployeeContract',
        'is_default': True,
        'html': get_html("EMPLOYMENT CONTRACT", "<p><strong>Employee:</strong> {{ record.employee.user.get_full_name }}</p><p><strong>Start Date:</strong> {{ record.start_date }}</p>"),
        'css': ''
    },
    {
        'name': 'Master Services Agreement',
        'model': 'contracts.ServiceContract',
        'is_default': True,
        'html': get_html("MASTER SERVICES AGREEMENT", "<p><strong>Client:</strong> {{ record.client.name }}</p><p><strong>Start Date:</strong> {{ record.start_date }}</p>"),
        'css': ''
    },
    {
        'name': 'Statement of Work',
        'model': 'projects.Project',
        'is_default': True,
        'html': get_html("STATEMENT OF WORK: {{ record.name }}", "<p><strong>Manager:</strong> {{ record.manager.get_full_name }}</p><p><strong>Budget:</strong> {{ record.budget }}</p>"),
        'css': ''
    },
    {
        'name': 'Asset Handover',
        'model': 'itam.Asset',
        'is_default': True,
        'html': get_html("ASSET ASSIGNMENT", "<p><strong>Asset Name:</strong> {{ record.name }}</p><p><strong>Tag:</strong> {{ record.asset_tag }}</p><p><strong>Serial:</strong> {{ record.serial_number }}</p>"),
        'css': ''
    },
    {
        'name': 'Order Receipt',
        'model': 'store.Order',
        'is_default': True,
        'html': get_html("ORDER RECEIPT", "<p><strong>Order ID:</strong> {{ record.id }}</p><p><strong>Total Amount:</strong> {{ record.total_amount }}</p><p><strong>Status:</strong> {{ record.status }}</p>"),
        'css': ''
    },
    {
        'name': 'Support Ticket Summary',
        'model': 'support.Ticket',
        'is_default': True,
        'html': get_html("SUPPORT TICKET: {{ record.title }}", "<p><strong>Status:</strong> {{ record.status }}</p><p><strong>Priority:</strong> {{ record.priority }}</p><p><strong>Description:</strong> {{ record.description }}</p>"),
        'css': ''
    },
    {
        'name': 'CAB Report (Change Request)',
        'model': 'itsm.ChangeRequest',
        'is_default': True,
        'html': get_html("CHANGE ADVISORY BOARD REPORT", "<p><strong>Change Request:</strong> {{ record.title }}</p><p><strong>Impact:</strong> {{ record.impact }}</p><p><strong>Risk Level:</strong> {{ record.risk_level }}</p>"),
        'css': ''
    },
    {
        'name': 'Service Request Form',
        'model': 'itsm.ServiceRequest',
        'is_default': True,
        'html': get_html("SERVICE REQUEST", "<p><strong>Title:</strong> {{ record.title }}</p><p><strong>Requested By:</strong> {{ record.requested_by.username }}</p><p><strong>Status:</strong> {{ record.status }}</p>"),
        'css': ''
    },
    {
        'name': 'Payment Receipt',
        'model': 'accounting.Payment',
        'is_default': True,
        'html': get_html("PAYMENT RECEIPT", "<p><strong>Amount Paid:</strong> {{ record.amount }}</p><p><strong>Payment Date:</strong> {{ record.payment_date }}</p><p><strong>Method:</strong> {{ record.payment_method }}</p>"),
        'css': ''
    },
    {
        'name': 'Journal Voucher',
        'model': 'accounting.JournalEntry',
        'is_default': True,
        'html': get_html("JOURNAL VOUCHER", "<p><strong>Entry Number:</strong> {{ record.entry_number }}</p><p><strong>Date:</strong> {{ record.date }}</p><p><strong>Total Debit:</strong> {{ record.total_debit }}</p><p><strong>Total Credit:</strong> {{ record.total_credit }}</p>"),
        'css': ''
    },
    {
        'name': 'Time-Off Certificate',
        'model': 'hrm.LeaveRequest',
        'is_default': True,
        'html': get_html("LEAVE APPROVAL CERTIFICATE", "<p><strong>Employee:</strong> {{ record.employee.user.get_full_name }}</p><p><strong>Leave Type:</strong> {{ record.leave_type }}</p><p><strong>Dates:</strong> {{ record.start_date }} to {{ record.end_date }}</p>"),
        'css': ''
    },
    {
        'name': 'Performance Appraisal Report',
        'model': 'hrm.Appraisal',
        'is_default': True,
        'html': get_html("PERFORMANCE APPRAISAL", "<p><strong>Employee:</strong> {{ record.employee.user.get_full_name }}</p><p><strong>Review Period:</strong> {{ record.review_period }}</p><p><strong>Score:</strong> {{ record.overall_score }}</p>"),
        'css': ''
    },
    {
        'name': 'Vendor Assessment Profile',
        'model': 'scm.Vendor',
        'is_default': True,
        'html': get_html("VENDOR PROFILE: {{ record.name }}", "<p><strong>Contact Name:</strong> {{ record.contact_name }}</p><p><strong>Email:</strong> {{ record.email }}</p><p><strong>Rating:</strong> {{ record.rating }} / 5</p>"),
        'css': ''
    },
    {
        'name': 'Security Incident Report',
        'model': 'soc.Incident',
        'is_default': True,
        'html': get_html("SECURITY INCIDENT REPORT", "<p><strong>Title:</strong> {{ record.title }}</p><p><strong>Severity:</strong> {{ record.severity }}</p><p><strong>Status:</strong> {{ record.status }}</p><p><strong>Description:</strong> {{ record.description }}</p>"),
        'css': ''
    }
]

for tenant in tenants:
    for t in templates:
        ReportTemplate.objects.update_or_create(
            tenant=tenant,
            model=t['model'],
            name=t['name'],
            defaults={
                'html_content': t['html'].strip(),
                'css_content': t['css'].strip(),
                'is_default': t['is_default'],
                'is_active': True
            }
        )
        print(f"Created template: {t['name']} for {t['model']} under tenant {tenant.name}")
