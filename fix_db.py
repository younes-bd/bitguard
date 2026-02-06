import sqlite3
import os

# Connect to database
try:
    conn = sqlite3.connect('db.sqlite3')
    cursor = conn.cursor()
    
    print("Checking columns in crm_ticket...")
    cursor.execute("PRAGMA table_info(crm_ticket)")
    columns = cursor.fetchall()
    has_linked_alert = any(c[1] == 'linked_alert_id' for c in columns)
    
    if has_linked_alert:
        print("Column linked_alert_id found. Dropping it...")
        # SQLite doesn't support DROP COLUMN in older versions easily, but in Python 3.12/modern sqlite it should work.
        # However, simple alter table drop column support varies.
        # Let's try standard SQL.
        try:
            cursor.execute("ALTER TABLE crm_ticket DROP COLUMN linked_alert_id")
            print("Column dropped successfully.")
            conn.commit()
        except sqlite3.OperationalError as e:
            print(f"Standard DROP failed: {e}. Attempting manual recreation logic is safer but complex.")
    else:
        print("Column linked_alert_id NOT found.")

    conn.close()
    
except Exception as e:
    print(f"Error: {e}")
