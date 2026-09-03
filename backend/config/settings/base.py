import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
BASE_DIR = Path(__file__).resolve().parent.parent.parent
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'fallback-development-key-314159')
if SECRET_KEY == 'fallback-development-key-314159':
    import warnings
    warnings.warn('Using fallback SECRET_KEY. Please set DJANGO_SECRET_KEY in production.')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.getenv('DJANGO_ALLOWED_HOSTS', '*').split(',')
CSRF_TRUSTED_ORIGINS = ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost:3000', 'http://127.0.0.1:3000']

PLATFORM_VENDOR_DOMAIN = os.getenv('PLATFORM_VENDOR_DOMAIN', 'localhost')
PLATFORM_VENDOR_NAME = os.getenv('PLATFORM_VENDOR_NAME', 'BitGuard')
DEMO_TENANT_IDS = os.getenv('DEMO_TENANT_IDS', '0aff5946-c015-4cc6-9d06-416cdf204651,cfc72aac-52e3-44fb-847c-5041cbd1bda2').split(',')

LOGIN_REDIRECT_URL = 'dashboard_home'
LOGIN_URL = '/users/login/'
LOGOUT_URL = 'logout'

import os
import sys

# Dynamic App Discovery (ERP Standard)
APPS_DIR = BASE_DIR / 'apps'
INTEGRATIONS_DIR = BASE_DIR / 'integrations'

# Mandatory Core Apps that must be loaded first
CORE_APPS = [
    'apps.core',
    'apps.users',
    'apps.tenants',
    'apps.auth',
    'apps.system',
    'apps.notifications',
    'api',
]

# Discover all other business modules dynamically
DYNAMIC_APPS = []
if APPS_DIR.exists():
    for d in APPS_DIR.iterdir():
        if d.is_dir() and d.name != '__pycache__' and not d.name.startswith('.'):
            app_module = f'apps.{d.name}'
            if app_module not in CORE_APPS:
                DYNAMIC_APPS.append(app_module)

if INTEGRATIONS_DIR.exists():
    for d in INTEGRATIONS_DIR.iterdir():
        if d.is_dir() and d.name != '__pycache__' and not d.name.startswith('.'):
            INTEGRATIONS_DIR_STR = f'integrations.{d.name}'
            DYNAMIC_APPS.append(INTEGRATIONS_DIR_STR)

INSTALLED_APPS = [
    # Django Built-in
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
    'django.contrib.sites',
    'django.contrib.sitemaps',

    # Third-Party
    'django_filters',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'taggit',
    'django_celery_beat',
] + CORE_APPS + DYNAMIC_APPS

# Django Channels — WebSocket layer (install: pip install channels daphne)
# Conditionally added so Django starts even without channels installed
try:
    import channels  # noqa
    CHANNEL_LAYERS = {
        'default': {
            'BACKEND': 'channels.layers.InMemoryChannelLayer',
        }
    }
except ImportError:
    pass  # Channels not installed — WebSocket push disabled, HTTP polling still works

# Stripe
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', '')
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET', '')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')


MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware','django.middleware.security.SecurityMiddleware',
'django.contrib.sessions.middleware.SessionMiddleware','django.middleware.common.CommonMiddleware',
'django.middleware.csrf.CsrfViewMiddleware','django.contrib.auth.middleware.AuthenticationMiddleware',
'django.contrib.messages.middleware.MessageMiddleware','django.middleware.clickjacking.XFrameOptionsMiddleware',
'apps.core.middleware.RequestLoggingMiddleware',
'apps.core.middleware.TenantMiddleware',]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [{'BACKEND':'django.template.backends.django.DjangoTemplates',
              'DIRS':[],
              'APP_DIRS':True,
              'OPTIONS':{'context_processors':['django.template.context_processors.debug',
              'django.template.context_processors.request',
              'django.contrib.auth.context_processors.auth',
              'django.contrib.messages.context_processors.messages']}}]

WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'



AUTH_USER_MODEL = 'users.User'

STATIC_URL = '/static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'EXCEPTION_HANDLER': 'apps.core.exceptions.custom_exception_handler',
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 25,
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ),
}
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
}


CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'https://bitguard.tech',
]
CORS_EXPOSE_HEADERS = ['Content-Disposition', 'X-Tenant-ID']
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'x-tenant-id',
]

# Tinymce

TINYMCE_DEFAULT_CONFIG = {
    'cleanup_on_startup': True,
    'custom_undo_redo_levels': 20,
    'selector': 'textarea',
    'theme': 'modern',
    'plugins': '''
            textcolor save link image media preview codesample contextmenu
            table code lists fullscreen  insertdatetime  nonbreaking
            contextmenu directionality searchreplace wordcount visualblocks
            visualchars code fullscreen autolink lists  charmap print  hr
            anchor pagebreak
            ''',
    'toolbar1': '''
            fullscreen preview bold italic underline | fontselect,
            fontsizeselect  | forecolor backcolor | alignleft alignright |
            aligncenter alignjustify | indent outdent | bullist numlist table |
            | link image media | codesample |
            ''',
    'toolbar2': '''
            visualblocks visualchars |
            charmap hr pagebreak nonbreaking anchor |  code |
            ''',
    'contextmenu': 'formats | link image',
    'menubar': True,
    'statusbar': True,
}

MAILCHIMP_API_KEY = ''
MAILCHIMP_DATA_CENTER = ''
MAILCHIMP_EMAIL_LIST_ID = ''


AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'apps.users.authentication.EmailAuthBackend',
)

#sitemap
SITE_ID = 1

#EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
EMAIL_PORT = 587
EMAIL_USE_TLS = True

# Celery Configuration
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'

import importlib.util
if importlib.util.find_spec('daphne') and importlib.util.find_spec('channels'):
    INSTALLED_APPS.insert(0, 'daphne')
    INSTALLED_APPS.insert(1, 'channels')
    CHANNEL_LAYERS = {
        'default': {
            'BACKEND': 'channels.layers.InMemoryChannelLayer',
        }
    }

from celery.schedules import crontab
# CELERY_BEAT_SCHEDULE is now managed via the database using django_celery_beat

