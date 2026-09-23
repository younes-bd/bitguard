import os
import django
import time

print("Starting setup...")
start = time.time()
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()
print(f"Setup done in {time.time() - start:.2f}s")
