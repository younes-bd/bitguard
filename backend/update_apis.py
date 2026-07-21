import os
import re

apps = ['fleet', 'mrp', 'pos', 'discuss', 'mrp_plm', 'quality_control', 'rental']
base_dir = "c:/Users/youne/Desktop/2-InfoTech/website/website13/backend/apps/"

for app in apps:
    app_dir = os.path.join(base_dir, app)
    models_path = os.path.join(app_dir, 'domain', 'models.py')
    
    if not os.path.exists(models_path):
        continue
        
    with open(models_path, 'r') as f:
        content = f.read()
        
    models = re.findall(r'class\s+([A-Z]\w+)\(', content)
    models = [m for m in models if m != 'TenantAwareModel']
    
    if not models:
        continue
        
    # generate serializers
    ser_content = f"from rest_framework import serializers\nfrom ..domain.models import {', '.join(models)}\n\n"
    for model in models:
        ser_content += f"class {model}Serializer(serializers.ModelSerializer):\n    class Meta:\n        model = {model}\n        fields = '__all__'\n\n"
        
    api_dir = os.path.join(app_dir, 'api')
    os.makedirs(api_dir, exist_ok=True)
    with open(os.path.join(api_dir, 'serializers.py'), 'w') as f:
        f.write(ser_content)
        
    # generate views
    view_content = f"from rest_framework import viewsets\nfrom ..domain.models import {', '.join(models)}\nfrom .serializers import {', '.join([m + 'Serializer' for m in models])}\n\n"
    for model in models:
        view_content += f"class {model}ViewSet(viewsets.ModelViewSet):\n    queryset = {model}.objects.all()\n    serializer_class = {model}Serializer\n\n"
        
    with open(os.path.join(api_dir, 'views.py'), 'w') as f:
        f.write(view_content)
        
    # generate urls
    url_content = f"from django.urls import path, include\nfrom rest_framework.routers import DefaultRouter\nfrom .views import {', '.join([m + 'ViewSet' for m in models])}\n\nrouter = DefaultRouter()\n"
    for model in models:
        name = model.lower()
        if name.endswith('y'): name = name[:-1] + 'ies'
        elif not name.endswith('s'): name += 's'
        url_content += f"router.register(r'{name}', {model}ViewSet)\n"
    url_content += "\nurlpatterns = [\n    path('', include(router.urls)),\n]\n"
    
    with open(os.path.join(api_dir, 'urls.py'), 'w') as f:
        f.write(url_content)
        
    # generate admin
    admin_content = f"from django.contrib import admin\nfrom .domain.models import {', '.join(models)}\n\n"
    for model in models:
        admin_content += f"@admin.register({model})\nclass {model}Admin(admin.ModelAdmin):\n    pass\n\n"
        
    with open(os.path.join(app_dir, 'admin.py'), 'w') as f:
        f.write(admin_content)
        
print("Updated all API and admin files.")
