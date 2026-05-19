import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.contrib.auth import get_user_model
from apps.users.serializers import UserSerializer

User = get_user_model()

print("--- User List ---")
print("--- All Users ---")
for u in User.objects.all():
    print(f"Email: {u.email:30} | Staff: {str(u.is_staff):5} | Super: {str(u.is_superuser):5}")

print("\n--- Final Check: admin@bitguard.tech Serialized ---")
try:
    u = User.objects.get(email='admin@bitguard.tech')
    print(json.dumps(UserSerializer(u).data, indent=2))
except Exception as e:
    print(f"Error: {e}")

user = User.objects.filter(email='admin@bitguard.tech').first()
if user:
    print(f"Found user: {user.email}")
    print(f"Password correct ('admin'): {user.check_password('admin')}")
else:
    print("User 'admin@bitguard.tech' NOT FOUND")
