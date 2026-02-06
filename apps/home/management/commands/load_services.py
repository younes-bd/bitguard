from django.core.management.base import BaseCommand
from apps.home.models import Service
from apps.home.services_data import SERVICES

class Command(BaseCommand):
    help = 'Load services from services_data.py into the database'

    def handle(self, *args, **kwargs):
        for slug, data in SERVICES.items():
            Service.objects.update_or_create(
                slug=slug,
                defaults={
                    'title': data.get('title', ''),
                    'subtitle': data.get('subtitle', ''),
                    'description': data.get('description', ''),
                    'icon': data.get('icon', ''),
                    'hero_bg': data.get('hero_bg', ''),
                    'hero_image': data.get('hero_image', ''),
                    'content': data.get('content', ''),
                    'features': data.get('features', []),
                }
            )
        self.stdout.write(self.style.SUCCESS('Successfully loaded services'))
