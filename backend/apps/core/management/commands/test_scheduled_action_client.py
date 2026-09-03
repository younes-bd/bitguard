from django.core.management.base import BaseCommand
from django.test import Client
from apps.users.domain.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class Command(BaseCommand):
    help = 'Test API Client'

    def handle(self, *args, **kwargs):
        user = User.objects.filter(is_superuser=True).first()
        if not user:
            user = User.objects.first()
            
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        client = Client(HTTP_AUTHORIZATION=f'Bearer {access_token}', HTTP_X_TENANT_ID=str(user.tenant_id) if user.tenant_id else '')
        
        data = {
            "name": "Test Action HTTP",
            "model_name": "core.Partner",
            "method_name": "count",
            "interval_number": 1,
            "interval_type": "minutes",
            "is_active": True
        }
        
        self.stdout.write("Sending POST request to /api/v1/system/scheduled-actions/ ...")
        response = client.post(
            '/api/v1/system/scheduled-actions/',
            data,
            content_type='application/json'
        )
        
        self.stdout.write(f"Status Code: {response.status_code}")
        self.stdout.write(f"Response Content: {response.content.decode()}")
