import sqlite3
import json

db_path = "backups/backup_20260718_204129.sqlite3"

try:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Get tenants
    cursor.execute("SELECT * FROM tenants_tenant")
    tenants = [dict(row) for row in cursor.fetchall()]

    # Get users
    cursor.execute("SELECT id, username, email, first_name, last_name, is_active FROM users_user")
    users = [dict(row) for row in cursor.fetchall()]

    print(json.dumps({
        "tenants": tenants,
        "users": users
    }, indent=2))

except Exception as e:
    print(f"Error: {e}")
finally:
    if 'conn' in locals():
        conn.close()
