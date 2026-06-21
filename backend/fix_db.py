import sqlite3
from datetime import datetime

def fix_db():
    conn = sqlite3.connect('db.sqlite3')
    cursor = conn.cursor()
    now = datetime.now().isoformat()
    cursor.execute("INSERT OR IGNORE INTO django_migrations (app, name, applied) VALUES ('accounting', '0002_initial', ?)", (now,))
    cursor.execute("INSERT OR IGNORE INTO django_migrations (app, name, applied) VALUES ('erp', '0002_initial', ?)", (now,))
    
    conn.commit()
    conn.close()
    print("Fixed migration history.")

if __name__ == '__main__':
    fix_db()
