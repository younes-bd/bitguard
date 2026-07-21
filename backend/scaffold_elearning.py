import os
import shutil

backend_dir = "."

# 1. Scaffold elearning app
app_dir = os.path.join(backend_dir, "apps", "elearning")
os.makedirs(os.path.join(app_dir, "domain"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "api"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "infrastructure"), exist_ok=True)
os.makedirs(os.path.join(app_dir, "application"), exist_ok=True)

# __init__.py
for folder in ["", "domain", "api", "infrastructure", "application"]:
    open(os.path.join(app_dir, folder, "__init__.py"), 'w').close()

# apps.py
with open(os.path.join(app_dir, "apps.py"), 'w') as f:
    f.write("""from django.apps import AppConfig

class ElearningConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.elearning'
""")

# urls.py
with open(os.path.join(app_dir, "api", "urls.py"), 'w') as f:
    f.write("""from django.urls import path

app_name = 'elearning'

urlpatterns = [
]
""")

# models.py
with open(os.path.join(app_dir, "domain", "models.py"), 'w') as f:
    f.write("""from django.db import models
from django.conf import settings
from apps.core.domain.models import TenantAwareModel

# --- E-LEARNING ---
class Course(TenantAwareModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='%(app_label)s_%(class)s_created')
    
    def __str__(self):
        return self.title
""")

print("Elearning scaffolded.")
