import os
import shutil

base_dir = r"apps"
stock_models_path = os.path.join(base_dir, "stock/domain/models.py")
stock_serializers_path = os.path.join(base_dir, "stock/api/serializers.py")

delivery_dir = os.path.join(base_dir, "delivery")

# 1. Scaffold delivery app
folders = ["domain", "api", "infrastructure", "application", "migrations"]
for f in folders:
    os.makedirs(os.path.join(delivery_dir, f), exist_ok=True)
    with open(os.path.join(delivery_dir, f, "__init__.py"), 'w') as init_f:
        pass

with open(os.path.join(delivery_dir, "__init__.py"), 'w') as f:
    pass

with open(os.path.join(delivery_dir, "apps.py"), 'w') as f:
    f.write('''from django.apps import AppConfig

class DeliveryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.delivery'
''')

# 2. Extract DeliveryNote from stock/domain/models.py
with open(stock_models_path, 'r', encoding='utf-8') as f:
    stock_models_content = f.read()

import re
# Regex to match DeliveryNote model
delivery_note_pattern = re.compile(r'class DeliveryNote\(TenantAwareModel\):.*?def __str__\(self\):\n        return self\.dn_number\n', re.DOTALL)
match = delivery_note_pattern.search(stock_models_content)

if match:
    delivery_model_code = match.group(0)
    # Remove from stock
    new_stock_models = stock_models_content.replace(delivery_model_code, '')
    with open(stock_models_path, 'w', encoding='utf-8') as f:
        f.write(new_stock_models)
    
    # Write to delivery/domain/models.py
    with open(os.path.join(delivery_dir, "domain", "models.py"), 'w', encoding='utf-8') as f:
        f.write('''from django.db import models
from apps.core.domain.models import TenantAwareModel

''' + delivery_model_code)
    print("Moved DeliveryNote model")

# 3. Extract DeliveryNoteSerializer from stock/api/serializers.py
with open(stock_serializers_path, 'r', encoding='utf-8') as f:
    stock_ser_content = f.read()

stock_ser_content = stock_ser_content.replace(', DeliveryNote', '')
stock_ser_content = stock_ser_content.replace('DeliveryNote, ', '')

delivery_ser_pattern = re.compile(r'class DeliveryNoteSerializer\(serializers\.ModelSerializer\):\n    class Meta:\n        model = DeliveryNote\n        fields = \'__all__\'\n')
ser_match = delivery_ser_pattern.search(stock_ser_content)

if ser_match:
    delivery_ser_code = ser_match.group(0)
    new_stock_ser = stock_ser_content.replace(delivery_ser_code, '')
    with open(stock_serializers_path, 'w', encoding='utf-8') as f:
        f.write(new_stock_ser)
    
    with open(os.path.join(delivery_dir, "api", "serializers.py"), 'w', encoding='utf-8') as f:
        f.write('''from rest_framework import serializers
from ..domain.models import DeliveryNote

''' + delivery_ser_code)
    print("Moved DeliveryNoteSerializer")

print("Scaffolded apps/delivery")
