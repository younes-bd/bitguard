import django, os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.users.models import User

email = 'admin@bitguard.tech'
password = 'Admin@123'

if User.objects.filter(email=email).exists():
    user = User.objects.get(email=email)
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.save()
    print(f'[UPDATED] Existing user reset: {user.email}')
else:
    user = User.objects.create_superuser(
        email=email,
        password=password,
        first_name='Admin',
        last_name='BitGuard',
    )
    print(f'[CREATED] Superuser: {user.email}')

print(f'  is_active:     {user.is_active}')
print(f'  is_staff:      {user.is_staff}')
print(f'  is_superuser:  {user.is_superuser}')
print(f'Login with: {email} / {password}')
