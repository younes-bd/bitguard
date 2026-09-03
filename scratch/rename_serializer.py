import os

BACKEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')

# 1. Update Serializer
serializers_file = os.path.join(BACKEND_DIR, 'apps', 'system', 'api', 'serializers.py')
with open(serializers_file, 'r') as f:
    content = f.read()
content = content.replace('class ErpModuleSerializer(serializers.ModelSerializer):', 'class InstalledModuleSerializer(serializers.ModelSerializer):')
with open(serializers_file, 'w') as f:
    f.write(content)

# 2. Update Views
views_file = os.path.join(BACKEND_DIR, 'apps', 'system', 'api', 'views.py')
with open(views_file, 'r') as f:
    content = f.read()
content = content.replace('ErpModuleSerializer', 'InstalledModuleSerializer')
with open(views_file, 'w') as f:
    f.write(content)

print('Renamed ErpModuleSerializer to InstalledModuleSerializer')
