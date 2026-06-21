#!/usr/bin/env python3
"""
Full diagnostic: checks what data exists in the actual running database,
and what's in all other SQLite databases found on the system.
"""
import sqlite3
import os

def check_db(path, label):
    print(f"\n{'='*60}")
    print(f"DATABASE: {label}")
    print(f"Path: {path}")
    size = os.path.getsize(path) if os.path.exists(path) else 0
    print(f"Size: {size/1024:.1f} KB")
    if size == 0:
        print("EMPTY DATABASE")
        return
    try:
        conn = sqlite3.connect(path)
        c = conn.cursor()
        
        # Get tables
        c.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        tables = [r[0] for r in c.fetchall()]
        print(f"Tables: {len(tables)}")
        
        # Key data counts
        key_tables = {
            'hrm_employee': 'Employees',
            'users_user': 'Users', 
            'tenants_tenant': 'Tenants',
            'itsm_servicecategory': 'ITSM Categories',
            'itsm_serviceitem': 'ITSM Items',
            'crm_client': 'CRM Clients',
            'erp_internalproject': 'Projects',
            'support_ticket': 'Support Tickets',
            'billing_invoice': 'Invoices',
        }
        print("\nKey data counts:")
        for table, label_t in key_tables.items():
            if table in tables:
                try:
                    c.execute(f"SELECT COUNT(*) FROM {table}")
                    count = c.fetchone()[0]
                    print(f"  {label_t}: {count}")
                except Exception as e:
                    print(f"  {label_t}: ERROR - {e}")
            else:
                print(f"  {label_t}: [table not found]")
        conn.close()
    except Exception as e:
        print(f"ERROR reading DB: {e}")

# Check all databases
dbs = [
    ('/home/youness/website13/backend/db.sqlite3', 'CURRENT RUNNING (website13 native)'),
    ('/home/youness/website13/backend/config/db.sqlite3', 'website13 config/ subfolder'),
    ('/home/youness/bitguard/db.sqlite3', 'bitguard (old copy)'),
    ('/home/youness/bitguard/config/db.sqlite3', 'bitguard config/ subfolder'),
    ('/home/youness/db.sqlite3', 'home root db'),
]

for path, label in dbs:
    if os.path.exists(path):
        check_db(path, label)
    else:
        print(f"\n[NOT FOUND] {label}: {path}")
