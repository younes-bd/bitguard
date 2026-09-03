import os

# Check which frontend apps have real API calls vs pure mock data
fe_dir = 'src/apps'

for app in sorted(os.listdir(fe_dir)):
    app_path = os.path.join(fe_dir, app)
    if not os.path.isdir(app_path):
        continue
    
    has_api_calls = False
    has_routes = False
    has_real_pages = False
    mock_only = False
    
    for root, dirs, files in os.walk(app_path):
        for fname in files:
            if not fname.endswith('.jsx') and not fname.endswith('.js'):
                continue
            fpath = os.path.join(root, fname)
            try:
                content = open(fpath, encoding='utf-8').read()
            except:
                continue
            
            if 'apiClient' in content or 'axios' in content or 'useQuery' in content or 'fetch(' in content or 'api/' in content:
                has_api_calls = True
            if 'Route' in content and 'path=' in content:
                has_routes = True
            if '1,234' in content or "hardcoded" in content.lower() or 'mockData' in content:
                mock_only = True
    
    status = []
    if has_api_calls:
        status.append('HAS_API')
    else:
        status.append('NO_API_CALLS')
    if has_routes:
        status.append('HAS_ROUTES')
    if mock_only:
        status.append('MOCK_DATA_DETECTED')
    
    print(f'{app}: {" | ".join(status)}')
