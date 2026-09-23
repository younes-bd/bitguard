import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

try:
    from apps.automation.api.views import WebhookEndpointViewSet
    from rest_framework.test import APIRequestFactory, force_authenticate
    from apps.users.domain.models import User

    factory = APIRequestFactory()
    request = factory.get('/api/v1/automation/webhook-endpoints/')
    user = User.objects.first()
    
    if user:
        force_authenticate(request, user=user)
        # also set tenant since custom middleware might do it
        request.tenant = getattr(user, 'tenant', None)
        view = WebhookEndpointViewSet.as_view({'get': 'list'})
        
        response = view(request)
        print("STATUS:", response.status_code)
        if hasattr(response, 'data'):
            print("DATA:", response.data)
        else:
            print("Response:", response.content)
    else:
        print("No users found.")
except Exception as e:
    import traceback
    traceback.print_exc()
