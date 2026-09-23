import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from apps.automation.domain.models import WebhookEndpoint
try:
    print("COUNT:", WebhookEndpoint.objects.count())
except Exception as e:
    import traceback
    traceback.print_exc()
