import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

# 1. Fix admin@bitguard.tech
try:
    admin = User.objects.get(email='admin@bitguard.tech')
    admin.is_staff = True
    admin.is_superuser = True
    admin.save()
    print(f"Fixed admin@bitguard.tech: Staff={admin.is_staff}, Super={admin.is_superuser}")
except User.DoesNotExist:
    print("admin@bitguard.tech not found!")

# 2. Create/Update younessb329@gmail.com
email = 'younessb329@gmail.com'
user, created = User.objects.get_or_create(email=email, defaults={'username': email})
user.set_password('admin')
user.is_staff = True
user.is_superuser = True
user.save()
print(f"{'Created' if created else 'Updated'} {email}: Staff={user.is_staff}, Super={user.is_superuser}")
