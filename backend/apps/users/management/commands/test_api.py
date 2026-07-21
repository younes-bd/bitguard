import os
import sys

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

class Command(BaseCommand):
    help = 'Test the API endpoints'

    def handle(self, *args, **options):
        User = get_user_model()
        user = User.objects.filter(is_superuser=True).first()
        if not user:
            self.stdout.write("No superuser found.")
            return

        self.stdout.write(f"Testing as user: {user.email}")
        c = APIClient()
        c.force_authenticate(user=user)

        roles_resp = c.get('/api/v1/iam/roles/')
        self.stdout.write(f"Roles status: {roles_resp.status_code}")
        if roles_resp.status_code == 200:
            self.stdout.write(f"Roles count: {len(roles_resp.json().get('data', []))}")
        else:
            self.stdout.write(f"Roles err: {roles_resp.content}")

        settings_resp = c.get('/api/v1/base_setup/settings/')
        self.stdout.write(f"Settings status: {settings_resp.status_code}")
        if settings_resp.status_code == 200:
            data = settings_resp.json()
            if isinstance(data, dict):
                self.stdout.write(f"Settings data is dict, keys: {data.keys()}")
            else:
                self.stdout.write(f"Settings data is type: {type(data)}")
        else:
            self.stdout.write(f"Settings err: {settings_resp.content}")
