import os
import django
import sys

project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import json

User = get_user_model()
user = User.objects.first()

if not user:
    print("No user found!")
    sys.exit(1)

refresh = RefreshToken.for_user(user)
access_token = str(refresh.access_token)

client = Client()
response = client.get(
    '/api/erp/dashboard/',
    HTTP_AUTHORIZATION=f'Bearer {access_token}'
)

print(f"Status Code: {response.status_code}")
try:
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error parsing JSON: {e}")
    print(response.content.decode('utf-8'))
