import os
import shutil

backend_dir = "."

# 1. Update website models
website_models_path = os.path.join(backend_dir, "apps", "website", "domain", "models.py")
with open(website_models_path, 'r') as f:
    website_models = f.read()

if "MediaAsset" not in website_models:
    website_models = website_models.replace("from django.urls import reverse", "from django.urls import reverse\nfrom django.conf import settings\nfrom apps.core.domain.models import TenantAwareModel")
    
    cms_models_addition = """

class MediaAsset(TenantAwareModel):
    file = models.FileField(upload_to='cms_media/%Y/%m/%d/')
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50) # e.g. image/png, application/pdf
    file_size = models.PositiveIntegerField(help_text="File size in bytes")
    dimensions = models.CharField(max_length=50, blank=True, help_text="e.g. 1920x1080")
    alt_text = models.CharField(max_length=255, blank=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.filename

class ServicePage(TenantAwareModel):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=100) # FontAwesome class
    hero_bg = models.CharField(max_length=200) # CSS gradient
    hero_image = models.CharField(max_length=255) # Path to image
    content = models.TextField() # HTML content
    features = models.JSONField(default=list)
    content_data = models.JSONField(default=dict, blank=True)
    linked_service = models.ForeignKey('ecommerce.Product', on_delete=models.SET_NULL, null=True, blank=True, related_name='marketing_pages')
    status = models.CharField(max_length=20, choices=[('draft', 'Draft'), ('published', 'Published'), ('archived', 'Archived')], default='draft')
    published_at = models.DateTimeField(null=True, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='authored_service_pages')
    version = models.IntegerField(default=1)

    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    og_image = models.ForeignKey(MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name='+')

    def __str__(self):
        return self.title

class Page(TenantAwareModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    content = models.JSONField(default=list, help_text="List of content blocks")
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=[('draft', 'Draft'), ('published', 'Published'), ('archived', 'Archived')], default='draft')
    published_at = models.DateTimeField(null=True, blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='authored_pages')
    version = models.IntegerField(default=1)
    
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    og_image = models.ForeignKey(MediaAsset, on_delete=models.SET_NULL, null=True, blank=True, related_name='+')

    def __str__(self):
        return self.title
"""
    with open(website_models_path, 'w') as f:
        f.write(website_models + cms_models_addition)

# 2. Delete CMS app
cms_dir = os.path.join(backend_dir, "apps", "cms")
if os.path.exists(cms_dir):
    shutil.rmtree(cms_dir)

# 3. Update urls.py
urls_path = os.path.join(backend_dir, "api", "urls.py")
with open(urls_path, 'r') as f:
    urls_content = f.read()

urls_content = urls_content.replace("path('cms/', include('apps.cms.api.urls')),", "path('elearning/', include('apps.elearning.api.urls')),")
with open(urls_path, 'w') as f:
    f.write(urls_content)

# 4. Update base.py
base_path = os.path.join(backend_dir, "config", "settings", "base.py")
with open(base_path, 'r') as f:
    base_content = f.read()

base_content = base_content.replace("'apps.cms',", "'apps.elearning',")
with open(base_path, 'w') as f:
    f.write(base_content)

print("Files migrated successfully.")
