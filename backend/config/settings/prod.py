import os
from .base import *
import dj_database_url

DEBUG = False
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'bitguard.tech,www.bitguard.tech,localhost,127.0.0.1').split(',')

# ---------------------------------------------------------
# Security
# ---------------------------------------------------------
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# ---------------------------------------------------------
# Database
# ---------------------------------------------------------
# Fallback to local sqlite3 if DATABASE_URL is not set (prevents crash on local)
fallback_db = 'sqlite:///' + os.path.expanduser('~/website13_db.sqlite3')
DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL', fallback_db),
        conn_max_age=600,
        conn_health_checks=True,
    )
}

# ---------------------------------------------------------
# Caching (Redis)
# ---------------------------------------------------------
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': os.environ.get('REDIS_URL', 'redis://127.0.0.1:6379/1'),
    }
}

# ---------------------------------------------------------
# Static & Media Files
# ---------------------------------------------------------
STATIC_ROOT = BASE_DIR / 'staticfiles'
DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID', '')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY', '')
AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME', 'bitguard-assets')
AWS_S3_REGION_NAME = os.environ.get('AWS_S3_REGION_NAME', 'us-east-1')

# ---------------------------------------------------------
# Logging Configuration
# ---------------------------------------------------------
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {'class': 'logging.StreamHandler'},
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
}
