import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()
from apps.users.domain.models import User, Role
print('--- USERS AND THEIR ROLES ---')
for u in User.objects.prefetch_related('roles').all():
    print(f'{u.email}: {[r.name for r in u.roles.all()]}')
