import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

# Delete badly created users if they exist
User.objects.filter(username='admin@bitguard.tech').delete()
User.objects.filter(email='admin@bitguard.tech').delete()
User.objects.filter(email='admin').delete()
User.objects.filter(username='admin').delete()

# Create correct user
from apps.tenants.domain.models import Tenant

tenant, _ = Tenant.objects.get_or_create(name='BitGuard', domain='bitguard.tech')

user = User.objects.create(
    username='admin@bitguard.tech',
    email='admin@bitguard.tech',
    is_staff=True,
    is_superuser=True,
    is_active=True,
    tenant=tenant
)
user.set_password('admin')
user.save()

print('Admin user strictly recreated successfully!')
