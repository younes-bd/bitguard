import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from django.db import connection
from apps.core.domain.models import InstalledModule, Language, RecordRule

with connection.schema_editor() as editor:
    print("Creating InstalledModule...")
    try:
        editor.create_model(InstalledModule)
    except Exception as e:
        print(e)
    
    print("Creating Language...")
    try:
        editor.create_model(Language)
    except Exception as e:
        print(e)
        
    print("Creating RecordRule...")
    try:
        editor.create_model(RecordRule)
    except Exception as e:
        print(e)

print("Done.")
