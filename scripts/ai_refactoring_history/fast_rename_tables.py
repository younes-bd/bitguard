import sqlite3
import os

db_path = os.path.expanduser("~/website13_db.sqlite3")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

tables_to_rename = {
    "base_setup_installedmodule": "core_installedmodule",
    "base_setup_language": "core_language",
    "base_setup_commandcentersection": "core_commandcentersection",
    "base_setup_systemsetting": "system_systemsetting",
    "base_setup_apikey": "system_apikey",
    "base_setup_webhookendpoint": "system_webhookendpoint",
    "base_setup_databasebackup": "system_databasebackup",
}

for old_table, new_table in tables_to_rename.items():
    try:
        # Check if new_table already exists (maybe we already renamed it)
        cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{new_table}';")
        if cursor.fetchone():
            print(f"Table {new_table} already exists. Skipping.")
            continue

        cursor.execute(f"ALTER TABLE {old_table} RENAME TO {new_table};")
        print(f"Renamed {old_table} to {new_table}")
    except Exception as e:
        print(f"Error renaming {old_table}: {e}")

conn.commit()
conn.close()
