import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()
from apps.users.domain.models import User, Role

emp_role, _ = Role.objects.get_or_create(name='EMPLOYEE', defaults={'category': 'Internal'})
mgr_role, _ = Role.objects.get_or_create(name='MANAGER', defaults={'category': 'Internal'})
sales_role, _ = Role.objects.get_or_create(name='SALES_MANAGER', defaults={'category': 'Sales'})

users_without_roles = User.objects.filter(roles__isnull=True)
count = 0
for u in users_without_roles:
    u.roles.add(emp_role)
    if 'alice' in u.email or 'bob' in u.email:
        u.roles.add(mgr_role)
    if 'carlos' in u.email:
        u.roles.add(sales_role)
    count += 1
print(f'Assigned roles to {count} users.')
