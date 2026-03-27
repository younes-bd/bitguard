import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
BASE_DIR = Path(__file__).resolve().parent.parent.parent
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY','change-me')
DEBUG = os.getenv('DEBUG','True') == 'True'
ALLOWED_HOSTS = ['127.0.0.1','localhost', 'mysite.com', 'testserver']
CSRF_TRUSTED_ORIGINS = ['http://localhost:8000', 'http://127.0.0.1:8000']


LOGIN_REDIRECT_URL = 'dashboard_home'
LOGIN_URL = '/users/login/'
LOGOUT_URL = 'logout'


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
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'taggit',

    # Local Apps
    'apps.core',        # Core functionality first
    'apps.users',    # Auth & Users
    'apps.tenants',     # Multi-tenancy
    'apps.soc',
    'apps.auth',
    'apps.website',
    'integrations.blog',
    'apps.store',
    'apps.billing',
    'apps.crm',
    'apps.erp',
    'apps.notifications',
    'integrations.ai_engine',
    'integrations.automation',
    'api',
    'apps.audit',
    'apps.reports',
    'apps.dashboard',
    'apps.support',
    'apps.marketing',
    # New business modules (Sprint 3 & 4)
    'apps.hrm',
    'apps.scm',
    'apps.contracts',
    'apps.projects',    # Dedicated Project Management (PSA)
    'apps.itam',        # IT Asset Management
    'apps.sysadmin',    # System Administration
]

# Django Channels — WebSocket layer (install: pip install channels daphne)
# Conditionally added so Django starts even without channels installed
try:
    import channels  # noqa
    INSTALLED_APPS += ['channels', 'daphne']
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
        'rest_framework.permissions.AllowAny',
    ),
    'EXCEPTION_HANDLER': 'apps.core.exceptions.custom_exception_handler',
}
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=120),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY','sk_test_replace')
STRIPE_PUBLISHABLE_KEY = os.getenv('STRIPE_PUBLISHABLE_KEY','pk_test_replace')
CORS_ALLOW_ALL_ORIGINS = True
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
    # 'django.contrib.auth.backends.ModelBackend',
    'apps.users.authentication.EmailAuthBackend',
)

#sitemap
SITE_ID = 1

#EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'bitguard.tech@gmail.COM'
EMAIL_HOST_PASSWORD = 'agwriikxfrmtblcx'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
