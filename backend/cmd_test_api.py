from django.test import Client
from apps.users.domain.models import User
c = Client()
u = User.objects.filter(is_superuser=True).first()
if not u:
    u = User.objects.first()
c.force_login(u)
res = c.get('/api/v1/users/roles/')
print('STATUS:', res.status_code)
print('DATA:', res.json())
