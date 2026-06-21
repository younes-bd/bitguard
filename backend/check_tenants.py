import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.tenants.models import Tenant
from apps.reporting.domain.models import ReportTemplate
from apps.crm.domain.models import Client

print("Tenants:")
for t in Tenant.objects.all():
    print(f"- {t.id} | {t.name} | {t.domain}")

print("\nTemplates:")
for tpl in ReportTemplate.objects.all():
    print(f"- {tpl.name} | Tenant: {tpl.tenant.name if tpl.tenant else 'None'}")

print("\nClients:")
for c in Client.objects.all():
    print(f"- {c.name} | Tenant: {c.tenant.name if c.tenant else 'None'}")
