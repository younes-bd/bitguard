import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.tenants.models import Tenant
from apps.crm.domain.models import Client
from apps.core.domain.models import Partner
from apps.reporting.domain.models import ReportTemplate

print("=== TENANTS ===")
for t in Tenant.objects.all():
    print(f"ID: {t.id} | Domain: '{t.domain}' | Name: {t.name}")

print("\n=== CLIENTS ===")
for c in Client.objects.all():
    print(f"Name: {c.name} | Tenant Domain: '{c.tenant.domain if c.tenant else None}'")

print("\n=== PARTNERS (Vendors) ===")
for p in Partner.objects.all():
    print(f"Name: {p.name} | Type: {p.partner_type} | Tenant Domain: '{p.tenant.domain if p.tenant else None}'")

print("\n=== TEMPLATES ===")
for tpl in ReportTemplate.objects.all():
    print(f"Name: {tpl.name} | Tenant Domain: '{tpl.tenant.domain if tpl.tenant else None}'")
