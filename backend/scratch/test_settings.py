import os
import sys
import django

# Add backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + '/../')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.system.api.views import SystemParameterViewSet
from django.test import RequestFactory
from apps.users.domain.models import User

user = User.objects.first()
factory = RequestFactory()
request = factory.get('/api/v1/system/settings/')
request.user = user

view = SystemParameterViewSet.as_view({'get': 'list'})
try:
    response = view(request)
    print("SUCCESS")
except Exception as e:
    import traceback
    traceback.print_exc()
