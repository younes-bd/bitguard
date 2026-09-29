import os
import django
import sys

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.append(backend_dir)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection
cursor = connection.cursor()
desc = connection.introspection.get_table_description(cursor, 'core_country')
print("COLUMNS:")
for col in desc:
    print(f"{col.name}: null_ok={col.null_ok}")
