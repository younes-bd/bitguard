import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
django.setup()

from apps.core.domain.models import Currency as CoreCurrency, Company
from apps.accounting.domain.models import ExchangeRate
from django.db import connection

def merge_currencies():
    print("Starting ORM-based currency merge...")
    
    # 1. We must read from accounting_currency via raw SQL because the Model no longer exists in python!
    with connection.cursor() as cursor:
        cursor.execute("SELECT id, tenant_id, created_at, updated_at, created_by_id, is_deleted, deleted_at, code, name, symbol, is_base FROM accounting_currency")
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
    
    accounting_currencies = [dict(zip(columns, row)) for row in rows]
    
    # 2. Insert into CoreCurrency
    inserted = 0
    skipped = 0
    for ac in accounting_currencies:
        # Check if code exists in CoreCurrency
        if CoreCurrency.all_objects.filter(code=ac['code']).exists():
            skipped += 1
            # We will map the old accounting ID to the existing core ID
        else:
            # Create it
            CoreCurrency.all_objects.create(
                id=ac['id'],
                tenant_id=ac['tenant_id'],
                created_at=ac['created_at'],
                updated_at=ac['updated_at'],
                created_by_id=ac['created_by_id'],
                is_deleted=ac['is_deleted'],
                deleted_at=ac['deleted_at'],
                code=ac['code'],
                name=ac['name'],
                symbol=ac['symbol'],
                is_base=ac['is_base']
            )
            inserted += 1
            
    print(f"Inserted: {inserted}, Skipped: {skipped}")
    
    # 3. Remap ExchangeRates
    with connection.cursor() as cursor:
        cursor.execute("""
            UPDATE accounting_exchangerate er
            SET currency_id = cc.id
            FROM accounting_currency ac
            JOIN core_currency cc ON cc.code = ac.code
            WHERE er.currency_id = ac.id;
        """)
        print(f"Updated ExchangeRates: {cursor.rowcount}")

        cursor.execute("""
            UPDATE core_company c
            SET default_currency_id = cc.id
            FROM accounting_currency ac
            JOIN core_currency cc ON cc.code = ac.code
            WHERE c.default_currency_id = ac.id;
        """)
        print(f"Updated Core Company: {cursor.rowcount}")
        
        cursor.execute("DROP TABLE accounting_currency CASCADE;")
        print("Dropped accounting_currency table.")

if __name__ == '__main__':
    merge_currencies()
