import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from apps.system.application.services import SettingsService
from apps.system.registry import settings_registry
from apps.users.domain.models import User
from rest_framework.exceptions import ValidationError

print("Registered Settings:", list(settings_registry.get_all().keys()))

user = User.objects.first()
service = SettingsService()

try:
    print("Testing valid key: accounting.multi_currency")
    service.update_setting('accounting.multi_currency', 'true', user=user, tenant=user.tenant)
    print("SUCCESS: Valid key updated.")
except ValidationError as e:
    print(f"FAILED: {e}")

try:
    print("Testing INVALID key: accounting.garbage_key")
    service.update_setting('accounting.garbage_key', 'true', user=user, tenant=user.tenant)
    print("SUCCESS: Invalid key updated (THIS SHOULD NOT HAPPEN).")
except ValidationError as e:
    print(f"SUCCESS (Expected Failure): {e}")

