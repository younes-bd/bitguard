from django.core.management.base import BaseCommand
from django.test import RequestFactory
from apps.users.domain.models import User
from apps.system.api.views import ScheduledActionViewSet
from rest_framework.test import force_authenticate

class Command(BaseCommand):
    help = 'Debug ScheduledActionViewSet create'

    def handle(self, *args, **kwargs):
        # Find a superuser
        user = User.objects.filter(is_superuser=True).first()
        if not user:
            user = User.objects.first()
            
        self.stdout.write(f"Testing as user: {user.email} (Superuser: {user.is_superuser})")
        
        factory = RequestFactory()
        data = {
            "name": "Test Action",
            "model_name": "core.Partner",
            "method_name": "count",
            "interval_number": 1,
            "interval_type": "minutes",
            "is_active": True
        }
        
        request = factory.post('/api/v1/system/scheduled-actions/', data, content_type='application/json')
        force_authenticate(request, user=user)
        
        view = ScheduledActionViewSet.as_view({'post': 'create'})
        response = view(request)
        
        self.stdout.write(f"Status Code: {response.status_code}")
        if response.status_code >= 400:
            self.stdout.write(self.style.ERROR(f"Error Response: {response.data}"))
        else:
            self.stdout.write(self.style.SUCCESS(f"Success Response: {response.data}"))
