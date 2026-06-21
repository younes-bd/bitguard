#!/usr/bin/env python3
"""
Check website12 and website11 databases for the old employee data.
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
        
        c.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        tables = [r[0] for r in c.fetchall()]
        print(f"Tables: {len(tables)}")
        
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
            'store_product': 'Products',
            'blog_post': 'Blog Posts',
        }
        print("\nKey data counts:")
        for table, label_t in key_tables.items():
            if table in tables:
                try:
                    c.execute(f"SELECT COUNT(*) FROM {table}")
                    count = c.fetchone()[0]
                    print(f"  {label_t}: {count}")
                    
                    # Print first few rows for key tables
                    if count > 0 and table in ('hrm_employee', 'users_user', 'crm_client'):
                        c.execute(f"SELECT * FROM {table} LIMIT 3")
                        cols = [d[0] for d in c.description]
                        rows = c.fetchall()
                        for row in rows:
                            print(f"    -> {dict(zip(cols, row))}")
                except Exception as e:
                    print(f"  {label_t}: ERROR - {e}")
            else:
                print(f"  {label_t}: [table not found]")
        conn.close()
    except Exception as e:
        print(f"ERROR reading DB: {e}")

dbs = [
    ('/mnt/c/Users/youne/Desktop/2-InfoTech/website/website12/backend/db.sqlite3', 'website12 (Windows)'),
    ('/mnt/c/Users/youne/Desktop/2-InfoTech/website/website11/backend/db.sqlite3', 'website11 (Windows)'),
]

for path, label in dbs:
    if os.path.exists(path):
        check_db(path, label)
    else:
        print(f"\n[NOT FOUND] {label}: {path}")
