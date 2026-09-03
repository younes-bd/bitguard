import sqlite3
import os

db_path = 'db.sqlite3'
if not os.path.exists(db_path):
    print("Database not found!")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

tables_to_rename = [
    ('ecommerce_product', 'product_product'),
    ('ecommerce_productattribute', 'product_productattribute'),
    ('ecommerce_productattributevalue', 'product_productattributevalue'),
    ('ecommerce_productvariant', 'product_productvariant'),
    ('ecommerce_productvariant_attribute_values', 'product_productvariant_attribute_values'),
    ('ecommerce_category', 'product_category'),
    ('ecommerce_productreview', 'product_productreview'),
]

for old_table, new_table in tables_to_rename:
    try:
        cursor.execute(f"ALTER TABLE {old_table} RENAME TO {new_table}")
        print(f"Renamed {old_table} to {new_table}")
    except sqlite3.OperationalError as e:
        print(f"Skipping {old_table}: {e}")

models = ['product', 'productattribute', 'productattributevalue', 'productvariant', 'category', 'productreview']
for model in models:
    cursor.execute("UPDATE django_content_type SET app_label = 'product' WHERE app_label = 'ecommerce' AND model = ?", (model,))
    print(f"Updated content type for {model}")
    
conn.commit()
conn.close()
print("Database surgery complete!")
