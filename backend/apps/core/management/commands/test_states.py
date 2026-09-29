from django.core.management.base import BaseCommand
from django.test import Client
from apps.users.domain.models import User
from apps.tenants.domain.models import Tenant

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        c = Client()
        user = User.objects.first()
        tenant = Tenant.objects.first()
        if user and tenant:
            user.tenant = tenant
            user.save()
            c.force_login(user)
            response = c.get('/api/v1/core/states/?country=27976738-c560-4741-a765-4541d506198b', HTTP_X_TENANT_ID=str(tenant.id))
            self.stdout.write(f"STATUS: {response.status_code}")
            if response.status_code == 400:
                self.stdout.write(f"CONTENT: {response.content}")
        else:
            self.stdout.write("No user or tenant.")
