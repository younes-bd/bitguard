import os
import sys
import django

sys.path.append('/mnt/c/Users/youne/Desktop/2-InfoTech/website/website13/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

django.setup()

from django.db import connection
from django.db.migrations.recorder import MigrationRecorder
from django.db.migrations.loader import MigrationLoader

recorder = MigrationRecorder(connection)
applied = recorder.applied_migrations()

print("Is services.0001_initial in applied?", ('services', '0001_initial') in applied)

loader = MigrationLoader(connection)
print("Nodes in graph:", ('services', '0001_initial') in loader.graph.nodes)

if ('cms', '0002_initial') in loader.graph.nodes:
    node = loader.graph.node_map[('cms', '0002_initial')]
    print("Dependencies of cms.0002_initial:")
    for dep in node.dependencies:
        print(" -", dep, "-> In applied?", dep in applied)
