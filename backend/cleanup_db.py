import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    cursor.execute('DELETE FROM scm_purchaseorder;')

print("Deleted POs using raw SQL to bypass ORM CASCADE checks.")
