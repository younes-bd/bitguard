import os
import django
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from django.test import Client

c = Client(HTTP_X_TENANT_ID='bitguard.tech')
response = c.get('/api/v1/home/pages/')
print("Status Code:", response.status_code)
try:
    print("Response JSON:", response.json())
except Exception as e:
    print("Response Content:", response.content)
