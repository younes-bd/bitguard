import sqlite3
try:
    conn = sqlite3.connect('/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/backend/db.sqlite3')
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [r[0] for r in cursor.fetchall()]
    print("base_setup_apikey:", 'base_setup_apikey' in tables)
except Exception as e:
    print(e)
