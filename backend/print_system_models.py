from django.contrib.contenttypes.models import ContentType

for c in ContentType.objects.all().order_by('app_label'):
    if c.app_label == 'system':
        print(f"system | {c.model}")
