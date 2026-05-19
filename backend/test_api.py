import os
import django
import sys

project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from django.test import Client
from django.contrib.auth import get_user_model
import json

User = get_user_model()
user = User.objects.first()

client = Client()
client.force_login(user)

response = client.get('/api/erp/dashboard/')
print(f"Status Code: {response.status_code}")
try:
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error parsing JSON: {e}")
    print(response.content)
