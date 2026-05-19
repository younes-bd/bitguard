import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.contrib.auth import authenticate
from apps.users.models import User
from apps.auth.serializers import CustomTokenObtainPairSerializer

print("--- Testing User Model ---")
try:
    u = User.objects.get(email='admin@bitguard.tech')
    print(f"User exists. is_active={u.is_active}, is_locked={u.is_locked}, check_password={u.check_password('admin')}")
except Exception as e:
    print("User fetch error:", e)

print("\n--- Testing authenticate() ---")
user = authenticate(email='admin@bitguard.tech', password='admin', username='admin@bitguard.tech')
print(f"Authenticated user: {user}")

print("\n--- Testing Serializer ---")
s = CustomTokenObtainPairSerializer(data={'email': 'admin@bitguard.tech', 'password': 'admin'})
if s.is_valid():
    print("Serializer is VALID")
    print(s.validated_data)
else:
    print("Serializer is INVALID")
    print(s.errors)
