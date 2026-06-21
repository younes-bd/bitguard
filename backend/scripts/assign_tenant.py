import django, os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.users.models import User
from apps.tenants.models import Tenant

user = User.objects.get(email='admin@bitguard.tech')
tenant = Tenant.objects.first()

print(f"User tenant before: {getattr(user, 'tenant', None)}")

if hasattr(user, 'tenant'):
    user.tenant = tenant
    user.save()
    print(f"Assigned user to tenant: {tenant.name}")
elif hasattr(user, 'tenants'):
    user.tenants.add(tenant)
    print(f"Added user to tenant: {tenant.name}")
else:
    print("User model does not have tenant or tenants attribute!")
