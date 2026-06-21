from django.db import models
from django.utils import timezone
from django.conf import settings
from apps.core.models import TenantAwareModel

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
    """
    Marketing/Content page for a Service managed by the CMS.
    Links to the master 'erp.Service' for pricing and logic.
    """
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
    linked_service = models.ForeignKey('services.ServiceItem', on_delete=models.SET_NULL, null=True, blank=True, related_name='marketing_pages')
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
