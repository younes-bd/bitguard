from apps.users.models import User
u = User.objects.filter(email='admin@bitguard.tech').first()
if u:
    u.set_password('admin')
    u.is_superuser = True
    u.is_staff = True
    u.save()
    print('User updated')
else:
    User.objects.create_superuser(username='admin', email='admin@bitguard.tech', password='admin')
    print('User created')
