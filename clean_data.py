import sqlite3
import os

db_path = r'c:\Users\youne\Desktop\2-InfoTech\website\website8\db.sqlite3'
# Check if file exists (since running in WSL might see paths differently)
# If running in python Windows, this path works.
# If running in python Linux (WSL), this path fails.
# Trying to detect logic.

if not os.path.exists(db_path):
    # Try WSL path assumption if script run in WSL
    db_path = '/mnt/c/Users/youne/Desktop/2-InfoTech/website/website8/db.sqlite3'

print(f"Connecting to database at: {db_path}")

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='crm_ticket';")
    if not cursor.fetchone():
        print("Table crm_ticket NOT found. Maybe migrations 0001/0002 not applied?")
    else:
        # Nullify the dangling references
        cursor.execute("UPDATE crm_ticket SET linked_alert_id = NULL")
        conn.commit()
        print("Successfully set linked_alert_id to NULL.")
        
    conn.close()
except Exception as e:
    print(f"Error: {e}")
