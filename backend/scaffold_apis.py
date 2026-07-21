import os

BASE_DIR = "."

apps_to_scaffold = {
    "mrp_plm": ["EngineeringChangeOrder"],
    "quality_control": ["QualityAlert"]
}

for app_name, models in apps_to_scaffold.items():
    api_dir = os.path.join(BASE_DIR, "apps", app_name, "api")
    os.makedirs(api_dir, exist_ok=True)
    
    # Create __init__.py
    with open(os.path.join(api_dir, "__init__.py"), "w") as f:
        pass
        
    # 1. serializers.py
    serializers_content = f"from rest_framework import serializers\nfrom apps.{app_name}.models import {', '.join(models)}\n\n"
    for model in models:
        serializers_content += f"class {model}Serializer(serializers.ModelSerializer):\n"
        serializers_content += f"    class Meta:\n"
        serializers_content += f"        model = {model}\n"
        serializers_content += f"        fields = '__all__'\n\n"
        
    with open(os.path.join(api_dir, "serializers.py"), "w") as f:
        f.write(serializers_content)
        
    # 2. views.py
    views_content = f"from rest_framework import viewsets\n"
    views_content += f"from apps.{app_name}.models import {', '.join(models)}\n"
    views_content += f"from .serializers import {', '.join([m + 'Serializer' for m in models])}\n\n"
    for model in models:
        views_content += f"class {model}ViewSet(viewsets.ModelViewSet):\n"
        views_content += f"    queryset = {model}.objects.all()\n"
        views_content += f"    serializer_class = {model}Serializer\n\n"
        
    with open(os.path.join(api_dir, "views.py"), "w") as f:
        f.write(views_content)
        
    # 3. urls.py
    urls_content = f"from django.urls import path, include\n"
    urls_content += f"from rest_framework.routers import DefaultRouter\n"
    urls_content += f"from .views import {', '.join([m + 'ViewSet' for m in models])}\n\n"
    urls_content += f"router = DefaultRouter()\n"
    for model in models:
        route_name = model.lower() + "s"
        urls_content += f"router.register(r'{route_name}', {model}ViewSet)\n"
    urls_content += f"\nurlpatterns = [\n"
    urls_content += f"    path('', include(router.urls)),\n"
    urls_content += f"]\n"
    
    with open(os.path.join(api_dir, "urls.py"), "w") as f:
        f.write(urls_content)

print("Scaffolded APIs successfully!")
