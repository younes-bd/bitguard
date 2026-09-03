from .base import *

DEBUG = True

# Database - ALWAYS stored on the native Linux filesystem to avoid
# WSL /mnt/c/ disk I/O errors. This path works regardless of which
# directory you run manage.py from.
import os
from .base import *

DEBUG = True

# Database - ALWAYS stored on the native Linux filesystem to avoid
# WSL /mnt/c/ disk I/O errors. This path works regardless of which
# directory you run manage.py from.
import os

# Use a robust path resolution that works across WSL and Windows
_NATIVE_DB = os.path.expanduser('~/website13_db.sqlite3')

_CUSTOM_DB = os.environ.get('CUSTOM_DB_PATH')
NAME = _CUSTOM_DB if _CUSTOM_DB else _NATIVE_DB

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': NAME,
        'OPTIONS': {
            'timeout': 30,
        }
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
CORS_ALLOW_ALL_ORIGINS = True
