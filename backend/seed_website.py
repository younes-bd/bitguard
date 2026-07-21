import os
import django
import sys
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django.setup()

from django.contrib.auth import get_user_model
from apps.website.domain.models import Website, WebsiteMenu, Page
from apps.blog.domain.models import Category, Post
from apps.tenants.domain.models import Tenant

User = get_user_model()

def seed_data():
    print("Seeding website and blog data...")

    # Get or create Tenant
    tenant, _ = Tenant.objects.get_or_create(
        domain='bitguard.tech',
        defaults={'name': 'BitGuard Technologies', 'subscription_plan': 'enterprise'}
    )
    print(f"Tenant {tenant.domain} ready.")

    # Get or create admin user
    admin_user = User.objects.filter(is_superuser=True).first()
    if not admin_user:
        admin_user = User.objects.create_superuser('admin', 'admin@example.com', 'admin')

    # Removed deletes to prevent SQLite locks

    # 1. Create Website
    website, _ = Website.objects.get_or_create(
        tenant=tenant,
        domain='bitguard.tech',
        defaults={
            'name': 'BitGuard Main Site',
            'language': 'en',
            'theme_color': '#3b82f6',
            'is_default': True
        }
    )
    print(f"Website: {website.name} created/found.")

    # 2. Create Pages
    pages_data = [
        {'title': 'Home', 'slug': 'home', 'content': '<h1>Welcome to BitGuard</h1><p>Your ultimate zero-trust security platform.</p>', 'status': 'published'},
        {'title': 'About Us', 'slug': 'about', 'content': '<h1>About BitGuard</h1><p>We are a team of cybersecurity experts.</p>', 'status': 'published'},
        {'title': 'Privacy Policy', 'slug': 'privacy', 'content': '<h1>Privacy Policy</h1><p>We respect your data.</p>', 'status': 'published'},
    ]

    for p in pages_data:
        page, _ = Page.objects.get_or_create(
            tenant=tenant,
            slug=p['slug'],
            defaults={
                'title': p['title'],
                'content': p['content'],
                'status': p['status'],
                'created_by': admin_user,
                'seo_description': f"This is the {p['title']} page."
            }
        )
        print(f"Page: {page.title} created/found.")

    # 3. Create Menus
    menus_data = [
        {'name': 'Home', 'url': '/', 'sequence': 10},
        {'name': 'About', 'url': '/about', 'sequence': 20},
        {'name': 'Blog', 'url': '/blog', 'sequence': 30},
        {'name': 'Contact', 'url': '/contact', 'sequence': 40},
    ]

    for m in menus_data:
        WebsiteMenu.objects.get_or_create(
            tenant=tenant,
            name=m['name'],
            website=website,
            defaults={
                'url': m['url'],
                'sequence': m['sequence']
            }
        )
    print("Website Menus created.")

    # 4. Create Blog Categories
    categories_data = ['Engineering', 'Security', 'Releases', 'Cloud']
    category_objs = {}
    for c in categories_data:
        cat, _ = Category.objects.get_or_create(name=c, website=website, tenant=tenant)
        category_objs[c] = cat
    print("Blog Categories created.")

    # 5. Create Blog Posts
    posts_data = [
        {
            'title': 'The Future of Zero-Trust Architecture',
            'category': 'Security',
            'content': '<p>Zero-trust architecture is no longer just a buzzword; it is a fundamental requirement for modern enterprise security.</p><p>By verifying every request, regardless of its origin, organizations can significantly reduce their attack surface and protect critical assets from sophisticated threats.</p>',
            'tags': ['zero-trust', 'architecture', 'enterprise'],
            'days_ago': 2
        },
        {
            'title': 'Introducing BitGuard 2.0: Cloud Native Protection',
            'category': 'Releases',
            'content': '<p>We are thrilled to announce the release of BitGuard 2.0.</p><p>This major release introduces cloud-native protection capabilities, enabling seamless integration with AWS, Azure, and Google Cloud environments.</p>',
            'tags': ['release', 'cloud', 'aws', 'azure'],
            'days_ago': 5
        },
        {
            'title': 'How to Secure Your Kubernetes Clusters',
            'category': 'Engineering',
            'content': '<p>Securing Kubernetes clusters is a complex challenge.</p><p>In this article, we dive deep into the best practices for configuring RBAC, network policies, and pod security admission controllers to harden your K8s deployments.</p>',
            'tags': ['kubernetes', 'devsecops', 'infrastructure'],
            'days_ago': 12
        }
    ]

    for p in posts_data:
        post, _ = Post.objects.get_or_create(
            tenant=tenant,
            title=p['title'],
            defaults={
                'author': admin_user,
                'content': p['content'],
                'category': category_objs[p['category']],
                'website': website,
                'status': 'published',
                'publish_date': timezone.now() - timedelta(days=p['days_ago']),
                'meta_description': p['content'][:150]
            }
        )
        print(f"Blog Post: {post.title} created/found.")

    print("Seeding complete! Refresh your dashboard.")

if __name__ == '__main__':
    seed_data()

