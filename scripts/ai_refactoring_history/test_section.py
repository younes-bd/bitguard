import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from apps.tenants.domain.models import Tenant
from apps.core.domain.models import CommandCenterSection

tenant = Tenant.objects.first()
print("Tenant:", tenant.name)

obj, created = CommandCenterSection.objects.get_or_create(
    tenant=tenant,
    name='Saless',
    defaults={'sequence': 99}
)
print("Created:", created, "Obj:", obj.name, "ID:", obj.id)
