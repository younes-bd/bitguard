from django.core.management.base import BaseCommand
from rest_framework.test import APIClient
from apps.users.domain.models import User

class Command(BaseCommand):
    def handle(self, *args, **options):
        client = APIClient()
        user = User.objects.filter(is_superuser=True).first()
        if not user:
             user = User.objects.first()
        client.force_authenticate(user=user)
        for url in ['/api/dashboard/metrics/', '/api/dashboard/health/', '/api/crm/clients/1/', '/api/audit/logs/']:
            response = client.get(url)
            if response.status_code == 500:
                print(f'GOT 500 for {url}!')
                print(response.content.decode())
            else:
                print(f'Status for {url}:', response.status_code)
