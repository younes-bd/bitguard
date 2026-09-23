from django.test import RequestFactory
from apps.system.api.views import InstalledModuleViewSet
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
request = RequestFactory().get('/api/v1/system/modules/')
request.user = type('User', (object,), {'is_authenticated': True, 'tenant': None})()
view = InstalledModuleViewSet.as_view({'get': 'list'})
response = view(request)
print(type(response.data))
if isinstance(response.data, list): print(len(response.data))
