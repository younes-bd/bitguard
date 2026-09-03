import sqlite3

db_path = "db.sqlite3"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
for t in tables:
    if "app" in t[0].lower() or "module" in t[0].lower():
        print(t[0])
