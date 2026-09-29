from django.db import connection

with connection.cursor() as cursor:
    try:
        cursor.execute("SELECT count(*) FROM accounting_currency")
        print("accounting_currency count:", cursor.fetchone()[0])
    except Exception as e:
        print(e)
    try:
        cursor.execute("SELECT count(*) FROM core_currency")
        print("core_currency count:", cursor.fetchone()[0])
    except Exception as e:
        print(e)
