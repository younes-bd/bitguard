import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.domain.models import Role

print('Count before:', Role.objects.count())
try:
    Role.objects.create(name='TEST_ROLE')
except Exception as e:
    print('Error:', e)
print('Count after:', Role.objects.count())

