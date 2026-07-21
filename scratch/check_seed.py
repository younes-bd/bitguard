import os
import django
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "erp_project.settings")
django.setup()

from apps.website.domain.models import Website, WebsiteMenu, Page
from apps.blog.domain.models import Category, Post

print(f"Websites: {Website.objects.count()}")
print(f"Pages: {Page.objects.count()}")
print(f"Menus: {WebsiteMenu.objects.count()}")
print(f"Categories: {Category.objects.count()}")
print(f"Posts: {Post.objects.count()}")
