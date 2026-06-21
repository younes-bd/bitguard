import os
import django
from django.apps import apps

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

def is_document_model(model):
    # Heuristics: typically has a 'tenant' (most do), and fields that suggest a document
    fields = [f.name for f in model._meta.get_fields()]
    doc_keywords = ['status', 'date', 'amount', 'total', 'client', 'vendor', 'employee', 'owner', 'number']
    
    # Check if name contains common document words
    name = model.__name__.lower()
    name_keywords = ['invoice', 'order', 'quote', 'proposal', 'contract', 'payslip', 'receipt', 'note', 'document', 'report', 'bill']
    
    if any(k in name for k in name_keywords):
        return True
    
    # Or if it has enough document-like fields
    matches = sum(1 for k in doc_keywords if any(k in f for f in fields))
    return matches >= 3

print("--- Document Models ---")
for app_config in apps.get_app_configs():
    if app_config.name.startswith('apps.'):
        for model in app_config.get_models():
            if is_document_model(model):
                print(f"{app_config.label}.{model.__name__}")
                fields = [f.name for f in model._meta.get_fields() if not f.is_relation and f.name not in ('id', 'created_at', 'updated_at', 'tenant')]
                print(f"  Fields: {', '.join(fields[:10])}")
