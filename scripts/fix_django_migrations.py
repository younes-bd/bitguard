import os
import sqlite3

MAPPING = {
    'hr_expense': 'expenses', 'hr_payroll': 'payroll', 'hr_holidays': 'timeoff',
    'hr_attendance': 'timeclock', 'hr_recruitment': 'recruiting', 'hr_appraisal': 'performance',
    'hr': 'employees', 'stock': 'inventory', 'mrp': 'manufacturing', 'quality_control': 'quality',
    'sale': 'sales', 'discuss': 'chat', 'mail': 'inbox', 'mass_mailing': 'campaigns',
    'marketing': 'journeys', 'field_service': 'dispatch'
}

db_path = os.path.expanduser('~/website13_db.sqlite3')
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    for old, new in MAPPING.items():
        cur.execute("UPDATE django_migrations SET app=? WHERE app=?", (new, old))
        print(f"Updated django_migrations: {old} -> {new}")
    conn.commit()
    conn.close()
    print("Migration history updated.")
