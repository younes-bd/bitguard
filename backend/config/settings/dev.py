import os
from .base import *

DEBUG = True

# ---------------------------------------------------------
# Database - TIER 1 ERP STANDARD (PostgreSQL)
# ---------------------------------------------------------
# Switched from SQLite to PostgreSQL to ensure Dev/Prod Parity
# and prevent schema migration crashes.

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'bitguard',
        'USER': 'youness',
        'PASSWORD': 'admin',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
CORS_ALLOW_ALL_ORIGINS = True
