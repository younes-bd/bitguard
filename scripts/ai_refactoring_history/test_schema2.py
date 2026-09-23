import os
import django
from django.conf import settings

settings.configure(
    DEBUG=True,
    INSTALLED_APPS=[
        'django.contrib.contenttypes',
        'django.contrib.auth',
        'apps.tenants',
        'apps.users',
        'apps.core',
    ],
    DATABASES={
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:',
        }
    }
)
django.setup()
from django.db import connection
from apps.core.domain.models import InstalledModule, Language
from apps.users.domain.models import RecordRule

with connection.schema_editor() as editor:
    print(editor.sql_create_table(InstalledModule)[0] + ";")
    print(editor.sql_create_table(Language)[0] + ";")
    print(editor.sql_create_table(RecordRule)[0] + ";")
