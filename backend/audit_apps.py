import os

apps_dir = 'apps'

for app in sorted(os.listdir(apps_dir)):
    app_path = os.path.join(apps_dir, app)
    if not os.path.isdir(app_path):
        continue
    if not os.path.exists(os.path.join(app_path, '__init__.py')):
        continue
    
    has_models = os.path.exists(os.path.join(app_path, 'models.py')) or os.path.exists(os.path.join(app_path, 'domain', 'models.py'))
    has_api_views = os.path.exists(os.path.join(app_path, 'api', 'views.py'))
    has_api_urls = os.path.exists(os.path.join(app_path, 'api', 'urls.py'))
    has_api_serializers = os.path.exists(os.path.join(app_path, 'api', 'serializers.py'))
    has_admin = os.path.exists(os.path.join(app_path, 'admin.py'))
    
    mig_dir = os.path.join(app_path, 'migrations')
    has_migrations = False
    if os.path.exists(mig_dir):
        migs = [f for f in os.listdir(mig_dir) if f.endswith('.py') and f != '__init__.py']
        has_migrations = len(migs) > 0
    
    missing = []
    if not has_models: missing.append('NO_MODELS')
    if not has_api_views: missing.append('NO_VIEWS')
    if not has_api_urls: missing.append('NO_URLS')
    if not has_api_serializers: missing.append('NO_SERIALIZERS')
    if not has_admin: missing.append('NO_ADMIN')
    if not has_migrations: missing.append('NO_MIGRATIONS')
    
    score = 6 - len(missing)
    status = 'COMPLETE' if score == 6 else 'MISSING: ' + ', '.join(missing)
    print(f'{app}: {score}/6 | {status}')
