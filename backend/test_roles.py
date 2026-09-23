import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from django.test.client import RequestFactory
from apps.users.api.views import RoleViewSet
from apps.users.domain.models import User
factory = RequestFactory()
request = factory.get('/api/v1/users/roles/')
u = User.objects.filter(is_superuser=True).first()
if not u: u = User.objects.first()
request.user = u
request.tenant = getattr(u, 'tenant', None)
view = RoleViewSet.as_view({'get': 'list'})
response = view(request)
response.render()
print(response.status_code)
print(response.content.decode('utf-8')[:500])
