import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from django.db import connection
from apps.core.domain.models import InstalledModule, Language
from apps.users.domain.models import RecordRule

print("Recreating missing tables...")
with connection.schema_editor() as editor:
    try:
        editor.create_model(InstalledModule)
        print("Created base_setup_installedmodule")
    except Exception as e:
        print("InstalledModule:", e)

    try:
        editor.create_model(Language)
        print("Created base_setup_language")
    except Exception as e:
        print("Language:", e)

    try:
        editor.create_model(RecordRule)
        print("Created users_recordrule")
    except Exception as e:
        print("RecordRule:", e)

print("Finished recreating tables.")
