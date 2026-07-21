import os
import django
import datetime
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.utils import timezone
from apps.tenants.domain.models import Tenant
from apps.reporting.domain.models import ReportTemplate, ReportEngineSettings
from apps.crm.domain.models import Client
from apps.core.domain.models import Partner
from apps.accounting.domain.models import Invoice, InvoiceItem

# ─── RESOLVE THE CORRECT INTERNAL TENANT ───────────────────────────────────
# UUID sent by the frontend (from X-Tenant-ID header)
INTERNAL_UUID = "cfc72aac-52e3-44fb-847c-5041cbd1bda2"

try:
    tenant = Tenant.objects.get(id=INTERNAL_UUID)
    print(f"✅ Found internal tenant: '{tenant.name}' (domain: {tenant.domain})")
except Tenant.DoesNotExist:
    print(f"❌ ERROR: Cannot find tenant with ID {INTERNAL_UUID}")
    print("Available tenants:")
    for t in Tenant.objects.all():
        print(f"  - {t.id} | {t.domain} | {t.name}")
    exit(1)

# ─── SEED CLIENTS ──────────────────────────────────────────────────────────
print("\n🔵 Seeding clients...")
client1, c1 = Client.objects.get_or_create(
    tenant=tenant, email='billing@cyberdyne.corp',
    defaults={'name': 'CyberDyne Systems', 'phone': '555-0100'}
)
client2, c2 = Client.objects.get_or_create(
    tenant=tenant, email='accounts@massive.dyn',
    defaults={'name': 'Massive Dynamic', 'phone': '555-0200'}
)
client3, c3 = Client.objects.get_or_create(
    tenant=tenant, email='finance@initech.com',
    defaults={'name': 'Initech Corp', 'phone': '555-0300'}
)
print(f"  {'✨ Created' if c1 else '✔ Exists'}: {client1.name}")
print(f"  {'✨ Created' if c2 else '✔ Exists'}: {client2.name}")
print(f"  {'✨ Created' if c3 else '✔ Exists'}: {client3.name}")

# ─── SEED VENDORS ──────────────────────────────────────────────────────────
print("\n🔵 Seeding vendors...")
vendor1, v1 = Partner.objects.get_or_create(
    tenant=tenant, email='sales@dell.com',
    defaults={'name': 'Dell Technologies', 'partner_type': 'vendor'}
)
vendor2, v2 = Partner.objects.get_or_create(
    tenant=tenant, email='enterprise@cisco.com',
    defaults={'name': 'Cisco Systems', 'partner_type': 'vendor'}
)
vendor3, v3 = Partner.objects.get_or_create(
    tenant=tenant, email='cloud@microsoft.com',
    defaults={'name': 'Microsoft Azure', 'partner_type': 'vendor'}
)
print(f"  {'✨ Created' if v1 else '✔ Exists'}: {vendor1.name}")
print(f"  {'✨ Created' if v2 else '✔ Exists'}: {vendor2.name}")
print(f"  {'✨ Created' if v3 else '✔ Exists'}: {vendor3.name}")

# ─── SEED INVOICES ─────────────────────────────────────────────────────────
print("\n🔵 Seeding invoices...")
today = timezone.now().date()

inv1, i1 = Invoice.objects.get_or_create(
    tenant=tenant, invoice_number='INV-2026-001',
    defaults={
        'client': client1, 'type': 'standard', 'status': 'sent',
        'issue_date': today, 'due_date': today + datetime.timedelta(days=30),
        'subtotal': Decimal('5000.00'), 'tax_total': Decimal('500.00'), 'total_amount': Decimal('5500.00')
    }
)
if i1:
    InvoiceItem.objects.get_or_create(
        invoice=inv1, description='Enterprise Firewall Setup',
        defaults={'quantity': 1, 'unit_price': Decimal('5000.00'), 'total': Decimal('5000.00')}
    )

inv2, i2 = Invoice.objects.get_or_create(
    tenant=tenant, invoice_number='INV-2026-002',
    defaults={
        'client': client2, 'type': 'standard', 'status': 'paid',
        'issue_date': today - datetime.timedelta(days=15),
        'due_date': today + datetime.timedelta(days=15),
        'subtotal': Decimal('12000.00'), 'tax_total': Decimal('1200.00'), 'total_amount': Decimal('13200.00')
    }
)
if i2:
    InvoiceItem.objects.get_or_create(
        invoice=inv2, description='Managed IT Services - 12 Month Retainer',
        defaults={'quantity': 12, 'unit_price': Decimal('1000.00'), 'total': Decimal('12000.00')}
    )

inv3, i3 = Invoice.objects.get_or_create(
    tenant=tenant, invoice_number='INV-2026-003',
    defaults={
        'client': client3, 'type': 'standard', 'status': 'overdue',
        'issue_date': today - datetime.timedelta(days=45),
        'due_date': today - datetime.timedelta(days=15),
        'subtotal': Decimal('8750.00'), 'tax_total': Decimal('875.00'), 'total_amount': Decimal('9625.00')
    }
)
if i3:
    InvoiceItem.objects.get_or_create(
        invoice=inv3, description='SOC Monitoring - Q1',
        defaults={'quantity': 1, 'unit_price': Decimal('8750.00'), 'total': Decimal('8750.00')}
    )

print(f"  {'✨ Created' if i1 else '✔ Exists'}: {inv1.invoice_number} ({inv1.status})")
print(f"  {'✨ Created' if i2 else '✔ Exists'}: {inv2.invoice_number} ({inv2.status})")
print(f"  {'✨ Created' if i3 else '✔ Exists'}: {inv3.invoice_number} ({inv3.status})")

# ─── SEED TEMPLATES ────────────────────────────────────────────────────────
print("\n🔵 Seeding report templates...")

ReportEngineSettings.objects.get_or_create(
    tenant=tenant,
    defaults={
        'paper_format': 'A4',
        'margin_top': 20, 'margin_bottom': 20,
        'margin_left': 15, 'margin_right': 15,
        'company_header_html': '<div style="border-bottom:2px solid #1a56db;padding-bottom:10px;margin-bottom:20px;display:flex;justify-content:space-between;"><div><h1 style="color:#1a56db;margin:0;font-size:28px;font-family:sans-serif;font-weight:900;">BITGUARD</h1><p style="margin:5px 0 0;color:#64748b;font-size:12px;font-family:sans-serif;">Enterprise IT & Security Solutions</p></div><div style="text-align:right;color:#475569;font-size:10px;font-family:sans-serif;"><strong>BitGuard Enterprise Solutions LLC</strong><br>123 Innovation Drive, Level 42<br>Silicon Valley, CA 94025<br>support@bitguard.tech</div></div>',
        'company_footer_html': '<div style="border-top:1px solid #e2e8f0;padding-top:10px;font-size:9px;color:#94a3b8;font-family:sans-serif;text-align:center;"><p>Registered Company No. 994455221 | VAT: US-994455221</p><p>Thank you for your business.</p></div>'
    }
)

ReportTemplate.objects.get_or_create(
    tenant=tenant, name='Standard Invoice',
    defaults={
        'model': 'accounting.Invoice',
        'html_content': '<h1>Invoice</h1>',
        'is_active': True, 'is_default': True
    }
)
ReportTemplate.objects.get_or_create(
    tenant=tenant, name='Professional Quotation',
    defaults={
        'model': 'accounting.Invoice',
        'html_content': '<h1>Quotation</h1>',
        'is_active': True
    }
)
print("  ✔ Templates and engine settings configured.")

print("\n✅ SUCCESS! All enterprise data is now seeded for BitGuard Internal System.")
print(f"   Tenant: {tenant.name} | Domain: {tenant.domain}")
print(f"   Clients: {Client.objects.filter(tenant=tenant).count()}")
print(f"   Vendors: {Partner.objects.filter(tenant=tenant, partner_type='vendor').count()}")
print(f"   Invoices: {Invoice.objects.filter(tenant=tenant).count()}")
print(f"   Templates: {ReportTemplate.objects.filter(tenant=tenant).count()}")
