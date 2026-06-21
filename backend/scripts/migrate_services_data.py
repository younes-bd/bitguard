import os
import sys
import json
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from apps.cms.domain.models import ServicePage
from apps.itsm.domain.models import ServiceItem

def run():
    json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'servicesData.json')
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
        return

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    created_count = 0
    updated_count = 0

    for slug, service_data in data.items():
        title = service_data.get('title', '')
        subtitle = service_data.get('subtitle', '')
        description = service_data.get('description', '')
        icon = service_data.get('icon', '')
        hero_bg = service_data.get('hero_bg', '')
        hero_image = service_data.get('hero_image', '')
        features = service_data.get('features', [])
        content = service_data.get('content', '')

        # All other flexible content goes into content_data
        content_data = {
            'long_description': service_data.get('long_description', ''),
            'benefits': service_data.get('benefits', []),
            'process': service_data.get('process', []),
            'why_choose_us': service_data.get('why_choose_us', {}),
            'faq': service_data.get('faq', []),
            'relatedServices': service_data.get('relatedServices', []),
            'content_image': service_data.get('content_image', '')
        }

        # Try to find a matching ERP ServiceItem loosely by name or slug
        # This is best-effort since we don't have explicit mapping yet.
        linked_service = None
        # We could add logic to find it if needed: 
        # linked_service = ServiceItem.objects.filter(name__icontains=title).first()

        page, created = ServicePage.objects.update_or_create(
            slug=slug,
            defaults={
                'title': title,
                'subtitle': subtitle,
                'description': description,
                'icon': icon,
                'hero_bg': hero_bg,
                'hero_image': hero_image,
                'features': features,
                'content': content,
                'content_data': content_data,
                'linked_service': linked_service,
            }
        )

        if created:
            created_count += 1
        else:
            updated_count += 1

    print(f"Migration complete: {created_count} created, {updated_count} updated.")

if __name__ == '__main__':
    run()
