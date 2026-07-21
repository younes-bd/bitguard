import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.db import connection
from apps.services.domain.models import ChangeRequest, ChangeTask, Problem, ServiceCategory, ServiceItem, ServiceRequest, ResourceShift, Appointment

models_to_create = [
    ServiceCategory,
    ServiceItem,
    ChangeRequest,
    ChangeTask,
    Problem,
    ServiceRequest,
    ResourceShift,
    Appointment
]

with connection.schema_editor() as schema_editor:
    for model in models_to_create:
        try:
            schema_editor.create_model(model)
            print(f"Created table for {model.__name__}")
        except Exception as e:
            if "already exists" in str(e):
                print(f"Table for {model.__name__} already exists.")
            else:
                print(f"Error creating table for {model.__name__}: {e}")
