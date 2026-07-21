import sqlite3
import os

db_path = "/home/youness/website13/backend/db.sqlite3"

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("UPDATE django_migrations SET app='stock' WHERE app='inventory';")
    conn.commit()
    conn.close()
    print("Database migrations table updated.")
else:
    print(f"{db_path} not found!")
