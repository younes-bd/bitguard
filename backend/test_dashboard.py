import os
import django
import sys

# Set path to the root of the Django project
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from apps.erp.services import EnterpriseService
from django.contrib.auth import get_user_model
from django.test import RequestFactory

User = get_user_model()
user = User.objects.first()
req = RequestFactory().get('/')
req.user = user

try:
    print(EnterpriseService.get_dashboard_stats(req))
except Exception as e:
    import traceback
    traceback.print_exc()
