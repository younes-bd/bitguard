from apps.users.api.views import RoleViewSet
from django.test import RequestFactory
from apps.users.domain.models import User
factory = RequestFactory()
request = factory.get('/api/v1/users/roles/')
u = User.objects.first()
request.user = u
request.tenant = getattr(u, 'tenant', None)

view = RoleViewSet.as_view({'get': 'list'})
response = view(request)
response.render()
print(response.content.decode('utf-8'))
