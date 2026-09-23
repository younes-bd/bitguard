import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from django.contrib.contenttypes.models import ContentType

print("All System ContentTypes in DB:")
cts = ContentType.objects.filter(app_label='system')
for ct in cts:
    print(f"- {ct.app_label}.{ct.model}")

# Let's see what models actually exist in the registry
from django.apps import apps
app_config = apps.get_app_config('system')
actual_models = [m._meta.model_name for m in app_config.get_models()]
print("\nActual models in system app registry:", actual_models)

# Delete stale ones
for ct in cts:
    if ct.model not in actual_models:
        print(f"Deleting stale content type: {ct.app_label}.{ct.model}")
        ct.delete()
