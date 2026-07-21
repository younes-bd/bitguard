import sqlite3
import os

db_path = '/home/youness/website13/backend/db.sqlite3'
print(f"Connecting to {os.path.abspath(db_path)}")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Update django_migrations table
try:
    cursor.execute("UPDATE django_migrations SET app='helpdesk' WHERE app='support'")
    print(f"Updated {cursor.rowcount} rows in django_migrations")
except Exception as e:
    print(f"Failed to update django_migrations: {e}")

# Check for support_ tables and rename
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [r[0] for r in cursor.fetchall()]
support_tables = [t for t in tables if t.startswith('support_')]

if not support_tables:
    print("No support_ tables found!")
else:
    for old_name in support_tables:
        new_name = old_name.replace('support_', 'helpdesk_')
        print(f"Renaming {old_name} to {new_name}")
        try:
            cursor.execute(f"ALTER TABLE {old_name} RENAME TO {new_name}")
        except Exception as e:
            print(f"Error renaming {old_name}: {e}")

# Check for content_types table and rename
try:
    cursor.execute("UPDATE django_content_type SET app_label='helpdesk' WHERE app_label='support'")
    print(f"Updated {cursor.rowcount} rows in django_content_type")
except Exception as e:
    print(f"Failed to update django_content_type: {e}")

conn.commit()
conn.close()
print("Done.")
