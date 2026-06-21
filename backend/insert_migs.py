import sqlite3
from datetime import datetime

db_path = '/home/youness/website13/backend/db.sqlite3'
conn = sqlite3.connect(db_path)
c = conn.cursor()

now = datetime.now().isoformat()

migrations = [
    ('assets', '0001_initial'),
    ('services', '0001_initial'),
    ('cms', '0001_initial'),
    ('cms', '0002_initial'),
    ('notifications', '0001_initial'),
    ('support', '0001_initial'),
    ('support', '0002_initial'),
]

for app, name in migrations:
    try:
        c.execute("INSERT INTO django_migrations (app, name, applied) VALUES (?, ?, ?)", (app, name, now))
        print(f"Inserted {app}.{name}")
    except sqlite3.IntegrityError:
        print(f"Already exists: {app}.{name}")
    except Exception as e:
        print(f"Error inserting {app}.{name}: {e}")

conn.commit()
conn.close()
print("Done inserting fake migrations.")
