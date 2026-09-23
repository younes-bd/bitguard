import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from django.db import connection
from apps.core.domain.models import CommandCenterSection

print("Recreating CommandCenterSection...")
with connection.schema_editor() as editor:
    try:
        editor.create_model(CommandCenterSection)
        print("Created base_setup_commandcentersection")
    except Exception as e:
        print("Error:", e)
