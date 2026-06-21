import sqlite3

db = "/mnt/c/Users/youne/Desktop/2-InfoTech/website/website12/backend/db.sqlite3"
conn = sqlite3.connect(db)
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [t[0] for t in cursor.fetchall()]
for t in tables:
    try:
        cursor.execute(f"SELECT count(*) FROM {t}")
        count = cursor.fetchone()[0]
        if count > 0:
            print(f"{t}: {count}")
    except Exception:
        pass
