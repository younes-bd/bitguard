import sqlite3

try:
    conn = sqlite3.connect('/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/backend/db.sqlite3')
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [r[0] for r in cursor.fetchall()]
    
    print("Tables matching 'webhook' or 'backup' or 'systemsetting':")
    for t in tables:
        if 'webhook' in t or 'backup' in t or 'setting' in t or 'parameter' in t:
            print(" -", t)
except Exception as e:
    print(e)
