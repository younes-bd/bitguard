import sqlite3
from datetime import datetime

db_path = '/home/youness/website13/backend/db.sqlite3'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("INSERT INTO django_migrations (app, name, applied) VALUES (?, ?, ?)", 
                   ('accounting', '0002_initial', datetime.now()))
    print("Inserted accounting.0002_initial")
except sqlite3.IntegrityError:
    print("accounting.0002_initial already exists")

try:
    cursor.execute("INSERT INTO django_migrations (app, name, applied) VALUES (?, ?, ?)", 
                   ('core', '0002_initial', datetime.now()))
    print("Inserted core.0002_initial")
except sqlite3.IntegrityError:
    pass

try:
    cursor.execute("INSERT INTO django_migrations (app, name, applied) VALUES (?, ?, ?)", 
                   ('documents', '0002_initial', datetime.now()))
    print("Inserted edms.0002_initial")
except sqlite3.IntegrityError:
    pass

try:
    cursor.execute("INSERT INTO django_migrations (app, name, applied) VALUES (?, ?, ?)", 
                   ('documents', '0003_edms_update', datetime.now()))
    print("Inserted edms.0003_edms_update")
except sqlite3.IntegrityError:
    pass
    
try:
    cursor.execute("INSERT INTO django_migrations (app, name, applied) VALUES (?, ?, ?)", 
                   ('reporting', '0002_initial', datetime.now()))
    print("Inserted reporting.0002_initial")
except sqlite3.IntegrityError:
    pass

conn.commit()
conn.close()
print("Done faking migrations.")
