from django.core.management.base import BaseCommand
from django.test import Client
from apps.users.domain.models import User
from apps.tenants.domain.models import Tenant
import json

class Command(BaseCommand):
    def handle(self, *args, **options):
        c = Client()
        tenant = Tenant.objects.first()
        user = User.objects.first()
        user.tenant_memberships.get_or_create(tenant=tenant)
        c.force_login(user)

        from apps.core.domain.models import Country, State
        from apps.core.domain.models import Currency
        country = Country.all_objects.filter(tenant__isnull=True).first()
        state = State.all_objects.filter(tenant__isnull=True).first()
        currency = Currency.all_objects.filter(tenant__isnull=True).first()

        payload = {
            "name": "Test Company Update",
            "country": str(country.id) if country else None,
            "state": str(state.id) if state else None,
            "default_currency": str(currency.id) if currency else None
        }

        response = c.patch(f'/api/v1/core/companies/my_company/', data=json.dumps(payload), content_type='application/json', HTTP_X_TENANT_ID=str(tenant.id))
        print('PATCH STATUS:', response.status_code)
        print(json.dumps(json.loads(response.content), indent=2))
