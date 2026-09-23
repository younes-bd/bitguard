import os
import sqlite3
import re
import shutil

MAPPING = {
    'hr': 'employees',
    'hr_expense': 'expenses',
    'hr_payroll': 'payroll',
    'hr_holidays': 'timeoff',
    'hr_attendance': 'timeclock',
    'hr_recruitment': 'recruiting',
    'hr_appraisal': 'performance',
    'stock': 'inventory',
    'mrp': 'manufacturing',
    'quality_control': 'quality',
    'sale': 'sales',
    'discuss': 'chat',
    'mail': 'inbox',
    'email_marketing': 'campaigns',
    'marketing_automation': 'journeys',
    'field_service': 'dispatch'
}

print("Phase 2: Database Migration")
db_path = os.path.expanduser('~/website13_db.sqlite3')
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    for old, new in MAPPING.items():
        # Update InstalledModule
        cur.execute("UPDATE core_installedmodule SET technical_name=?, url=? WHERE technical_name=?", (new, f'/admin/{new}', old))
        
        # Rename Django tables (e.g. hr_expense_expense -> expenses_expense)
        # We need to find tables starting with {old}_
        cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE ?", (f"{old}_%",))
        tables = cur.fetchall()
        for (table_name,) in tables:
            new_table_name = table_name.replace(f"{old}_", f"{new}_", 1)
            try:
                cur.execute(f"ALTER TABLE {table_name} RENAME TO {new_table_name}")
                print(f"Renamed table {table_name} -> {new_table_name}")
            except Exception as e:
                print(f"Failed to rename {table_name}: {e}")
                
    conn.commit()
    conn.close()
    print("Database migrations completed.")
else:
    print("Database not found!")

# Note: Phase 3 and 4 involve massive file system changes. I am generating this script so it can be verified.
