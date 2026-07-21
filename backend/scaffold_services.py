import os
import shutil

backend_dir = "."

# 1. Delete services app
services_dir = os.path.join(backend_dir, "apps", "services")
if os.path.exists(services_dir):
    shutil.rmtree(services_dir)
    print(f"Deleted {services_dir}")
else:
    print(f"{services_dir} not found")

# 2. Scaffold new apps
new_apps = ['appointments', 'planning', 'field_service']

for app in new_apps:
    app_dir = os.path.join(backend_dir, "apps", app)
    os.makedirs(os.path.join(app_dir, "domain"), exist_ok=True)
    os.makedirs(os.path.join(app_dir, "api"), exist_ok=True)
    os.makedirs(os.path.join(app_dir, "infrastructure"), exist_ok=True)
    os.makedirs(os.path.join(app_dir, "application"), exist_ok=True)
    
    # __init__.py
    open(os.path.join(app_dir, "__init__.py"), 'w').close()
    
    # apps.py
    with open(os.path.join(app_dir, "apps.py"), 'w') as f:
        camel_case = ''.join(word.capitalize() for word in app.split('_'))
        f.write(f"""from django.apps import AppConfig

class {camel_case}Config(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.{app}'
""")

    # models.py
    with open(os.path.join(app_dir, "domain", "models.py"), 'w') as f:
        f.write("""from django.db import models
from django.conf import settings
from apps.core.domain.models import BaseModel, TenantAwareModel

""")
        if app == 'appointments':
            f.write("""class Appointment(TenantAwareModel):
    title = models.CharField(max_length=255)
    scheduled_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, default='scheduled', choices=[
        ('draft', 'Draft'), ('scheduled', 'Scheduled'), ('completed', 'Completed'), ('cancelled', 'Cancelled')
    ])
    attendees = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='appointments', blank=True)

    def __str__(self):
        return self.title
""")
        elif app == 'planning':
            f.write("""class Shift(TenantAwareModel):
    title = models.CharField(max_length=255)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='shifts')
    role = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return self.title
""")
        elif app == 'field_service':
            f.write("""class FieldIntervention(TenantAwareModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    scheduled_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, default='pending', choices=[
        ('pending', 'Pending'), ('in_progress', 'In Progress'), ('done', 'Done'), ('cancelled', 'Cancelled')
    ])
    technician = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='interventions')
    location_address = models.CharField(max_length=500, blank=True)
    
    def __str__(self):
        return self.title
""")

    # urls.py
    with open(os.path.join(app_dir, "api", "urls.py"), 'w') as f:
        f.write(f"""from django.urls import path

app_name = '{app}'

urlpatterns = [
    # TODO: Add API routes
]
""")

print("Scaffolding complete.")
