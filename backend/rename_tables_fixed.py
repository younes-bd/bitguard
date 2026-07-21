import sqlite3
import os

db_path = 'db.sqlite3'
print(f"Connecting to {os.path.abspath(db_path)}")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [r[0] for r in cursor.fetchall()]

# Check if support tables exist
support_tables = [t for t in tables if t.startswith('support_')]

if not support_tables:
    print("No support_ tables found!")
else:
    for old_name in support_tables:
        new_name = old_name.replace('support_', 'helpdesk_')
        print(f"Renaming {old_name} to {new_name}")
        try:
            cursor.execute(f"ALTER TABLE {old_name} RENAME TO {new_name}")
        except sqlite3.OperationalError as e:
            print(f"Error renaming {old_name}: {e}")

try:
    cursor.execute("UPDATE django_migrations SET app='helpdesk' WHERE app='helpdesk'")
except Exception as e:
    print("Migration update failed:", e)

conn.commit()
conn.close()
print("Done.")
