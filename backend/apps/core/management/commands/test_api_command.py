from django.core.management.base import BaseCommand
from django.test import Client
from apps.users.domain.models import User
from apps.tenants.domain.models import Tenant
from apps.core.domain.models import Country, State

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        c = Client()
        tenant = Tenant.objects.first()
        user = User.objects.first()
        user.tenant_memberships.get_or_create(tenant=tenant)
        c.force_login(user)

        country = Country.all_objects.filter(code='US').first()
        print('Country US ID:', country.id)

        response = c.get(f'/api/v1/core/states/?country={country.id}', HTTP_X_TENANT_ID=str(tenant.id))
        print('STATES STATUS:', response.status_code)
        import json
        if response.status_code == 200:
            data = json.loads(response.content)
            if isinstance(data, list): print('States length:', len(data))
            elif 'results' in data: print('States results length:', len(data['results']))

        response = c.get(f'/api/v1/core/currencies/', HTTP_X_TENANT_ID=str(tenant.id))
        print('CURRENCIES STATUS:', response.status_code)
        if response.status_code == 200:
            data = json.loads(response.content)
            if isinstance(data, list): print('Currencies length:', len(data))
            elif 'results' in data: print('Currencies results length:', len(data['results']), 'Total count:', data.get('count'))

        response = c.get(f'/api/v1/core/countries/', HTTP_X_TENANT_ID=str(tenant.id))
        print('COUNTRIES STATUS:', response.status_code)
        if response.status_code == 200:
            data = json.loads(response.content)
            if isinstance(data, list): print('Countries length:', len(data))
            elif 'results' in data: print('Countries results length:', len(data['results']), 'Total count:', data.get('count'))
