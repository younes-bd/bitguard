print("Starting...")
import os
import django
print("Setting env...")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
print("Setting up django...")
django.setup()
print("Django setup done.")
